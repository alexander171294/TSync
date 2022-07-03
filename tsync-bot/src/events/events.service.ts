import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class EventService {

    public readonly ircMessage: Subject<string> = new Subject();
    public readonly telegramMessage: Subject<string> = new Subject();

}