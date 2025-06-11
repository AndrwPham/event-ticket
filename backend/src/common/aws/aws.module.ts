import { Module } from '@nestjs/common';
import { AWSService } from './aws.service';
import { AWSController } from './aws.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [AWSService],
    controllers: [AWSController],
    exports: [AWSService],
})
export class AWSModule {}
