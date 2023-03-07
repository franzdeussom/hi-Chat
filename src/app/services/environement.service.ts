import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironementService {
 public hostName = 'http://localhost:3307/';
 public webSocketServer = 'ws://localhost:8084?param=';   
  constructor() { }
}
