export interface PostalCodeResponse {
    postalCodes: Place[]
}

export interface Place {
    name: string;
    plz: string;
    province: string;
}