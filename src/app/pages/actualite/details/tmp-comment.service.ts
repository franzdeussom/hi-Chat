import { Injectable } from '@angular/core';
import { Commentaire } from './Commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class TmpCommentService {
  public Comment!: any[];
  
  constructor() { }

  updateLikeAdd(index: number, nbrLike: number){
      this.Comment[index].nbrLike = nbrLike+1;
      this.Comment[index].alreadyLike = 1;     
  }
  
  updateLikeDel(index: number, nbrLike: number){
    this.Comment[index].nbrLike = nbrLike-1;
    this.Comment[index].alreadyLike = 0;
  }

  delComment(index: number){
      this.Comment.splice(index, 1);
  }
  
  updateAddComment(comment: Commentaire){
      this.Comment.unshift(comment);
  }

}
