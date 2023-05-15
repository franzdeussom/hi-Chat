export class User{

    constructor(
        public id_users?: any,
        public nom?: string,
        public prenom?: string,
        public email?: any,
        public sexe?: string,
        public tel?: string,
        public mdp?: any,
        public profilImgUrl?: string,
        public pays?: string,
        public age?: any,
        public date_naiss?: any,
        public date_creationAccount?: Date,
        public reset_pass?: string,
        public ville?: string,
        public NbrFollow?: number, 
        public isPremiumAccount?: any,
        public accountType?: any,
        public dateStartPremium?: any,// format : --/--/-- 
        public dateEndPremium?: any
        ){ }
        
}