export class NounModifier {
    SHORT_DESC: string;
    LONG_DESC: string;
    MANUFACTURER: string;
    PARTNO: string;
    NOUN_LONG: string;
    NOUN_CODE: string;
    NOUN_ID: string;
    MODE_CODE: string;
    MOD_LONG: string;
    UNSPSC: string;
    UNSPSC_DESC: string;
    MGROUP: string;
    ATTRIBUTES: AttributesDoc[];
}

export class AttributesDoc {
    MANDATORY: string;
    ATTRIBUTE_ID: string;
    ATTR_DESC: string;
    ATTR_CODE: string;
    TEXT_FIELD: string;
    DROPDOWN_FIELD: string;
    ATTRIBUTES_VALUES: AttributesValuesDoc[];
    localAttributeCode?: string;
    localAttributeText?: string;
    status?: string;

}

export class AttributesValuesDoc {
    ATTRIBUTE_ID: string;
    SHORT_VALUE: string;
    CODE: string;
    LONG_VALUE: string;
}