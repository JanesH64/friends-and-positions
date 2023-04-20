export interface PostalCodeResponse {
    postalCodes: Place[]
}

export interface Place {
    placeName: string;
    postalCode: string;
    countryCode: string;
}