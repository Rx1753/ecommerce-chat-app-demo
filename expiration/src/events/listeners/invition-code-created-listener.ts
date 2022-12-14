import {
  Listener,
  InvitionCodeCreatedEvent,
  Subjects,
} from "@rx-ecommerce-chat/common_lib";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroup } from "./queue-group-name";

export class InvitionCodeCreatedListener extends Listener<InvitionCodeCreatedEvent> {

  subject: Subjects.InvitionCodeCreated = Subjects.InvitionCodeCreated;
  queueGroupName: string = queueGroup;
  async onMessage(data: InvitionCodeCreatedEvent['data'], msg: Message
  ) {

    console.log('Waiting Delay:', 20000);
    await expirationQueue.add({
      orderId: data.id,
    },
      {
        delay: 20000
      }
    );
    msg.ack();
  }
}
