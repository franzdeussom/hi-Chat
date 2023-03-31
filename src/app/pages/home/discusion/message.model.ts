export class Message{  
    constructor(
        public type?: string,
        public idUser?:any,
        public imgBase64Url?: string,
        public imageEnvoyeur?: any,
        public id_message?: any,
        public libelle?: any,
        public myDateSend?: any,
        public date_envoie?: any,
        public statut?: any,
        public received?: any,
        public id_destinateur_user?: any,
        public id_sender?: any,
        public nom?: any,
        public prenom?: any,
        public toSend?: boolean,
        public isReceived?: any,
        public id_discussion?: any
    ){}
}