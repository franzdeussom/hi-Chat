export class Publication{
    constructor(
        public id_pub?: number,
        public id_user?: number,
        public libelle?: string,
        public date_pub?: any,
        public url_file?: any,
        public is_public?: any,
        public colorBg?: string,
        public nom?: string,
        public prenom?: string,
        public profilImgUrl?: string,
        public nbrLike?: any,
        public alreadyLike?: any
    ){ this.nbrLike = 0}
}