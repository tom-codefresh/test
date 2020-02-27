declare const require: any;
import { Injectable } from '@angular/core';
const content = require('../data.json');
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WebsocketService } from "./websocket.service";
import { Subject } from 'rxjs';
import { Message } from '../interfaces/message.interface';
import { _URL } from '../consts';

@Injectable()
export class DataService {
  private dataObj: BehaviorSubject<any> = new BehaviorSubject<any>(content);
  public $dataObj = this.dataObj.asObservable();
  
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(_URL).map(
      (response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          log: data.log,
          step: data.step
        };
      }
    );
  }
}
