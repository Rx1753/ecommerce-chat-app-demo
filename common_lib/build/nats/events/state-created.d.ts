import { Subjects } from "../enums/subjects";
export interface StateCreatedEvent {
    subject: Subjects.StateCreated;
    data: {
        id: string;
        stateName: string;
        countryId: string;
    };
}
