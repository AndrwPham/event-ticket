export class EventNotificationEvent {
  constructor(
    public readonly eventId: string,
    public readonly type: 'reminder' | 'update' | 'cancellation' | 'custom',
    public readonly subject: string,
    public readonly content: string,
    public readonly recipients: string[],
    public readonly scheduledAt?: Date,
    public readonly metadata?: any,
  ) {}
}
