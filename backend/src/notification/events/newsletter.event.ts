export class NewsletterEvent {
  constructor(
    public readonly subject: string,
    public readonly content: string,
    public readonly recipients: string[],
    public readonly scheduledAt?: Date,
  ) {}
}
