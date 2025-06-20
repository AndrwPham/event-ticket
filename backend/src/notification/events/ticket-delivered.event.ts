export class TicketDeliveredEvent {
  constructor(
    public readonly ticketId: string,
    public readonly recipientEmail: string,
    public readonly firebasePayload: any,
    public readonly deliveryStatus: 'pending' | 'sent' | 'failed',
    public readonly metadata?: any,
  ) {}
}
