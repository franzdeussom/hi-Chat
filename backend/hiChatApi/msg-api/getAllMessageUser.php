<?php
    require('../connectDB.php');
    require('../header.php');

    global $conn;

    $getDataUser = file_get_contents('php://input');

    if(!empty($getDataUser) && isset($getDataUser)){
        $data = json_decode($getDataUser);
    }else{
        echo json_encode([
            'noDataSend' => true 
        ]);
        return;
    }

    $idUser =(int) $data[0]->id_users;
    $name = $data[0]->nom;

    //get Message 
    $query = $conn->prepare('SELECT DISTINCT USERS.nom,
                                            USERS.prenom,
                                            USERS.profilImgUrl AS imageEnvoyeur,
                                            USERS.id_users,
                                             MESSAGE.libelle,
                                             MESSAGE.date_envoie,
                                             MESSAGE.id_sender,
                                             MESSAGE.id_destinateur_user,
                                             MESSAGE.received AS isReceived,
                                             MESSAGE.statut,
                                             MESSAGE.id_discussion,
                                             MESSAGE.idUser
                            FROM HiChat.USERS, HiChat.MESSAGE
                            WHERE MESSAGE.id_destinateur_user = :id 
                            AND MESSAGE.id_sender = USERS.id_users
                            ORDER BY MESSAGE.id_message ASC');
    $query->execute([
        ':id' => $idUser
    ]);

    $nbrMsg = $query->rowCount();
    $result = $query->fetchAll();

    if($nbrMsg > 0){
        $response = json_encode($result);
        echo $response;
    }else{
        echo json_encode([]);
    }
?>