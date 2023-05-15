import { Publication } from "../actualite/publicatin.model";

export class NotificationApp{
    constructor(
        public type?: any,
        public message?: any,
        public id_UsersSender?: any,
        public id_destinataire?:any,
        public id_pub?: any,
        public id_comment?: any,
        public commentContent?: any,
        public pubTextContent?: any,
        public publication?: Publication,
        public profilImgUrlSender?: any,
        public nomSender?: any,
        public prenom?: any,
        public isRead?:any,
        public PID?: any,
        public Admin_Notif_SEXE?: any,//for admin
        public listID?: string[] //for admin

    ){}
}