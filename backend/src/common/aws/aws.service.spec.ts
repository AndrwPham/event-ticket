import { Test, TestingModule } from '@nestjs/testing';
import { AWSService } from './aws.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(),
}));

const s3Mock = mockClient(S3Client);

describe('AWSService', () => {
    let service: AWSService;

    const mockConfig = {
        get: (key: string, def?: any) => {
            const values = {
                BUCKET_REGION: 'ap-southeast-1',
                BUCKET_NAME: 'ticketweb-assets',
                ACCESS_KEY: 'mock-access-key',
                ACCESS_SECRET: 'mock-secret-key',
            };
            return values[key] ?? def;
        },
    };

    beforeEach(async () => {
        s3Mock.reset();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AWSService,
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        service = module.get<AWSService>(AWSService);
    });

    describe('generateSignedPutUrl', () => {
        it('should return signed PUT URL and key', async () => {
            (getSignedUrl as jest.Mock).mockResolvedValue('https://signed.put.url');

            const dto = {
                folder: 'events',
                contentType: 'image/jpeg',
                isPublic: true,
            };

            const result = await service.generateSignedPutUrl(dto);
            expect(result.presignedUrl).toBe('https://signed.put.url');
            expect(result.key).toContain('public/events');
        });
    });

    describe('getFileUrl', () => {
        it('should return signed GET URL for private files', async () => {
            s3Mock.on(HeadObjectCommand).resolves({});
            (getSignedUrl as jest.Mock).mockResolvedValue('https://signed.get.url');

            const dto = {
                key: 'private/tickets/sample.png',
                isPublic: false,
                expiresInSeconds: 100,
            };

            const url = await service.getFileUrl(dto);
            expect(url).toBe('https://signed.get.url');
        });

        it('should return public URL for public files', async () => {
            s3Mock.on(HeadObjectCommand).resolves({});

            const dto = {
                key: '/public/events/test.jpg',
                isPublic: true,
            };

            const url = await service.getFileUrl(dto);
            expect(url).toBe('https://ticketweb-assets.s3.ap-southeast-1.amazonaws.com/public/events/test.jpg');
        });

        it('should throw NotFoundException for missing files', async () => {
            s3Mock.on(HeadObjectCommand).rejects({ name: 'Not Found' });

            await expect(
                service.getFileUrl({ key: 'x', isPublic: true }),
            ).rejects.toThrow('Object not found: x');
        });
    });
});
