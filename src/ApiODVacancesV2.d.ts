declare module ApiODVacancesV2 {

    export interface Link {
        href: string;
        rel: string;
    }

    export interface Facet2 {
        count: number;
        state: string;
        name: string;
        value: string;
    }

    export interface Facet {
        name: string;
        facets: Facet2[];
    }

    export interface RootObject {
        links: Link[];
        facets: Facet[];
    }

}

