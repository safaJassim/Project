import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Message } from '@stomp/stompjs';

import { Subscription } from 'rxjs/Subscription';
import { StompService } from '@stomp/ng2-stompjs'

    console.log("sjm");

@Component({
  selector: 'app-player1',
  templateUrl: './player1.component.html',
  styleUrls: ['./player1.component.css']
})
export class Player1Component implements OnInit,AfterViewInit {

  mousePos: {
    x: number,
    y: number
  };


  interval;
  mainTimerSet = false;

  drowingStoped = false;
  mouseIsDrowing = false;
  x = 0;


  @ViewChild('can1')  canvas1:ElementRef ;

  color="red";

  //colors={options:["red","green","black"], selectedIndex:0};

colors=["red","green","black"];

//








  lastMousePos;
  // Stream of messages
  private subscription: Subscription;
  public messages: Observable<Message>;


  constructor(private _stompService: StompService) { }

  ngOnInit() {


    this.subscribe();



  }

  ngAfterViewInit() {

//debugger;

console.log( this.canvas1);



// let kkk = $("#canvas1");

  // console.log( kkk);
    // child is set
  }


  public subscribe() {
    // Stream of messages
    this.messages = this._stompService.subscribe('/topic/CheckStatus');
    // Subscribe a function to be run on_next message
    this.subscription = this.messages.subscribe(this.prossesMessage);
  }

  public prossesMessage = (message: Message) => {

    // Store message in "historic messages" queue
    //this.mq.push(message.body + '\n');
    this.checkStatus(message.body);


    // Log it to the console
    console.log(message);
  }

  public checkStatus(message) {
    console.log(message);
    let res = JSON.parse(message);

    if (res.code === "OK") {
      alert("OK");
      window.location.href  = "http://localhost:8080/index2.html";
    } else {
      alert("Error");

        window.location.href  = "http://localhost:4200";

    }

  }



   mousedown(event) {

    if (this.drowingStoped) {
      return;
    }

    if (this.mainTimerSet == false) {
      this.mainTimerSet = true;


    Observable.interval( 1000 * 5)
    .takeWhile(() => !this.drowingStoped)
    .subscribe(i => { this.stopDrowing();
    });



    }

    this.lastMousePos = this.getMousePos(this.canvas1.nativeElement, event);


    Observable.interval( 1000 / 60)
    .takeWhile(() => !this.drowingStoped)
    .subscribe(i => { this.sendDrowing();
    });



    this.mouseIsDrowing = true;

  }

   mouseup(event) {

    this.mouseIsDrowing = false;
    clearInterval(this.interval);
    this.sendDrowing();

  }

   mousemove(event) {

    if (this.mouseIsDrowing === true) {
      this.mousePos = this.getMousePos(this.canvas1.nativeElement, event);

      var ctx = this.canvas1.nativeElement.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(this.lastMousePos.x, this.lastMousePos.y);
      ctx.lineTo(this.mousePos.x, this.mousePos.y);




    // console.log("colors:" +   this.colors.options[this.colors.selectedIndex]);
      ctx.strokeStyle = this.color;
      ctx.stroke();
      this.lastMousePos = this.mousePos;
    }

  }


//
   sendDrowing():void {

    let data = this.canvas1.nativeElement.toDataURL();
    /*stompClient.send("/app/ImageComming", {}, JSON.stringify({
      'data' : data
    }));*/

/*
    this._stompService.publish('/app/ImageComming',
      //    `{ type: "Test Message", data: [ ${this._counter}, ${_getRandomInt(1, 100)}, ${_getRandomInt(1, 100)}] }`);
      `{ type: "Test Message", "data":"${data}"}`);

*/

    	this._stompService.publish("/app/ImageComming", JSON.stringify({
        'data' :   `${data}`}
      ));

  }

  stopDrowing() {

   this.drowingStoped = true;
   this.mouseIsDrowing = false;
   clearInterval(this.interval);
   this.sendDrowing();

 }

   getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

}
