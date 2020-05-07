import { Component, ViewChild,ElementRef, AfterViewInit } from '@angular/core';
import { ServerService } from './services/serverService';
import { Observable, Subscriber } from 'rxjs';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  socket:any;
  configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  @ViewChild('videoElement',{static:false}) videoElement: ElementRef;  
  @ViewChild('rvideoElement',{static:false}) rvideoElement: ElementRef;  

  constructor(private ServerService:ServerService)
  {

  }

  video: any;
  video2: any;
  roomId:string;
  tk:any;

  

  alis = new RTCPeerConnection(this.configuration);
  bob = new RTCPeerConnection(this.configuration);
  
  
  ngAfterViewInit() {
    this.video = this.videoElement.nativeElement;
    this.video2 = this.rvideoElement.nativeElement;
  }
  creat()
  {  
    this.alis.createOffer().then(offer=>{
       
     
      
      this.ServerService.socket(offer,this.roomId);this.alis.setLocalDescription(new RTCSessionDescription(offer))})
    // .then(()=>this.bob.setRemoteDescription(this.alis.localDescription))
    // .then(()=>this.bob.createAnswer())
    // .then((answer)=> {this.bob.setLocalDescription(new RTCSessionDescription(answer))})
    // .then(()=>this.alis.setRemoteDescription(this.bob.localDescription))

   .then(() =>this.alis.onicecandidate = (e) => 
    {
        this.ServerService.icecandidate(this.roomId,e.candidate)
       console.log('fired')
    }
   )
//  this.bob.onicecandidate = (e) =>
//     {
//       if(e.candidate)
//       {
//         this.alis.addIceCandidate(e.candidate)
//       }
//     }
     
    
    this.bob.ontrack = e=>
    {
      console.log(e)
    }
     
  }
  

start() {
  this.initCamera({ video: true, audio: false });
}
 sound() {
  this.initCamera({ video: true, audio: true });
}

  initCamera(config:any) {
  var browser = <any>navigator;

  browser.getUserMedia = (browser.getUserMedia ||
    browser.webkitGetUserMedia ||
    browser.mozGetUserMedia ||
    browser.msGetUserMedia);

  browser.mediaDevices.getUserMedia(config).then(stream => {
    this.video.srcObject = stream;
    this.video.play();
  });
}

pause() {
  this.video.pause();
}

toggleControls() {
  this.video.controls = true;
}

resume() {
  this.video.play();
}
creatroom()
{
  this.ServerService.creatRoom()
  .subscribe((response)=>{
     
     this.roomId=String(response)
       
  })
}
// server()
// {
//   this.ServerService.server(this.roomId)
// }
check()
{
  this.ServerService.checkemit(this.roomId)
}
// listen()
// {
//   this.ServerService.listen("receive_answer_sdp").subscribe((answer)=>
//   {
//     this.alis.setRemoteDescription(answer)
//   }
//   )
  
// }

}
