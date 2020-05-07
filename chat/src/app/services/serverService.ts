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
message:any;

constructor(private http:HttpClient){
    this.sockets = io('https://singis.herokuapp.com/')
}


creatRoom()
{
    return this.http.get( this.rootUrl+"/create_room");
     
}
socket(offer:any,roomId:string)
{
    
     this.message=JSON.stringify({offer,roomId})
     console.log(this.message)
    this.sockets.emit("creat_room",this.message);
  
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
    this.message=JSON.stringify({roomId,candidate})
     console.log(this.message)
    this.sockets.emit("add_caller_candidates",this.message);
}
listen(eventname:string)
{
    
    return new Observable((Subscriber)=>
    {
        this.sockets.on(eventname,(answer)=>
        {
            Subscriber.next(answer);
             console.log('skdjcn')
        })
    })
}


}