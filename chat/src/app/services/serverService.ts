import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as io from 'socket.io-client' 
import { Observable, Subscriber } from 'rxjs';


@Injectable()
export class ServerService
{
    private rootUrl = "https://singis.herokuapp.com"
tk:any;
sockets:any;


constructor(private http:HttpClient){
    this.sockets = io('https://singis.herokuapp.com/')
}


creatRoom()
{
    return this.http.get( this.rootUrl+"/create_room");
     
}

// server(roomId:number)
// {   const candidate = candidate.map 
//     console.log(JSON.stringify({roomId,candidate}))
//     // this.sockets.emit("add_caller_candidates",this.roomId);
    
// }
checkemit(roomId:string)
{   
    console.log(JSON.stringify({roomId}))
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    this.http.post(this.rootUrl+'/show_room',JSON.stringify({roomId}), {headers:headers})
    .subscribe( (response)=>
        {    
            
            console.log(response)
        },
        error =>
        {
            console.log(error);
            
        }
    
    )
    
}
icecandidate(roomId:string,candidate:any)
{
    const message=JSON.stringify({roomId,candidate})
     this.sockets.emit("add_caller_candidates",message);
}
listen(eventname:string)
{
    
    return new Observable((Subscriber)=>
    {
        this.sockets.on(eventname,(answer:RTCSessionDescription)=>
        {
            Subscriber.next(answer);
            
        })
    })
}


}