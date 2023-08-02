export class PremiumRequest{
    constructor(
        public id_request?: any,
        public id_user?:any,
        public date_request?:any,
        public premiumType?: string,
        public nom?: any,
        public prenom?: string,
        public profilImgUrl?: any,
        public pays?: any,
        public price?: any,
        public REQUEST_DECISION?: any
    ){   }
}