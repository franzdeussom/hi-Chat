import { Commentaire } from './../../pages/actualite/details/Commentaire.model';
import { Publication } from '../../pages/actualite/publicatin.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TimeSystemService {
  constructor() { }

   getElapsedTime(listPublication: Publication[]): Publication[]{

    const setElapsedTime = (date: string)=>{
       return this.buildElapsedTime(date);
    }

      listPublication.map((publication => {
        publication.date_pub = setElapsedTime(publication.date_pub);
      }));
    
    return listPublication;
  }

  getElapsedTimeComment(listCommentaire: Commentaire[]): Commentaire[]{

    const setElapsedTime = (date: string)=>{
       return this.buildElapsedTime(date);
    }

      listCommentaire.map((commentaire => {
        commentaire.date_comment = setElapsedTime(commentaire.date_comment);
      }));
    
    return listCommentaire;
  }

  public buildElapsedTime(date: string): string{
    let FullDate = date.split('-');

        let pubDateY = Number.parseInt(FullDate[0]);
        let pubDateM = Number.parseInt(FullDate[1]);
        let pubDay =  Number.parseInt(FullDate[2]);

        const currentDate = new Date();

        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth()+1;

        const dte = pubDay + '-' + pubDateM + '-' + pubDateY; 

        if(pubDateY == currentYear){
          if(pubDateM == currentMonth){
            if(pubDay == currentDate.getDay()){

              return "Aujourd'hui";

            }else{
              //same year and month but difference day
              let tmp = currentDate.getDate() - pubDay;
              const elaspsedDay = tmp < 0 ?  tmp*(-1) :tmp;
                if(elaspsedDay == 1){
                    return 'Hier';
                }else if(elaspsedDay == 0 ){
                    return "Aujourd'hui";
                }
              return elaspsedDay > 7 ? 'il ya 1 sem' : 'il ya ' + elaspsedDay + ' jours';
            }

          }else{
            //same year but different month
            let tmp = currentDate.getMonth() - pubDateM;              
            const elapsedMonth = tmp < 0 ?  tmp*(-1) :tmp;

            return 'il ya ' + elapsedMonth + ' Mois';

          }
        }else{
          //different year
          return 'Publier le ' + pubDay +'-'+ pubDateM +'-'+ pubDateY ;
        }
  }

}
