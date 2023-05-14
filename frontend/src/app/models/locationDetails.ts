export interface LocationDetails {
    standort: {
        breitengrad: number | null,
        laengengrad: number | null
    }
    ergebnis: boolean | null;
}