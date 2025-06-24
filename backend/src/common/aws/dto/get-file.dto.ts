import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class GetFileDto {
    @IsString() @IsNotEmpty() key: string;
    @IsBoolean() isPublic: boolean;
    @IsOptional() @IsNumber() expiresInSeconds?: int;
}
