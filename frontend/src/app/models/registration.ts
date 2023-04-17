export interface Registration {
    loginName: string | null,
    passwort: {
        passwort: string | null
    }
    vorname: string | null,
    nachname: string | null,
    strasse: string | null,
    plz: string | null,
    ort: string | null,
    land: string | null,
    telefon: string | null,
    email: {
        adresse: string | null
    }
}