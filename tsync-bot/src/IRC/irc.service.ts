import { EventService } from './../events/events.service';
import { environment } from './../environment';
import { Injectable, Logger } from "@nestjs/common";
import * as NodeIRC from 'irc';

@Injectable()
export class IRCService {

    private client: NodeIRC.Client;

    private readonly logger = new Logger(IRCService.name);

    private lastTo?: string;

    constructor(private evtSrv: EventService) {
        this.client = new NodeIRC.Client(environment.irc.server, environment.irc.botName, {
            channels: environment.irc.channels
          });
          this.init();
          evtSrv.telegramMessage.subscribe(msg => {
            const to = msg.split(' ')[0];
            if(to.match(/^[#&]/)) {
                this.client.say(to, msg.replace(to, '').trim());
                this.lastTo = to;
            } else if (this.lastTo) {
                try {
                    this.client.say(this.lastTo, msg.trim());
                } catch(e) {
                    this.logger.error('error sending message', e);
                }
            }
          });
    }

    init(): void {
        this.logger.debug('Starting bot');
        this.client.on('registered', () => {
          this.client.say('NickServ', 'identify ' + environment.irc.password);
        });
        this.client.addListener('message', (from, to, message: string) => {
            if(environment.irc.ignore.find(d => d.toLowerCase()==from.toLowerCase())) {
                return;
            }
            if (to.match(/^[#&]/)) {
                // channel message
                this.evtSrv.ircMessage.next(`#ļøā£ ${to}\r\nš ${from}\r\nš¬ ${message}`);
            } else {
                // private message
                this.evtSrv.ircMessage.next(`š¤« š ${from}\r\nš¬ ${message}`);
            }
        });
    }



}