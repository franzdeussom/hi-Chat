<?php
    require('../connectDB.php');

function getFollowers($id_F){
        global $conn;
        global $id_F;
        $query = $conn->prepare('SELECT USERS.nom,
                                        USERS.prenom,
                                        USERS.id_users,
                                        USERS.profilImgUrl,
                                        USERS.pays,
                                        USERS.age,
                                        USERS.date_naiss,
                                        USERS.date_creationAccount,
                                        USERS.ville,
                                        USERS.tel,
                                        FOLLOW.id_users_WF,
                                        FOLLOW.id_users_F
                                 FROM 
                                    HiChat.USERS,
                                    HiChat.FOLLOW
                                 WHERE 
                                    USERS.id_users = FOLLOW.id_users_WF
                                    AND
                                    FOLLOW.id_users_F = :id_F
                                ');
        $query->execute([
            'id_F' => $id_F
        ]);
       $rowCount = $query->rowCount();
        if($rowCount >= 1){
            $result = $query->fetchAll();
            return $result;
        }else{
            return [];
        }
        
    }

?>