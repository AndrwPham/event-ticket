import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand,} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UploadFileDto } from './dto/upload-file.dto';
import { GetFileDto } from './dto/get-file.dto';
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

    //key = public|private + /folder/ + name. Could be changed in the future.
    async generateSignedPutUrl(dtos: UploadFileDto[]): Promise<{ presignedUrl: string; key: string }[]> {

        return Promise.all(

            dtos.map(async (dto) => {
                const { isPublic, contentType, folder } = dto;
                const key = `${isPublic ? 'public' : 'private'}/${folder}/${Date.now()}-${crypto.randomBytes(32).toString('hex')}`;

                const command = new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    ContentType: contentType,
                });

                const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });

                return { presignedUrl, key };
            })
        )
    }

    async getFileUrl(dtos: GetFileDto[]): Promise<{
        key: string,
        url: string | null,
        status: 'ok' | 'error',
        message?: string,
    }[]> {
        const results = await Promise.allSettled(
            dtos.map( async (dto) => {

                try {

                    const { key, isPublic, ...privateParams } = dto;
                    await this.s3Client.send(
                        new HeadObjectCommand({
                            Bucket: this.bucketName,
                            Key: key,
                        }),
                    );

                    let url: string;

                    if (!isPublic) {
                        const expiresInSeconds: number = privateParams?.expiresInSeconds ?? 60;

                        // Create the signed URL
                        const command = new GetObjectCommand({
                            Bucket: this.bucketName,
                            Key: key,
                        });

                        url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
                    } else {
                        url =  this.baseUrl + key;
                    }

                    return {
                        key,
                        url,
                        status: 'ok' as const,
                    };

                } catch (err: any) {
                    const isNotFound = err?.$metadata?.httpStatusCode === 404 || err?.name === 'Not Found';

                    return {
                        key: dto.key,
                        url: null,
                        status: 'error' as const,
                        message: isNotFound ? 'File not found.' : err.message,
                    };
                }
            })
        )

        return results.map((result, i) => {
            if (result.status === 'fulfilled') return result.value;

            return {
                key: dtos[i].key,
                url: null,
                status: 'error' as const,
                message: result.reason?.message ?? 'Unknown error',
            };
        });
    }
}
