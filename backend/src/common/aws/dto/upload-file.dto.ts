import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UploadFileDto {
    @IsString() contentType: string;
    @IsBoolean() isPublic: boolean;
    @IsString() @IsNotEmpty() folder: string;
}
