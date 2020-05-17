import Calendar from 'js-year-calendar';
import 'js-year-calendar/locales/js-year-calendar.fr';
import 'js-year-calendar/dist/js-year-calendar.css';
import CalendarOptions from 'js-year-calendar/dist/interfaces/CalendarOptions';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { ICalendarEvent } from './ICalendarEvent';

let tooltip: Instance = null;
const currentYear = new Date().getFullYear()
const calendarOptions: CalendarOptions<ICalendarEvent> = {
    language: 'fr',
    style: 'background',
    displayWeekNumber: true,
    disabledWeekDays: [0, 6],
    allowOverlap: true,
    minDate: new Date(currentYear - 1, 0, 1),
    maxDate: new Date(currentYear + 1, 11, 31),
    loadingTemplate: '',
    mouseOnDay: function (e) {
        if (e.events.length > 0) {
            var content = ''

            for (var i in e.events) {
                content += `<div class="event-tooltip-content">
                            <div class="event-name">${e.events[i].name}</div>
                            <div class="event-details">${e.events[i].details}</div>
                            </div>`
            }

            if (tooltip !== null) {
                tooltip.destroy();
                tooltip = null;
            }

            tooltip = tippy(e.element, {
                placement: 'right',
                allowHTML: true,
                content: content,
                animation: 'shift-away',
                arrow: false,
                interactiveDebounce: 75,
            });
            tooltip.show();
        }
    },
    mouseOutDay: function () {
        if (tooltip !== null) {
            tooltip.destroy();
            tooltip = null;
        }
    }
}
const calendar = new Calendar('.calendar', calendarOptions);

export default calendar;
