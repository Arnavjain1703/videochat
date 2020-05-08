import { Component, ViewChild,ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ServerService } from './services/serverService';
import { Observable, Subscriber } from 'rxjs';
import * as io from 'socket.io-client' 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit ,OnInit{
  socket:any
localstream :any;
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
ngOnInit(){

 this.socket = io('https://singis.herokuapp.com/')
 
}
constructor(private ServerService:ServerService){  }
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
 
this.registerPeerConnectionListeners();
 
this.localstream.getTracks().forEach(track => {
    this.alis.addTrack(track,this.localstream);
  });
   
    this.alis.onicecandidate= (e2)=> 
    {
         
         this.ServerService.icecandidate(this.roomId,e2.candidate)
    }
   
   
    this.alis.createOffer().then(offer=>{
      const roomId = this.roomId
     
      this.socket.emit("creat_room",JSON.stringify({offer,roomId}));
    
      this.alis.setLocalDescription(new RTCSessionDescription(offer))})
    // .then(()=>this.bob.setRemoteDescription(this.alis.localDescription))
    // .then(()=>this.bob.createAnswer())
    // .then((answer)=> {console.log(answer),this.bob.setLocalDescription(new RTCSessionDescription(answer))})
    // .then(()=>this.alis.setRemoteDescription(this.bob.localDescription))

     
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
    this.localstream=stream
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
//        console.log(answer)
//        const answer = new RTCSessionDescription(answer)
//        await this.alis.setRemoteDescription(answer);
//   }
//   )
  
// }
registerPeerConnectionListeners()
{
  this.alis.onicegatheringstatechange = (e)=>
  {
    
  }
  this.alis.onconnectionstatechange=(e)=>
  {
    
  }
  this.alis.onsignalingstatechange = (e)=>
  {
     
  }

  this.alis.oniceconnectionstatechange = (e)=>
  {
    
  }
 
}
}
