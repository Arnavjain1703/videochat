import { Component, ViewChild,ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ServerService } from './services/serverService';
import { Observable, Subscriber } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit ,OnInit{
socket:any;
configuration = {
iceServers: [
{
  urls: 
    "stun:stun1.l.google.com:19302"
         
},
],
};
@ViewChild('videoElement',{static:false}) videoElement: ElementRef;  
@ViewChild('rvideoElement',{static:false}) rvideoElement: ElementRef;  
ngOnInit(){}
constructor(private ServerService:ServerService){  }
video: any;
video2: any;
roomId:string;
localStream=new MediaStream
tk:any;
alis = new RTCPeerConnection(this.configuration);

ngAfterViewInit() {
this.video = this.videoElement.nativeElement;
this.video2 = this.rvideoElement.nativeElement;
}
creat()
  {  
 
      
  this.registerPeerConnectionListeners();
  this.localStream.getTracks().forEach(track => {
    this.alis.addTrack(track);
  });
   
    this.alis.onicecandidate= (e2)=> 
    {
       
         console.log(e2.candidate);
    }
    this.alis.onicecandidateerror=(e)=>
    {
      console.log(e);
    }
    this.alis.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('ksdjvn')
        console.log(event)
        console.log('Got final candidate!');
        return;
      }
    })
    this.alis.createOffer().then(offer=>{
    this.ServerService.socket(offer,this.roomId);this.alis.setLocalDescription(new RTCSessionDescription(offer))})
    // .then(()=>this.bob.setRemoteDescription(this.alis.localDescription))
    // .then(()=>this.bob.createAnswer())
    // .then((answer)=> {this.bob.setLocalDescription(new RTCSessionDescription(answer))})
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
registerPeerConnectionListeners()
{
  this.alis.onicegatheringstatechange = (e)=>
  {
    console.log(e)
  }
  this.alis.onconnectionstatechange=(e)=>
  {
    console.log(e);
  }
  this.alis.onsignalingstatechange = (e)=>
  {
     console.log(e);
  }

  this.alis.oniceconnectionstatechange = (e)=>
  {
    console.log(e)
  }
 
}
}
