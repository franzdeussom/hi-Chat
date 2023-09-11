<?php
    session_start();

    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');
    require('../user-api/getAbm.php');

    $dataUser = file_get_contents('php://input');

    if(isset($dataUser) && !empty($dataUser)){
        $data = json_decode($dataUser);
        http_response_code(200);
    }else{
        return;
    }
    $id_F = $data->id_users;

    $globalArray = Array();
     getPublication();
    array_push($globalArray, getFollowers($id_F));
    array_push($globalArray, getAbm($id_F));

    function getPublication(){
        global $conn;
        global $id_F;
        global $globalArray;
        
        $query = $conn->prepare("SELECT DISTINCT PUBLICATION.id_pub, 
                                 PUBLICATION.id_user,
                                 PUBLICATION.libelle,
                                 PUBLICATION.date_pub,
                                 PUBLICATION.url_file,
                                 PUBLICATION.is_public,
                                 PUBLICATION.colorBg,
                                 PUBLICATION.PID,
                                 PUBLICATION.type_pub,
                                 USERS.nom, 
                                 USERS.prenom, 
                                 USERS.profilImgUrl, 
                                        (SELECT COUNT(*) 
                                            FROM HiChat.PUB_LIKE
                                            WHERE 
                                                PUB_LIKE.id_pub = PUBLICATION.id_pub
                                            
                                        ) as 'nbrLike',
                                        (SELECT COUNT(*) 
                                            FROM HiChat.PUB_LIKE 
                                            WHERE 
                                                PUB_LIKE.id_users = :id_F
                                                AND
                                                PUB_LIKE.id_pub = PUBLICATION.id_pub
                                        ) as 'alreadyLike',
                                        (SELECT COUNT(*) 
                                            FROM HiChat.COMMENTAIRE
                                            WHERE 
                                                COMMENTAIRE.id_publication = PUBLICATION.id_pub
                    
                                        ) as 'nbrCommentaire' 

                                 FROM HiChat.PUBLICATION,
                                      HiChat.USERS
                                 WHERE 
                                 PUBLICATION.id_user = :id_F
                                 AND 
                                 USERS.id_users = :id_F
                                 ORDER BY PUBLICATION.id_pub DESC
                                 ");
        $query->execute([
            ':id_F' => $id_F
        ]);
       $rowCount = $query->rowCount();
        if($rowCount >= 1){
            $result = $query->fetchAll();
            array_push($globalArray, $result);
        }else{
            array_push($globalArray, []);
        }
    }

    echo json_encode($globalArray);
?>