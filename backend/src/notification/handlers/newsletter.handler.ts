import { Injectable } from '@nestjs/common';
import { NewsletterEvent } from '../events/newsletter.event';

@Injectable()
export class NewsletterHandler {
  async handle(event: NewsletterEvent) {
    // TODO: Send newsletter to recipients
  }
}
