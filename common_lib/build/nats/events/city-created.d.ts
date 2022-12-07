import { Subjects } from "../enums/subjects";
export interface CityCreatedEvent {
    subject: Subjects.CityCreated;
    data: {
        id: string;
        cityName: string;
        stateId: string;
    };
}
