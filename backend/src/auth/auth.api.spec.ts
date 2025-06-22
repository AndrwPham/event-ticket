import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from './auth.module';
import { PrismaService } from '../prisma/prisma.service';

// This is a focused API (integration) test for the AuthModule only

describe('AuthController (API)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    // Clean up all collections before each test
    await prisma.user.deleteMany({});
    await prisma.attendeeInfo.deleteMany({});
    // Add more deleteMany for other models if needed
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'apitestuser@example.com',
        username: 'apitestuser',
        password: 'ApiTestPassword123',
      });
    expect(res.status).toBe(201);
  });

  it('/auth/login (POST) - should login and return tokens', async () => {
    // Register user first
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'apitestlogin@example.com',
        username: 'apitestlogin',
        password: 'ApiTestPassword123',
      });
    // Simulate email confirmation
    await prisma.user.update({
      where: { username: 'apitestlogin' },
      data: { confirmed: true, confirmToken: null, confirmTokenExpiresAt: null },
    });
    // Login
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'apitestlogin',
        password: 'ApiTestPassword123',
        activeRole: 'Attendee',
      });
    expect(res.status).toBe(201);
    expect(res.body.tokens).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  it('/auth/confirm (GET) - should confirm user email', async () => {
    // Register user
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'confirmuser@example.com',
        username: 'confirmuser',
        password: 'ApiTestPassword123',
      });
    // Get confirm token from DB
    const user = await prisma.user.findUnique({ where: { username: 'confirmuser' } });
    expect(user).toBeTruthy();
    const res = await request(app.getHttpServer())
      .get('/auth/confirm')
      .query({ token: user!.confirmToken });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('confirmed');
  });

  it('/auth/switch-role (POST) - should switch user role', async () => {
    // Register and confirm user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'switchrole@example.com',
        username: 'switchrole',
        password: 'ApiTestPassword123',
      });
    await prisma.user.update({ where: { username: 'switchrole' }, data: { confirmed: true } });
    // Login to get tokens
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'switchrole',
        password: 'ApiTestPassword123',
        activeRole: 'Attendee',
      });
    const accessToken = loginRes.body.tokens.accessToken;
    const res = await request(app.getHttpServer())
      .post('/auth/switch-role')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ activeRole: 'Attendee' });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Switched role');
  });

  it('/auth/logout (POST) - should logout user', async () => {
    // Register and confirm user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'logoutuser@example.com',
        username: 'logoutuser',
        password: 'ApiTestPassword123',
      });
    await prisma.user.update({ where: { username: 'logoutuser' }, data: { confirmed: true } });
    // Login to get tokens
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'logoutuser',
        password: 'ApiTestPassword123',
        activeRole: 'Attendee',
      });
    const accessToken = loginRes.body.tokens.accessToken;
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(res.status).toBe(201);
  });

  it('/auth/me (GET) - should return current user', async () => {
    // Register and confirm user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'meuser@example.com',
        username: 'meuser',
        password: 'ApiTestPassword123',
      });
    await prisma.user.update({ where: { username: 'meuser' }, data: { confirmed: true } });
    // Login to get tokens
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'meuser',
        password: 'ApiTestPassword123',
        activeRole: 'Attendee',
      });
    const accessToken = loginRes.body.tokens.accessToken;
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.username).toBe('meuser');
  });

  it('/auth/refresh (POST) - should refresh tokens', async () => {
    // Register and confirm user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'refreshuser@example.com',
        username: 'refreshuser',
        password: 'ApiTestPassword123',
      });
    await prisma.user.update({ where: { username: 'refreshuser' }, data: { confirmed: true } });
    // Login to get tokens
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'refreshuser',
        password: 'ApiTestPassword123',
        activeRole: 'Attendee',
      });
    const refreshToken = loginRes.body.tokens.refreshToken;
    const userId = loginRes.body.user.id;
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .send();
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth/login (POST) - should fail with 401 if user does not exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'nonexistent',
        password: 'wrongpassword',
        activeRole: 'Attendee',
      });
    expect(res.status).toBe(401);
  });

  it('/auth/login (POST) - should fail with 401 if password is incorrect', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'wrongpw@example.com',
        username: 'wrongpw',
        password: 'CorrectPassword123',
      });
    await prisma.user.update({ where: { username: 'wrongpw' }, data: { confirmed: true } });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'wrongpw',
        password: 'WrongPassword',
        activeRole: 'Attendee',
      });
    expect(res.status).toBe(401);
  });

  it('/auth/login (POST) - should fail with 401 if user is not confirmed', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'notconfirmed@example.com',
        username: 'notconfirmed',
        password: 'Password123',
      });
    // Do not confirm user
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'notconfirmed',
        password: 'Password123',
        activeRole: 'Attendee',
      });
    expect(res.status).toBe(401);
  });

  it('/auth/refresh (POST) - should fail with 401 if refresh token is invalid', async () => {
    // Register and confirm user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'refreshfail@example.com',
        username: 'refreshfail',
        password: 'Password123',
      });
    await prisma.user.update({ where: { username: 'refreshfail' }, data: { confirmed: true } });
    // Login to get userId
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        credential: 'refreshfail',
        password: 'Password123',
        activeRole: 'Attendee',
      });
    const userId = loginRes.body.user.id;
    // Use an invalid refresh token
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer invalidtoken`)
      .send();
    expect(res.status).toBe(401);
  });

  it('/auth/me (GET) - should fail with 401 if no token is provided', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me');
    expect(res.status).toBe(401);
  });
});