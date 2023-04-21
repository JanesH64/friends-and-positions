export interface User {
    loginName: string | null,
    passwort?: {
        passwort: string | null
    }
    session?: string
}