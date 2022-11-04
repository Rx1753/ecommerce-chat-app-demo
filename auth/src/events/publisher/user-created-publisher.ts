import {
  UserCreatedEvent,
  Publisher,
  Subjects,
} from '@rx-ecommerce-chat/common_lib';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
