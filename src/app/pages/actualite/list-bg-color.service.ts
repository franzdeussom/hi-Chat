import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
}) 
export class ListBgColorService {
public Color : {  
      id: number,
      type: string,
      value: string
}[] = [ 
  {
    id: 1,
    type: 'blue',
    value: 'linear-gradient(#00C6FB, #005BEA)'
  },
  {
    id: 2,
    type: 'yellow',
    value: 'linear-gradient(#F6D365, #FDA085)'
  },
  {
    id: 3,
    type: 'green',
    value: 'linear-gradient(#2AF598, #009EFD)'
  },
  {
    id: 4,
    type: 'gray',
    value: 'linear-gradient(#A6C0FE, #F68084)'
  },
  {
    id: 5,
    type: 'dirty',
    value: 'linear-gradient(#6A85B6, #BAC8E0)'
  },
  {
    id: 6,
    type: 'purple',
    value: 'linear-gradient(#CC2B5E, #753A88)'
  },
  {
    id: 7,
    type: 'royal',
    value: 'linear-gradient(#536976, #292E49)'
  },
  {
    id: 8,
    type: 'itmeo',
    value: 'linear-gradient(#2AF598, #009EFD)'
  },
  {
    id: 9,
    type: 'love',
    value: 'linear-gradient(#FF0844, #FFB199)'
  },
  {
    id: 10,
    type: 'division',
    value: 'linear-gradient(#7028E4, #E5B2CA)'
  },
  {
    id: 11,
    type: 'mesh',
    value: 'linear-gradient(#AC1F6B, #EB9ECA, #560194)'
  },
  {
    id: 12,
    type: 'mesh',
    value: 'linear-gradient(#3B3787, #D2C0E6, #E06AFE)'
  }
]  
  constructor() {  } 
}  
