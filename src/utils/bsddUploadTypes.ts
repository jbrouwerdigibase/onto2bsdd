export interface AllowedValues {
  Code: string;
  Value: string;
  Description: string;
  Uri: string;
  SortNumber: string;
  OwnedUri: string;
}

export interface ClassProperty {
  Code: string;
  PropertyCode?: string;
  PropertyUri?: string;
  Description?: string;
  PropertySet?: string;
  Unit?: string;
  PredefinedValue?: string;
  IsRequired?: string;
  IsWritable?: string;
  MaxExclusive?: string;
  MaxInclusive?: string;
  MinExclusive?: string;
  MinInclusive?: string;
  Pattern?: string;
  OwnedUri?: string;
  PropertyType?: string;
  SortNumber?: string;
  Symbol?: string;
  AllowedValues?: AllowedValues[];
}

export interface ClassRelation {
  RelationType: string;
  RelatedClassUri: string;
  RelatedClassName?: string;
  Fraction?: string;
  OwnedUri?: string;
}

export interface PropertyRelation {
  RelatedPropertyName?: string;
  RelatedPropertyUri: string;
  RelationType: string;
  OwnedUri?: string;
}

export interface Class {
  Code: string;
  Name: string;
  ClassType: string;
  Definition?: string;
  Description?: string;
  ParentClassCode?: string;
  RelatedIfcEntityNamesList?: [];
  Synonyms?: [];
  ActivationDateUtc?: string;
  ReferenceCode?: string;
  CountriesOfUse?: [];
  CountryOfOrigin?: string;
  CreatorLanguageIsoCode?: string;
  DeActivationDateUtc?: string;
  DeprecationExplanation?: string;
  DocumentReference?: string;
  OwnedUri?: string;
  ReplacedObjectCodes?: [];
  ReplacingObjectCodes?: [];
  RevisionDateUtc?: string;
  RevisionNumber?: string;
  Status?: string;
  SubdivisionsOfUse?: [];
  Uid?: string;
  VersionDateUtc?: string;
  VersionNumber?: string;
  VisualRepresentationUri?: string;
  ClassProperties?: ClassProperty[];
  ClassRelations?: ClassRelation[];
}

export interface Property {
  Code: string;
  Name: string;
  Definition?: string;
  Description?: string;
  DataType?: string;
  Units?: [];
  Example?: string;
  ActivationDateUtc?: string;
  ConnectedPropertyCodes?: [];
  CountriesOfUse?: [];
  CountryOfOrigin?: string;
  CreatorLanguageIsoCode?: string;
  DeActivationDateUtc?: string;
  DeprecationExplanation?: string;
  Dimension?: string;
  DimensionLength?: string;
  DimensionMass?: string;
  DimensionTime?: string;
  DimensionElectricCurrent?: string;
  DimensionThermodynamicTemperature?: string;
  DimensionAmountOfSubstance?: string;
  DimensionLuminousIntensity?: string;
  DocumentReference?: string;
  DynamicParameterPropertyCodes?: [];
  IsDynamic?: boolean;
  MaxExclusive?: string;
  MaxInclusive?: string;
  MinExclusive?: string;
  MinInclusive?: string;
  MethodOfMeasurement?: string;
  OwnedUri?: string;
  Pattern?: string;
  PhysicalQuantity?: string;
  PropertyValueKind?: string;
  ReplacedObjectCodes?: [];
  ReplacingObjectCodes?: [];
  RevisionDateUtc?: string;
  RevisionNumber?: string;
  Status?: string;
  SubdivisionsOfUse?: [];
  TextFormat?: string;
  Uid?: string;
  VersionDateUtc?: string;
  VersionNumber?: string;
  VisualRepresentationUri?: string;
  PropertyRelations?: PropertyRelation[];
  AllowedValues?: AllowedValues[];
}

export interface UploadImportFile {
  ModelVersion: "2.0";
  OrganizationCode: string;
  DictionaryCode: string;
  DictionaryName: string;
  DictionaryVersion: string;
  LanguageIsoCode: string;
  LanguageOnly: boolean;
  UseOwnUri: boolean;
  DictionaryUri: string;
  License?: string;
  LicenseUrl?: string;
  ChangeRequestEmailAddress?: string;
  MoreInfoUrl?: string;
  QualityAssuranceProcedure?: string;
  QualityAssuranceProcedureUrl?: string;
  ReleaseDate?: string;
  Status?: string;
  Classes: Class[];
  Properties: Property[];
}
