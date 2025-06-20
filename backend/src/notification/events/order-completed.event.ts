export class OrderCompletedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId?: string,
    public readonly guestEmail?: string,
  ) {}
}
