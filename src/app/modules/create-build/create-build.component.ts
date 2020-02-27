import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Message } from '../../interfaces/message.interface';
import { intervalDelay } from '../../consts';
import { WebsocketService } from '../../services/websocket.service';

const message: Message = {
  log: 0,
  step: 0
};

@Component({
  selector: 'app-create-build',
  templateUrl: './create-build.component.html',
  styleUrls: ['./create-build.component.scss']
})
export class CreateBuildComponent implements OnInit {
  //**** INPUTS ****// 
  @Input() set data(obj) {
    this.lastUpdateTime = this.getDateTimeFromTimestamp(obj.lastUpdate);
    this._data = obj;
  }
  get data(): any {
    return this._data;
  }

  //**** VARIABLES ****//
  getAllDataByStep: Array<Number> = [];
  isBuildRun: Boolean = false;
  currentStep;
  _data;
  lastUpdateTime;
  loadingLogs: Boolean = false;
  processEnded: Boolean = false;
  
  constructor(private dataService: DataService,
    private websocketService: WebsocketService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataService.messages.subscribe(msg => {
      let step = this.data.steps[Number(msg.step)]
      if (!step.hasOwnProperty('givenLogs')) {
        step.givenLogs = []
      }
      this.data.steps[Number(msg.step)].givenLogs.push(msg.log)
      if (this.currentStep !== msg.step) {
        this.getAllDataByStep.push(this.currentStep);
        this.currentStep = msg.step;
      }

      setInterval(this.updateScroll(msg.step), intervalDelay);
    });

    this.websocketService.$processEnded.subscribe(res => {
      this.processEnded = res;
      if (res) {
        const currentTime = new Date().getTime();
        this.lastUpdateTime = this.getDateTimeFromTimestamp(currentTime);
      }
    })
  }

  private getDateTimeFromTimestamp(unixTimeStamp) {
    const date = new Date(unixTimeStamp);
    return ('0' + date.getDate()).slice(-2) + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
      date.getFullYear() + ' ' +
      ('0' + date.getHours()).slice(-2) + ':' +
      ('0' + date.getMinutes()).slice(-2);
  }

  private updateScroll(index) {
    var element = document.getElementsByClassName("mat-expansion-panel-body");
    element[index].scrollTop = element[index].scrollHeight;
  }

  runBuild() {
    this.isBuildRun = !this.isBuildRun;
    if (this.isBuildRun) {
      this.dataService.messages.next(message);
    } else {
      location.reload();
    }
  }
}
