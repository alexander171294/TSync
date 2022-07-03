import { EventService } from './../events/events.service';
import { environment } from './../environment';
import { Subject } from 'rxjs';
import { TelegramMessageUpdate } from './telegram.domain';
import { Injectable, Logger } from "@nestjs/common";
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);

    private bot: Telegraf;
    private readonly messages: Subject<{type: string, ctx: any, update: TelegramMessageUpdate}> = new Subject();

    constructor(private readonly eventSrv: EventService) {
        this.logger.log('Starting telegram bot: ' + environment.telegram.botApiKey);
        this.bot = new Telegraf<Context>(
            environment.telegram.botApiKey,
        );
        this.bot.use((ctx, next) => {
            return next();
        });
        this.bot.on('text', (ctx) => {
            this.messages.next({
                type: 'message',
                ctx,
                update: ctx.update as unknown as TelegramMessageUpdate,
            });
            this.eventSrv.telegramMessage.next(ctx.message.text);
        });
        this.logger.debug('launching...');
        this.bot.launch().then(() => {
            this.logger.log('Telegram bot launched...');
        });
        this.eventSrv.ircMessage.subscribe(msg => {
            this.send(environment.telegram.chatID, msg);
        });
        this.bot.start((ctx) => {
            this.messages.next({
                type: 'start',
                ctx,
                update: ctx.update as unknown as TelegramMessageUpdate,
            });
        });
        this.createCommand('hjoin', (ctx) => {
           const cttx = ctx.update as unknown as TelegramMessageUpdate;
           console.log(cttx);
        });
        this.logger.debug('Settings sigterms');
        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }

    // se puede responder al ctx.reply('Hola');
    public getMessage(): Subject<{type: string, ctx: any, update: TelegramMessageUpdate}> {
        return this.messages;
    }
    
    public createCommand(commandName: string, cb?: (ctx: Context<Update>) => void) {
        this.bot.command(commandName, (ctx) => {
            this.messages.next({
                type: 'commandName',
                ctx,
                update: ctx.update as unknown as TelegramMessageUpdate,
            });
            if(cb) {
                cb(ctx);
            }
        });
    }

    public send(chatID: string, text: string) {
        this.bot.telegram.sendMessage(chatID, text);
    }

}