declare module ApiODVacances {

    export interface Link {
        href: string;
        rel: string;
    }

    export interface Link2 {
        href: string;
        rel: string;
    }

    export interface Fields {
        description: string;
        end_date: string;
        zones: string;
        annee_scolaire: string;
        location: string;
        start_date: string;
        population?: any;
    }

    export interface Record2 {
        id: string;
        timestamp: Date;
        size: number;
        fields: Fields;
    }

    export interface Record {
        links: Link2[];
        record: Record2;
    }

    export interface RootObject {
        total_count: number;
        links: Link[];
        records: Record[];
    }

}

