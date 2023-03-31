import { ToastAppService } from './Toast/toast-app.service';
import { HttpClient } from '@angular/common/http';
import { EnvironementService } from './environement.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../pages/home/discusion/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageApiService {
  newMsg!: any;
  ws!: WebSocket;
 public wsAllMsg: Array<Message>;
 public wsSender: Array<Message>;
 public connectionState: number = 200;

  constructor(private host : EnvironementService, private http: HttpClient, 
             ) {
                this.wsAllMsg = new Array<Message>();
                this.wsSender = new Array<Message>();
                }
  
  public get(endpoint: string, ressource: any): Observable<any>{
    return this.http.get<any>(this.host.hostName+endpoint, ressource);
  }
  
  public post(endpoint: string, ressource: any): Observable<any>{
    return this.http.post<any>(this.host.hostName+endpoint, ressource, {withCredentials: true} );
  }

  webSocketInit(id_users : any){
      this.ws = new WebSocket(this.host.webSocketServer+id_users);
      this.checkConnectionStatement();

    }

    checkConnectionStatement(){
        this.ws.onerror =(evt)=>{
              this.connectionState = 500;
        }
    }

  webSocketOnMessage(){

  
  }
  webSocketSendMessage(msg: any){
    this.ws.send(JSON.stringify(msg));
  }

  webSocketOnClose(): any{
    this.ws.close();
  }

  listWsSender(msgToAdd: Message){
    let count = 0;
    let indexMsg = 0;
    if(this.wsSender.length > 0){
      this.wsSender.forEach((userMsg: Message, index: any)=>{
         if(userMsg.id_sender == msgToAdd.id_sender){
            count++;
            indexMsg = index;
         }
      })
      if(count == 0){
        //not yet this sender in the list
        this.wsSender.push(msgToAdd);
      }else{
        //present in the list, updating libelle
        this.wsSender[indexMsg].libelle = msgToAdd.libelle;
      }
    }else{
      this.wsSender.push(msgToAdd);
    }
    count = 0;
    indexMsg = 0;
  }

  

  getMsgDiscuss(tab?: any): Array<Message>{
    return tab;
  }

  
}
