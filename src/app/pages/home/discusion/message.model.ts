export class Message{  
    constructor(
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
        public isReceived?: boolean,
        public id_discussion?: any
    ){}
}