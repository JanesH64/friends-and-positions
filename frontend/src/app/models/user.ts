export interface User {
    loginName: string | null,
    passwort?: {
        passwort: string | null
    }
    sitzung?: string
}