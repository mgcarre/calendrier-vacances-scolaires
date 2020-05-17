import CalendarDataSourceElement from "js-year-calendar/dist/interfaces/CalendarDataSourceElement";

/**
 * Interface pour gérer les propriétés requises
 * 
 * @interface ICalendarEvent
 */
export interface ICalendarEvent extends CalendarDataSourceElement {
    startDate: Date;
    endDate: Date;
    name: string;
    details: string;
    color?: string;
}

