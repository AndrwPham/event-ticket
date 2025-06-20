import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class WelcomeHandler {
  async handle(event: UserCreatedEvent) {
    // TODO: Send welcome email/message
  }
}
