export class Publication{
    constructor(
        public id_pub?: number,
        public PID?: any,
        public type_pub?:any,
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
        public nbrCommentaire?:any,
        public alreadyLike?: any,
        public id_CurrentUsers?: any//will use to check if the user has already like a comment on a pub
    ){ this.nbrLike = 0}
}