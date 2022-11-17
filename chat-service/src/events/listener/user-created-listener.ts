import {
  Listener,
  UserCreatedEvent,
  Subjects,
} from '@rx-ecommerce-chat/common_lib';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/User';
import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, firstName, lastName, email, type } = data;
    const user = User.build({
      //id: id,
      firstName: firstName,
      lastName: lastName,
      type: type,
      email: email,
      password: '',
    });

    await user.save();
    msg.ack();
  }
}
