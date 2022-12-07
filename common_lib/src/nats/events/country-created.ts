import { Subjects } from "../enums/subjects";
export interface CountryCreatedEvent {
    subject: Subjects.CountryCreated,
    data: {
        id: string,
        countryName: string,
    }
}