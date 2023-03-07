<?php
    require('../connectDB.php');
    require('../header.php');

    function saveMessageDB($msg){
        global $conn;

        $getDataMessage = $msg;

        if(!empty($getDataMessage) && isset($getDataMessage)){
                $data = json_decode($getDataMessage);


                $msgLibele = $data->libelle;
                $msgStatut = 0;
            if(!isset($data->isReceived) && empty($data->isReceived)){
                $msgIsReceived = true;
            }
            $msgIsReceived = true;
            
            $msgIdDestinataire =(int) $data->id_destinateur_user;
            $msgIdSender =(int) $data->id_sender;

            /* have to check if the receiver is online to determine if the message will be receive
                **send to database idDestinataire
                **get a boolean confirmation if he is online 

                function checkStatusReceive(){}
            */
            echo 'user pas en ligne..\n';
            $query = $conn->prepare("INSERT INTO HiChat.MESSAGE(
                                    libelle,
                                    date_envoie,
                                    statut,
                                    received,
                                    id_destinateur_user,
                                    id_sender
                                    )VALUES(:libelle, :dateEnvoie, :statut, :received, :idReceiver, :idSender) ");
            $query->execute([
                ':libelle' => $msgLibele,
                ':dateEnvoie' => $data->date_envoie,
                ':statut' => $msgStatut,
                ':received' => $msgIsReceived,
                ':idReceiver' => $msgIdDestinataire,
                ':idSender' => $msgIdSender
            ]);

            return $query;
        
        }

    
    }
?>