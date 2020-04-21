export class Widget {
    x: number;
    y: number;
    height: number;
    width: number;
    widgetId: string;
    widgetType: WidgetType;

    constructor(x: number, y: number, height: number, width: number, widgetId: string, widgetType: WidgetType) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.widgetId = widgetId;
        this.widgetType = widgetType;
    }
}

export enum WidgetType {
    FILTER,
    BAR_CHART,
    STOCKBAR_CHART,
    COUNT,
    TABLE_LIST
}
