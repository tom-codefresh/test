import { Injectable } from "@angular/core";
import * as Rx from "rxjs/Rx";
declare const require: any;
const content = require('../data.json');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { intervalDelay } from "../consts";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class WebsocketService {
  logsArr: Array<object> = []
  private subscription: Subscription;

  constructor() {
    this.buildData();
  }

  private isServerDown: Rx.BehaviorSubject<Boolean> = new Rx.BehaviorSubject<Boolean>(true);
  public $isServerDown = this.isServerDown.asObservable();

  private processEnded: Rx.BehaviorSubject<Boolean> = new Rx.BehaviorSubject<Boolean>(false);
  public $processEnded = this.processEnded.asObservable();
  _data = content;
  private subject: Rx.Subject<MessageEvent>;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      this.isServerDown.next(false);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          let i = 0
          this.subscription = Observable.interval(intervalDelay).subscribe(() => {
            ws.send(JSON.stringify(this.logsArr[i]));
            i++

            if (!this.logsArr[i]) {
              this.processEnded.next(true)
              this.subscription.unsubscribe();
            }
          });
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }

  buildData(): void {
    this._data.steps.forEach((step, stepNumber) => {
      step.logs.forEach(log => {
        this.logsArr.push({ log: log, step: stepNumber })
      })
    })
  }
}