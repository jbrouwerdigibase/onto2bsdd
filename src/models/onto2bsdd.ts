/* SPDX-License-Identifier: Apache-2.0
   Copyright © 2023 Sander Stolk */

import {
  Class,
  ClassProperty,
  ClassRelation,
  Property,
  UploadImportFile,
} from "../utils/bsddUploadTypes";
import { OntoBsddQueryResult } from "./onto2bsddTypes";

const DEFAULT_URI = "http://www.example.org/";
const OLD_IFC_URI = "buildingsmart/ifc-4.3/";
const NEW_IFC_URI = "buildingsmart/ifc/4.3/";

export class Onto2bsdd {
  /* Transforms input CSV content to bSDD in its JSON import model format.
       The CSV content is expected to have a header with the following columns:
       - ontoClassPrefLabel
       - ontoClassURI
       - ontoClassDefinition
       - ifcClassLabel
       - ifcClassURI
       - ontoParentClassPrefLabel
       - ontoParentClass
       - ontoPropertyURI
       - ontoPropertyPrefLabel
       - ontoPropertyDatatypeLabel
       - ontoPropertyDatatype
       
       For documentation on the bSDD import model, see: 
       https://github.com/buildingSMART/bSDD/blob/master/Documentation/bSDD%20JSON%20import%20model.md .
    */
  static fromCSV(
    csvObjects: OntoBsddQueryResult[],
    header: UploadImportFile
  ): string {
    const bsddImportData: UploadImportFile = { ...header };

    // set release date to now
    bsddImportData.ReleaseDate = new Date().toISOString();

    const dictionaryUri = bsddImportData.DictionaryUri;
    const resultClassifications: Class[] = [];
    const resultProperties: Property[] = [];
    // const resultMaterials = [];

    for (const csvObject of csvObjects) {
      const ontoClassURI = replaceDefaultUri(
        csvObject.ontoClassURI,
        dictionaryUri
      );
      const ontoParentClass = replaceDefaultUri(
        csvObject.ontoParentClass,
        dictionaryUri
      );
      const ontoPropertyURI = replaceDefaultUri(
        csvObject.ontoPropertyURI,
        dictionaryUri
      );
      // const classCode = csvObject.ontoClassPrefLabel
      // .replace(/[#%\/\:\{\}\[\]\|;<>?`~\s]/g, "")
      // .toLowerCase(),

      let resultClassificationObject = Onto2bsdd.getObjectWithProperty(
        resultClassifications,
        "OwnedUri",
        ontoClassURI
      ) as Class;

      if (!resultClassificationObject) {
        resultClassificationObject = {
          ClassType: "Class",
          Code: Onto2bsdd.getLocalname(ontoPropertyURI) as string,
          Definition: csvObject.ontoPropertyDefinition
            ? csvObject.ontoPropertyDefinition
            : "",
          Name: csvObject.ontoClassPrefLabel,
          OwnedUri: ontoClassURI,
          ParentClassCode: Onto2bsdd.getLocalname(ontoParentClass),
          // RelatedIfcEntityNamesList: [csvObject.ifcClassLabel],
          Status: "Preview",
          ClassRelations: [],
          ClassProperties: [],
        };
        resultClassifications.push(resultClassificationObject);
      }

      if (ontoPropertyURI) {
        let resultPropertyObject = Onto2bsdd.getObjectWithProperty(
          resultProperties,
          "OwnedUri",
          ontoPropertyURI
        ) as Property;
        if (!resultPropertyObject) {
          const bsddDatatype =
            csvObject.ontoPropertyDatatypeLabel == "QuantityValue"
              ? "Real"
              : csvObject.ontoPropertyDatatypeLabel == "gYear"
              ? "Time"
              : "String";
          resultPropertyObject = {
            Code: Onto2bsdd.getLocalname(ontoPropertyURI) as string,
            DataType: bsddDatatype,
            Definition: csvObject.ontoPropertyDefinition
              ? csvObject.ontoPropertyDefinition
              : "",
            Name: csvObject.ontoPropertyPrefLabel
              ? csvObject.ontoPropertyPrefLabel
              : "",
            OwnedUri: ontoPropertyURI,
          };
          resultProperties.push(resultPropertyObject);
        }

        const classProperty: ClassProperty = {
          // Code: md5(
          //   resultClassificationObject.Code + "-" + resultPropertyObject.Code
          // ),
          Code: resultPropertyObject.Code,
          PropertyCode: resultPropertyObject.Code,
          PropertySet: bsddImportData.DictionaryCode,
          PropertyType: "Property",
        };
        if (ontoPropertyURI.includes(dictionaryUri)) {
          classProperty.OwnedUri = ontoPropertyURI;
        } else {
          classProperty.OwnedUri =
            dictionaryUri + "class-property-fake-uri-404";
        }
        if (!resultClassificationObject.ClassProperties) {
          resultClassificationObject.ClassProperties = [];
        }
        resultClassificationObject.ClassProperties.push(classProperty);
      }

      if (csvObject.mappedClassURI && csvObject.mappedClassRelation) {
        const classRelation: ClassRelation = {
          RelationType: csvObject.mappedClassRelation,
          RelatedClassUri: replaceIfcUri(csvObject.mappedClassURI),
        };
        if (csvObject.mappedClassURI.includes(dictionaryUri)) {
          classRelation.OwnedUri = csvObject.mappedClassURI;
        } else {
          classRelation.OwnedUri =
            dictionaryUri + "class-relation-fake-uri-404";
        }
        if (!resultClassificationObject.ClassRelations) {
          resultClassificationObject.ClassRelations = [];
        }
        resultClassificationObject.ClassRelations.push(classRelation);
      }

      if (resultClassificationObject?.ClassRelations?.length === 0) {
        delete resultClassificationObject.ClassRelations;
      }

      if (resultClassificationObject?.ClassProperties?.length === 0) {
        delete resultClassificationObject.ClassProperties;
      }
    }

    bsddImportData.Classes = resultClassifications;
    bsddImportData.Properties = resultProperties;
    // result.Materials = resultMaterials;

    Onto2bsdd.pruneInternalReferences(bsddImportData);
    console.log(JSON.stringify(bsddImportData, null, 2));
    return JSON.stringify(bsddImportData, null, 2);
  }

