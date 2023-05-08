<?php
    require('../connectDB.php');
    require('../header.php');

    global $conn;
    $dataUser = file_get_contents('php://input');

    if(isset($dataUser) && !empty($dataUser)){
        $data = json_decode($dataUser);
        http_response_code(200);
    }else{
        return;
    }

        $query = $conn->prepare("SELECT DISTINCT USERS.nom,
                                        USERS.prenom,
                                        USERS.id_users,
                                        USERS.profilImgUrl,
                                        USERS.pays,
                                        USERS.age,
                                        USERS.sexe,
                                        USERS.date_naiss,
                                        USERS.date_creationAccount,
                                        USERS.ville,
                                        USERS.tel,
                                        (SELECT COUNT(*) 
                                         FROM 
                                         HiChat.FOLLOW
                                         WHERE
                                         FOLLOW.id_users_F = USERS.id_users
                                        )as 'NbrFollow'
                                 FROM 
                                    HiChat.USERS,
                                    HiChat.PUB_LIKE,
                                    HiChat.PUBLICATION
                                 WHERE 
                                    PUBLICATION.id_pub = :id_pub
                                    AND
                                    PUB_LIKE.id_pub = :id_pub
                                    AND
                                    PUB_LIKE.id_users = USERS.id_users   
                                    
                                ");
        $query->execute([
            ':id_pub'=> $data->id_pub
        ]);
       $rowCount = $query->rowCount();
        if($rowCount >= 1){
            $result = $query->fetchAll();
            echo json_encode($result);
        }else{
            echo json_encode([]);
        }
?>