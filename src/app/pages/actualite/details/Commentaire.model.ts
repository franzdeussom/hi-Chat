export class Commentaire{
    constructor(
        public id_commentaire?: number,
        public id_users?: number,
        public id_id_publication?: number,
        public libelle?: string,
        public date_comment?: any,
        public nom?: any,
        public prenom?: string,
        public profilImgUrl?: string,
        public nbrLike?: number,
        public alreadyLike?: number
    ){}
}