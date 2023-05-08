<?php
    require('../connectDB.php');
    require('../header.php');

    global $conn;

    $getData = file_get_contents('php://input');

    if(isset($getData) && !empty($getData)){
        $data = json_decode($getData);
        http_response_code(200);
    }else{
        return;
    }

    $query = $conn->prepare("SELECT DISTINCT 
                                        PUBLICATION.id_pub,
                                        PUBLICATION.id_user, 
                                        PUBLICATION.libelle, 
                                        PUBLICATION.date_pub, 
                                        PUBLICATION.url_file, 
                                        PUBLICATION.is_public, 
                                        PUBLICATION.colorBg, 
                                        PUBLICATION.PID,
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
                                                PUB_LIKE.id_users = :idUser
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
                                                PUBLICATION.is_public = 0
                                            AND
                                                USERS.id_users = PUBLICATION.id_user 
                                                ORDER BY PUBLICATION.id_pub DESC LIMIT 80
                            ");
    $query->execute([
        ':idUser'=> $data->id_users
    ]);

    $row = $query->rowCount();

    if($row > 0){
        $response = json_encode($query->fetchAll());
        echo $response;
    }else{
        echo json_encode([]);
    }
?>
