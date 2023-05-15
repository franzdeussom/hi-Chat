import { PremiumType } from './../../pages/actualite/premium-page/premiumType.enum';
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
            if(pubDay == currentDate.getDate()){

              return "Aujourd'hui";

            }else{
              //same year and month but difference day
              let tmp = currentDate.getDate() - pubDay;
              const elaspsedDay = tmp < 0 ?  tmp*(-1) :tmp;
                if(elaspsedDay == 1){
                    return 'Hier';
                }else if(elaspsedDay == 0 ){
                    return "Aujourd'hui";
                }else if(elaspsedDay == 7){
                  return "il y'a 1sem";
                }
              return elaspsedDay > 7 ? 'Ce mois, le : ' + pubDay : "il y'a " + elaspsedDay + " jours";
            }

          }else{
            //same year but different month
            let tmp = (currentDate.getMonth()+1) - pubDateM;              
            const elapsedMonth = tmp < 0 ?  tmp*(-1) :tmp;

            return "il y'a " + elapsedMonth + ' Mois';

          }
        }else{
          //different year
          return 'Publier le ' + pubDay +'-'+ pubDateM +'-'+ pubDateY ;
        }
  }

  getFormatDatePremium(): string{
    const date = new Date();
    
    return ''+date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
  }

  getBuildDateExpiredPremium(premiumType: string, dateCreate:string): string{
        let endDate = '';
        let startDay = Number.parseInt(dateCreate.split('/')[0]);
        let startMonth = Number.parseInt(dateCreate.split('/')[1]);
        let startYear = Number.parseInt(dateCreate.split('/')[2]);
    
        const calculEndDate = (duration:number)=>{
              if(duration == 12){
                  return startDay+'/'+startMonth+'/'+(startYear+1);
              }else{
                  let endMonth = duration + startMonth;
                  if(endMonth > 12){
                      startYear++;
                      return startDay+'/'+(12-startMonth)+'/'+startYear;
                  }else{
                      return startDay+'/'+endMonth+'/'+startYear;
                  }
              }
        }

        switch(premiumType){
          case PremiumType.PREMIUM_A:
              endDate = calculEndDate(PremiumType.PREMIUM_A_DURATION);
            break;

          case PremiumType.PREMIUM_B:
              endDate = calculEndDate(PremiumType.PREMIUM_B_DURATION);
            break;

          case PremiumType.PREMIUM_C:
              endDate = calculEndDate(PremiumType.PREMIUM_C_DURATION);
            break;

          case PremiumType.PREMIUM_D:
              endDate = calculEndDate(PremiumType.PREMIUM_D_DURATION);
            break;
         }
      return endDate;
  }

  isPremiumDateValid(dateStart: string, dateEnd:string): boolean{
      const setDateAsNumber = (date:string)=>{
        let startDay = Number.parseInt(date.split('/')[0]);
        let startMonth = Number.parseInt(date.split('/')[1]);
        let startYear = Number.parseInt(date.split('/')[2]);

        return Number.parseInt(''+startDay+''+startMonth+''+startYear);
      }

      return setDateAsNumber(dateStart) <= setDateAsNumber(dateEnd);
  }
}
