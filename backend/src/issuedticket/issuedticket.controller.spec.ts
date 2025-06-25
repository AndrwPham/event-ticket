import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IssuedTicketModule } from './issuedticket.module';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from './ticket-status.enum';
import { APP_GUARD } from '@nestjs/core';

// Mock Auth Guard to always allow
class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('IssuedTicketController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IssuedTicketModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: MockAuthGuard,
        },
      ],
    }).overrideProvider(APP_GUARD)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tickets (GET) should return all tickets', async () => {
    jest.spyOn(prisma.issuedTicket, 'findMany').mockResolvedValueOnce([
      { id: '1', price: 100, class: 'VIP', seat: 'A1', status: TicketStatus.AVAILABLE, holdExpiresAt: null, eventId: 'e1', organizationId: 'o1', currencyId: 'c1', createdAt: new Date(), updatedAt: new Date() },
    ]);
    const res = await request(app.getHttpServer()).get('/tickets');
    expect(res.status).toBe(200);
    expect(res.body[0].class).toBe('VIP');
  });

  it('/tickets/generate (POST) should create tickets from schema', async () => {
    jest.spyOn(prisma.issuedTicket, 'count').mockResolvedValueOnce(0);
    jest.spyOn(prisma.issuedTicket, 'createMany').mockResolvedValueOnce({ count: 2 });
    const dto = {
      eventId: 'e2',
      organizationId: 'o2',
      currencyId: 'c2',
      schema: {
        eventId: 'e2',
        classes: [
          { label: 'VIP', price: 100, quantity: 2, seats: [] },
        ],
      },
    };
    const res = await request(app.getHttpServer())
      .post('/tickets/generate')
      .send(dto);
    expect(res.status).toBe(201);
  });

  it('/tickets/:id (GET) should return a ticket by id', async () => {
    jest.spyOn(prisma.issuedTicket, 'findUnique').mockResolvedValueOnce({
      id: '1', price: 100, class: 'VIP', seat: 'A1', status: TicketStatus.AVAILABLE, holdExpiresAt: null, eventId: 'e1', organizationId: 'o1', currencyId: 'c1', createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await request(app.getHttpServer()).get('/tickets/1');
    expect(res.status).toBe(200);
    expect(res.body.class).toBe('VIP');
  });

  it('/tickets/event/:id (GET) should return tickets for an event', async () => {
    jest.spyOn(prisma.issuedTicket, 'findMany').mockResolvedValueOnce([
      { id: '2', price: 50, class: 'General', seat: '', status: TicketStatus.AVAILABLE, holdExpiresAt: null, eventId: 'e2', organizationId: 'o2', currencyId: 'c2', createdAt: new Date(), updatedAt: new Date() },
    ]);
    const res = await request(app.getHttpServer()).get('/tickets/event/e2');
    expect(res.status).toBe(200);
    expect(res.body[0].class).toBe('General');
  });

  it('/tickets/:id (PATCH) should update a ticket', async () => {
    jest.spyOn(prisma.issuedTicket, 'update').mockResolvedValueOnce({
      id: '1', price: 200, class: 'VIP', seat: 'A1', status: TicketStatus.AVAILABLE, holdExpiresAt: null, eventId: 'e1', organizationId: 'o1', currencyId: 'c1', createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await request(app.getHttpServer())
      .patch('/tickets/1')
      .send({ price: 200 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(200);
  });

  it('/tickets/:id (DELETE) should remove a ticket', async () => {
    jest.spyOn(prisma.issuedTicket, 'delete').mockResolvedValueOnce({
      id: '1', price: 100, class: 'VIP', seat: 'A1', status: TicketStatus.AVAILABLE, holdExpiresAt: null, eventId: 'e1', organizationId: 'o1', currencyId: 'c1', createdAt: new Date(), updatedAt: new Date(),
    });
    const res = await request(app.getHttpServer())
      .delete('/tickets/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  it('/tickets/generate (POST) should return 400 if tickets already exist', async () => {
    jest.spyOn(prisma.issuedTicket, 'count').mockResolvedValueOnce(1);
    const dto = {
      eventId: 'e2',
      organizationId: 'o2',
      currencyId: 'c2',
      schema: {
        eventId: 'e2',
        classes: [
          { label: 'VIP', price: 100, quantity: 2, seats: [] },
        ],
      },
    };
    const res = await request(app.getHttpServer())
      .post('/tickets/generate')
      .send(dto);
    expect(res.status).toBe(400);
  });
});
