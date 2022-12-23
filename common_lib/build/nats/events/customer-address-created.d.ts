import { Subjects } from "../enums/subjects";
export interface CustomerAddressCreatedEvent {
    subject: Subjects.CustomerAddressCreated;
    data: {
        id: string;
        customerId: string;
        phoneNumber: number;
        addressType: string;
        isDefalultAddress: boolean;
        addressLine1: string;
        addressLine2: string;
        cityId: string;
        stateId: string;
        countryId: string;
        zipCodes: number;
    };
}
