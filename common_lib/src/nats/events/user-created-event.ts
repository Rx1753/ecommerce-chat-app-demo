import { Subjects } from '../enums/subjects';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
  };
}
