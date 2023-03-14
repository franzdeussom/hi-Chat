import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathPpService {
  public path_pp : {
    nom: string,
    path: string,
  }[] = [
    {
      nom:'',
      path: '',
    }

]
  constructor() { }
}
