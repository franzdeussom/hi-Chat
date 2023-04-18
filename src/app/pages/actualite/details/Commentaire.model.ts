export class Commentaire{
    constructor(
        public id_commentaire?: number,
        public id_users?: number,
        public PID?: any,
        public id_publication?: number,
        public libelle?: string,
        public date_comment?: any,
        public nom?: any,
        public prenom?: string,
        public profilImgUrl?: string,
        public nbrLike?: any,
        public alreadyLike?: any,
        public isSend?: boolean,
        public pub_PID?: any,
        
    ){ this.isSend = false;}
}