import { TicketCleanupService } from './ticket-cleanup.service';
import { TicketStatus } from '../issuedticket/ticket-status.enum';

describe('TicketCleanupService', () => {
  let service: TicketCleanupService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      issuedTicket: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    service = new TicketCleanupService(prisma);
    jest.clearAllMocks();
  });

  it('should release expired held tickets', async () => {
    const now = new Date();
    const expired = [
      { id: 't1', status: TicketStatus.HELD, holdExpiresAt: new Date(now.getTime() - 1000) },
      { id: 't2', status: TicketStatus.HELD, holdExpiresAt: new Date(now.getTime() - 2000) },
    ];
    prisma.issuedTicket.findMany.mockResolvedValue(expired);
    prisma.issuedTicket.updateMany.mockResolvedValue({ count: 2 });

    await service.releaseExpiredHolds();

    expect(prisma.issuedTicket.findMany).toHaveBeenCalledWith({
      where: {
        status: TicketStatus.HELD,
        holdExpiresAt: { lt: expect.any(Date) },
      },
    });
    expect(prisma.issuedTicket.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['t1', 't2'] } },
      data: { status: TicketStatus.AVAILABLE, holdExpiresAt: null },
    });
  });

  it('should do nothing if no expired tickets', async () => {
    prisma.issuedTicket.findMany.mockResolvedValue([]);
    await service.releaseExpiredHolds();
    expect(prisma.issuedTicket.updateMany).not.toHaveBeenCalled();
  });
});
