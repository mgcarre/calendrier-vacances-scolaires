import calendar from './Calendar';
import '../input.scss';
import { CalendarEvents } from './CalendarEvents';
import { config as zones } from './zones';
import { IZones } from './IZones';

const evts = new CalendarEvents(calendar, zones);
const selectZones = document.querySelector('#zones');
zones.sort((a, b) => a.name.localeCompare(b.name));
zones.forEach((zone: IZones) => {
    const opt = document.createElement('option')
    opt.innerText = zone.name;
    opt.dataset.params = zone.official.toString();
    opt.value = zone.name;
    selectZones.appendChild(opt)
});
selectZones.addEventListener('change', async (e) => evts.onEventFired(e));
document.querySelector('.calendar').addEventListener('yearChanged', async (e) => evts.onEventFired(e));

