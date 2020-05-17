declare module ApiODVacances {

    export interface Parameters {
        dataset: string;
        timezone: string;
        rows: number;
        sort: string[];
        format: string;
        facet: string[];
    }

    export interface Fields {
        description: string;
        end_date: string;
        zones: string;
        annee_scolaire: string;
        location: string;
        start_date: string;
        population: string;
    }

    export interface Record {
        datasetid: string;
        recordid: string;
        fields: Fields;
        record_timestamp: Date;
    }

    export interface Facet {
        count: number;
        path: string;
        state: string;
        name: string;
    }

    export interface FacetGroup {
        facets: Facet[];
        name: string;
    }

    export interface RootObject {
        nhits: number;
        parameters: Parameters;
        records: Record[];
        facet_groups: FacetGroup[];
    }

}

