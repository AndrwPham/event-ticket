export class UserConfirmedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name?: string,
    public readonly confirmedAt?: Date,
  ) {}
}
