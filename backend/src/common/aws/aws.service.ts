import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand,} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

@Injectable()
export class AWSService {
    private s3Client: S3Client;
    private bucketName: string;
    private region: string;
    private baseUrl: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.region = this.configService.get<string>('BUCKET_REGION', 'ap-southeast-1');
        this.bucketName = this.configService.get<string>('BUCKET_NAME', 'ticketweb-assets');
        this.baseUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('ACCESS_KEY', ''),
                secretAccessKey: this.configService.get<string>('ACCESS_SECRET', ''),
            },
        });
    }

    /**
   * Upload an image file to S3 and create a DB record. The image name is random.
   * @param file - Express.Multer.File from @UploadedFile()
   * @returns the created image URL
   */
    async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
        const key = folder + crypto.randomBytes(32).toString('hex'); 

        try {
            const putCmd = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3Client.send(putCmd);
        } catch (error) {
            console.error('S3 upload error:', error);
            throw new InternalServerErrorException('Failed to upload image to S3');
        }

        // 3. Construct public URL
        const url = `${this.baseUrl}/${key}`; // e.g., https://bucket.s3.region.amazonaws.com/uploads/12345-name.jpg
        console.log(url);

        return url;
    }

    async generateSignedUrl(key: string, expiresInSeconds = 60): Promise<string> {
        // Check if the object exists
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );
        } catch (err) {
            if (err.name === 'Not Found') {
                throw new NotFoundException(`Object not found: ${key}`);
            }
            throw err;
        }

        // Create the signed URL
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    async getPublicUrl(key: string): Promise<string> {
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );
        } catch (err) {
            if (err.name === 'Not Found') {
                throw new NotFoundException(`Object not found: ${key}`);
            }
            throw err;
        }

        return this.baseUrl + key;
    }
}
