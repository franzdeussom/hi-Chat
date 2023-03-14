export class User{
    constructor(
        public id_users?: number,
        public nom?: string,
        public prenom?: string,
        public email?: any,
        public sexe?: string,
        public tel?: string,
        public mdp?: string,
        public profilImgUrl?: string,
        public pays?: string,
        public age?: any,
        public date_naiss?: any,
        public date_creationAccount?: Date,
        public reset_pass?: string,
        public ville?: string,
        public NbrFollow?: number
    ){
        
    }
}