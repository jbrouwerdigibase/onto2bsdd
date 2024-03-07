export type OntoBsddQueryResult = {
  ontoClassPrefLabel: string;
  ontoClassURI: string;
  ontoClassDefinition: string | null;
  mappedClassRelation: string | null;
  mappedClassRelationURI: string | null;
  mappedClassURI: string | null;
  ontoParentClassPrefLabel: string | null;
  ontoParentClass: string | null;
  ontoPropertyURI: string | null;
  ontoPropertyPrefLabel: string | null;
  ontoPropertyDatatypeLabel: string | null;
  ontoPropertyDatatype: string | null;
  ontoPropertyDefinition: string | null;
};
