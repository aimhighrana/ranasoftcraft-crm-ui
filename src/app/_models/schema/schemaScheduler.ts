export interface SchemaScheduler {
    isEnabled: boolean;
    schemaId: string;
    repeat: SchemaSchedulerRepeat;
    repeatValue: number;
    weeklyOn: WeekOn;
    monthOn: MonthOn;
    startOn: number;
    end: SchemaSchedulerEnd;
    occurrenceVal: number;
    endOn: number;
}
export enum SchemaSchedulerRepeat {
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}
export enum SchemaSchedulerRepeatMetric {
    HOURLY = 'Hours',
    DAILY = 'Days',
    WEEKLY = 'Weeks',
    MONTHLY = 'Months',
    YEARLY = 'Years'
}
export enum SchemaSchedulerEnd {
    NEVER = 'NEVER',
    AFTER = 'AFTER',
    ON = 'ON'
}
export enum MonthOn {
    DAY_OF_MONTH = 'DAY OF MONTH',
    DAY_OF_WEEK = 'DAY OF WEEK'
}
export enum WeekOn {
    MONDAY = 'MON',
    TUESDAY = 'TUE',
    WEDNESDAY = 'WED',
    THUSDAY = 'THU',
    FRIDAY = 'FRI',
    SATURDAY = 'SAT',
    SUNDAY = 'SUSN',
}