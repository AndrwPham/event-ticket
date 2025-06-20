import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class AuthConfirmationHandler {
  async handle(event: UserCreatedEvent) {
    // TODO: Generate confirmation link from code, send email
  }
}
