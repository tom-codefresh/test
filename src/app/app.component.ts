import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isServerDown: Boolean = true;
  data: any;

  constructor(private dataService: DataService, private websocketService: WebsocketService) {
    websocketService.$isServerDown.subscribe(serverStatues => {
      setTimeout(() => {
        this.isServerDown = serverStatues
      }, 2500);
    });
  }

  ngOnInit() {
    this.dataService.$dataObj.subscribe(data => {
      this.data = data;
    });
  }
}
