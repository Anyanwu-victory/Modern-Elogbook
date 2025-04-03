export {}


//Create a type for the roles

export type Roles = "student" | "Industry supervisor" | "Insitution supervisor" |"ITF Personnel" | "admin";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        }
    }
}