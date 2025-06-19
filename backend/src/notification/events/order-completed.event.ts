export class OrderCompletedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId?: string,
    public readonly guestEmail?: string,
    public readonly items?: any[],
    public readonly totalAmount?: number,
    public readonly ticketInfo?: any,
  ) {}
}
