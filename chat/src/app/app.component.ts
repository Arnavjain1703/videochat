import { Component, ViewChild,ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ServerService } from './services/serverService';

import * as io from 'socket.io-client' 




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit ,OnInit{
socket:any;
roomref:any;
localstream :any;
remoteStream = new MediaStream();
rid=false;

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
constructor(private ServerService:ServerService){ 

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
 
this.registerPeerConnectionListeners();
 
this.localstream.getTracks().forEach(track => {
    this.alis.addTrack(track,this.localstream);
  });
   
    this.alis.onicecandidate= (e2)=> 
    {
      if(e2.candidate)
      {
      const roomId = this.roomId;
      const candidate = e2.candidate   
        //  this.ServerService.icecandidate(this.roomId,e2.candidate)
      this.socket.emit("add_caller_candidates",({candidate,roomId}));
      console.log(candidate)
      }
    }
   
   
    this.alis.createOffer().then(off=>{
      const roomId = this.roomId;
      const  offer= off
       console.log({offer,roomId})
      this.socket.emit("create_room",({offer,roomId}));
    
      this.alis.setLocalDescription(new RTCSessionDescription(offer))})
    // .then(()=>this.bob.setRemoteDescription(this.alis.localDescription))
    // .then(()=>this.bob.createAnswer())
    // .then((answer)=> {console.log(answer),this.bob.setLocalDescription(new RTCSessionDescription(answer))})
    // .then(()=>this.alis.setRemoteDescription(this.bob.localDescription))
       this.alis.ontrack = (e)=>
       {
         e.streams[0].getTracks().forEach(track=>
          {
            this.remoteStream.addTrack(track)
          })
       }  

    this.socket.on('recieve_answer_sdp', (data) => {
      // const rtcSessionDescription = new RTCSessionDescription(data.answer);
      this.alis.setRemoteDescription(data);
      
    });
    this.socket.on('recieve_callee_candidates',(data)=>
    {
        this.alis.addIceCandidate(new RTCIceCandidate(data))
        console.log('skjdjbv');
    })
     
  }
  

start() {
  this.initCamera({ video: true, audio: false });
}
 sound() {
  this.initCamera({ video: true, audio: true });
}

// get access to media
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
    this.video2.srcObject = this.remoteStream;
    this.video2.play();
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
      console.log(response);
      this.creat();
      this.rid=true;
  })
}
closeid() {
  this.rid=false;
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



joinroom(f)
{
this.registerPeerConnectionListeners();

  this.localstream.getTracks().forEach(track => {
    this.bob.addTrack(track,this.localstream);
  });
  this.bob.onicecandidate=(e)=>
  {
    if(e.candidate)
    {
    const candidate = e.candidate
    this.socket.emit("add_callee_candidates",({candidate,roomId}));
    } 
  }
  this.bob.ontrack = (e)=>
  {
    e.streams[0].getTracks().forEach(track=>
     {
       this.remoteStream.addTrack(track)
     })
  }  

  const roomId=f.value.id;
  console.log(roomId)
  this.socket.emit('join_room',({roomId}))
  this.ServerService.getoffer(roomId)
       .subscribe((response)=>
       {
          this.tk= response
          console.log(response)
         const offer = this.tk.offerSdp
         const length=this.tk.callerCandidates.length
         const callerCandidates  =this.tk.callerCandidates
         console.log(callerCandidates)

      const rtcSessionDescription = new RTCSessionDescription(offer);
      this.bob.setRemoteDescription(rtcSessionDescription).then(()=>
 {this.bob.createAnswer().then((answer)=>{this.bob.setLocalDescription(answer);this.socket.emit('add_answer_sdp',{answer,roomId});
      for(let i=0;i<length;i++)
      {
        this.bob.addIceCandidate(callerCandidates[i])
        console.log('add')
      }

}
    )
  

 })

       }
       )
  
}
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
