import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
