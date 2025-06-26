import { IsString, IsBoolean, IsOptional, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsBoolean()
    isPublic: boolean;

    @IsString()
    contentType: string;
}
