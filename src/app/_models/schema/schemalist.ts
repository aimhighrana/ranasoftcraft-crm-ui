export interface SchemaList{
    details:Array<SchemaListModule>;
}
export interface SchemaListModule{
    module:Array<SchemaDetails>;
}
export interface SchemaDetails {
    schemaId:string;
    title:string;
    totalValue:string;
    thisWeekProgress:string;
    enableProgressBar:boolean;
    successValue:number;
    errorValue:number,
    details:Details;
    variants:Variants;
}
export interface Details{
    structure:string;
    owner:Array<string>;
    date:string;
}
export interface Variants{
    total_variants:number;
}
export interface FilterFieldModel{
    fieldId:string;
    fieldDesc:string;
    picklist:string;
    dataType:string;
}
