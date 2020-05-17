import Calendar from 'js-year-calendar';
import 'js-year-calendar/locales/js-year-calendar.fr';
import { ICalendarEvent } from './ICalendarEvent';
import { IZones } from './IZones';

/**
 * Classe permettant de gérer les événements requis par l'objet Calendar du NS js-year-calendar
 *
 * @export
 * @class CalendarEvents
 */
export class CalendarEvents {
    private year: number;
    private calendar: Calendar<ICalendarEvent>;
    private element: HTMLSelectElement;
    private maxRowsQueried = 500;
    private zones: IZones[];

    /**
     * Creates an instance of CalendarEvents.
     * @param {JsYearCalendar.Calendar} calendar
     * @param {string} [htmlElement='#zones']
     * @memberof CalendarEvents
     */
    constructor(calendar: Calendar<ICalendarEvent>, zones: IZones[], htmlElement = '#zones') {
        this.year = calendar.getYear()
        this.calendar = calendar
        this.element = document.querySelector<HTMLSelectElement>(htmlElement)
        this.zones = zones;
    }

    /**
     * Méthode permettant de charger les vacances pour une zone donnée uniquement
     *
     * @public
     * @async
     * @returns {Promise<ICalendarEvent[]>}
     * @memberof CalendarEvents
     */
    public async getVacances(): Promise<ICalendarEvent[]> {
        return await fetch(`https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-calendrier-scolaire&q=&rows=${this.maxRowsQueried}&sort=-start_date&facet=description&facet=start_date&facet=end_date&facet=location&facet=zones&facet=annee_scolaire&refine.zones=${encodeURIComponent(this.element.value)}&refine.start_date=${this.year}&refine.end_date=${this.year}`)
            .then(rep => rep.json())
            .then((rep: ApiODVacances.RootObject) => {
                return rep.records.map(record => {
                    const fin = record.fields.end_date ? record.fields.end_date : record.fields.start_date
                    const population = record.fields.population ? ` - dédiées aux ${record.fields.population}` : ``;
                    return this.buildEvent(record.fields.start_date, fin, `${record.fields.description} (Année ${record.fields.annee_scolaire}${population})`, this.parseConsonnance(record.fields.location))
                })
            })

    }

    /**
     * Méthode permettant de charger uniquement les jours fériés pour une année donnée
     * @public
     * @async
     * @returns {Promise<ICalendarEvent[]>}
     * @memberof CalendarEvents
     */
    public async getJoursFeries(zone: string): Promise<ICalendarEvent[]> {
        return await fetch(`https://etalab.github.io/jours-feries-france-api/${zone}/${this.year}.json`).then(rep => rep.json()).then((rep: { [key: string]: string }[]) => {
            const keys = Object.keys(rep);
            return keys.map(key => this.buildEvent(key, key, rep[key], `${this.parseConsonnance(zone, 'Jour ferié officiel')}`, '#ccc'));
        })
    }

    /**
     * Methode utilisée pour mettre à jour les jours fériés et les vacances
     * 
     * @public
     * @async
     * @returns {Promise<ICalendarEvent[]>}
     * @memberof CalendarEvents
     */
    public async updateData(): Promise<ICalendarEvent[]> {

        let jf: ICalendarEvent[] = [];
        const zone = this.findZone();
        if (Array.isArray(zone.official)) {
            await zone.official.forEach(async (param) => await (await this.getJoursFeries(param)).forEach(e => jf.push(e)))
        } else {
            jf = await this.getJoursFeries(zone.official);
        }
        const vs = await this.getVacances()
        return jf.concat(vs)
    }

    /**
     * Méthode permettant de déclencher la mise à jour du calendrier lors du déclenchement d'un événement
     *
     * @param {Event} e event fired from DOM
     * @returns {Promise<void>}
     * @memberof CalendarEvents
     */
    public async onEventFired(e: Event): Promise<void> {
        e.preventDefault();
        this.year = this.calendar.getYear();
        const val = this.element.value;
        if (val != "0") {
            const data = await this.updateData();
            this.calendar.setDataSource(data);
        }
    }

    /**
     * Méthode pour créer un événement
     *
     * @private
     * @param {string} startDate
     * @param {string} endDate
     * @param {string} name
     * @param {string} details
     * @param {string} [color]
     * @returns {ICalendarEvent}
     * @memberof CalendarEvents
     */
    private buildEvent(startDate: string, endDate: string, name: string, details: string, color?: string): ICalendarEvent {
        const offset = -(new Date().getTimezoneOffset()); // on intègre le TZ actuel
        const calculatedEnd = +new Date(endDate) - (offset * 60 * 60 * 1000); // On réduit de 3h car date de fin correspond à date de reprise (ne doit pas être incluse)...
        let finalDate: Date;
        if (details === 'Jour Ferié') {
            finalDate = new Date(calculatedEnd);
        } else {
            finalDate = new Date(endDate);
        }
        return {
            startDate: new Date(startDate),
            endDate: finalDate,
            name: name,
            details: details,
            color: color
        }
    }

    /**
     * Méthode privée pour renvoyer un nom propre formaté
     *
     * @private
     * @example "Académie d'Aix-Marseille" / "Académie de Nice"
     * @param {string} consonnance Nom propre à précéder d'une préposition formattée
     * @param {string} [name='Académie'] Phrase ou mots à précéder
     * @returns {string} Retourne l'assemblage formatté
     * @memberof CalendarEvents
     */
    private parseConsonnance(consonnance: string, name = 'Académie'): string {
        const voyelles = new RegExp(/^[aeiouy]{1}/, 'gi')
        return voyelles.test(consonnance) ? `${name} d'${consonnance}` : `${name} de ${consonnance}`
    }
    /**
     * Méthode pour trouver la zone active et déduire les jours fériés
     *
     * @private
     * @returns {IZones}
     * @memberof CalendarEvents
     */
    private findZone(): IZones {
        return this.zones.find(zone => this.element.value === zone.name);
    }

}