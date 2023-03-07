import { EnvironementService } from './../../services/environement.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetAllMessageService {
  public AllUserMessage: any;
  public AllMessageOfDiscussion: any;
  public USERS_ID: any;
  constructor(private http: HttpClient, private host: EnvironementService) { }
  
  getAllMessage(): any{
    this.http.get(this.host.hostName+'msg-api/getAllMessageUser.php').subscribe((data)=>{
        if(Object.keys(data).length === 0 ? false : true ){
          this.AllUserMessage = data;
        }
    },(error)=>{
        if(error.status === 500){
          //internal error
          console.log('api error');
        }
    });
    return this.AllUserMessage;
  }

  getUniqueDiscussionMsg(){
    
  }
}