  static getLocalname(uri: string | undefined) {
    if (!uri) return undefined;
    if (uri.includes("#")) return uri.split("#").pop();
    return uri.split("/").pop();
  }

  static getObjectWithProperty(
    containerObject: Class[] | Property[],
    propertyName: string,
    propertyValue: string | undefined
  ): Class | Property | null {
    for (const object of containerObject) {
      if (
        object.hasOwnProperty(propertyName) &&
        object[propertyName as keyof typeof object] == propertyValue
      )
        return object;
    }
    return null;
  }

  static pruneInternalReferences(result: UploadImportFile) {
    for (const classification of result.Classes) {
      if (
        !Onto2bsdd.isPresent(classification.ParentClassCode, result.Classes)
      ) {
        classification.ParentClassCode = undefined;
      }
      if (classification.ClassProperties) {
        for (const classificationProperty of classification.ClassProperties) {
          if (
            !Onto2bsdd.isPresent(
              classificationProperty.PropertyCode,
              result.Properties
            )
          ) {
            classificationProperty.PropertyCode = undefined;
          }
        }
      }
    }
  }

  static isPresent(code: string | undefined, array: Class[] | Property[]) {
    if (!array || !code) {
      return false;
    }
    for (const e of array) {
      if (e.Code == code) {
        return true;
      }
    }
    return false;
  }
}

function replaceDefaultUri(uri: string | null, dictionaryUri: string) {
  return uri ? uri.replace(DEFAULT_URI, dictionaryUri) : undefined;
}

function replaceIfcUri(uri: string) {
  return uri && uri.includes(OLD_IFC_URI)
    ? uri.replace(OLD_IFC_URI, NEW_IFC_URI)
    : uri;
}
