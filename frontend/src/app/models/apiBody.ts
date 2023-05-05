export interface ApiBody {
    "loginName": string,
    "sitzung": string,
    "standort": {
        "breitengrad": number,
        "laengengrad": number
    }
}