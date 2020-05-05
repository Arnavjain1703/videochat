import { Component, ViewChild,ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videoElement',{static:false}) videoElement: ElementRef;  
  video: any;
  

  alis = new RTCPeerConnection();
  bob = new RTCPeerConnection();
   constructor()
   {
        
   }
  ngAfterViewInit() {
    this.video = this.videoElement.nativeElement;
  }
  creat()
  {
    this.alis.createOffer().then(offer=>{ console.log(offer);this.alis.setLocalDescription(new RTCSessionDescription(offer))})
    .then(()=>this.bob.setRemoteDescription(this.alis.localDescription))
    .then(()=>this.bob.createAnswer())
    .then((answer)=> { console.log(answer);this.bob.setLocalDescription(new RTCSessionDescription(answer))})
    .then(()=>this.alis.setRemoteDescription(this.bob.localDescription))
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
}