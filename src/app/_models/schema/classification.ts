export interface Attribute {
    sno: number;
    nounCode: string;
    attrCode: string;
    attrDesc: string;
    prefix: string;
    type: AttributeDataType;
    attFieldLen;
    attFieldType;
    attributeOrder;
    attributeValuesModels;
    descActive: string;
    helpText: string;
    isActive: string;
    isCheckList;
    longPrefix: string;
    longSuffix: string;
    mandtory: string;
    numCode: string;
    sapChars: string;
    suffix: string;
    uom;
    uomValue;
}

export enum AttributeDataType {
    TEXT = '0',
    NUMBER = '1',
    LIST = '2'
}

/* export interface Modifier {
    sno: number;
    nounCode: string;
    nounNumCode: string;
    nounLong: string;
    modeCode: string;
    modNumCode: string;
    modLong: string;
    unspcCode: string;
    gs1Code: string;
    shortDescActive: string;
    active: string;
    plantCode: string;
    objectType: string;
} */

export interface CreateNounModRequest {
    nounCode: string;
    nounNumCode: string;
    nounLong: string;
    modeCode: string;
    modNumCode: string;
    modLong: string;
    unspcCode: string;
    gs1Code: string;
    shortDescActive: string;
    active: string;
    plantCode: string;
    objectType: string;
}

export interface AttributesMapping {
    libraryNounCode: string;
    localNounCode: string;
    libraryModCode: string;
    localModCode: string;
    attributeMapData: AttributeMapData[];
}

export interface AttributeMapData {
    libraryAttributeCode: string;
    localAttributeCode: string;
}
