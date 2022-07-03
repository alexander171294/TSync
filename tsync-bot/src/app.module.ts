import { IRCService } from './IRC/irc.service';
import { TelegramService } from './telegram/telegram.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventService } from './events/events.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [TelegramService, IRCService, EventService],
})
export class AppModule {}
