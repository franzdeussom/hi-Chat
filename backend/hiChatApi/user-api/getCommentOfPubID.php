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
                                            COMMENTAIRE.id_commentaire, 
                                            COMMENTAIRE.id_users, 
                                            COMMENTAIRE.id_publication, 
                                            COMMENTAIRE.libelle, 
                                            COMMENTAIRE.date_comment, 
                                            USERS.nom, 
                                            USERS.prenom, 
                                            USERS.profilImgUrl, 
                                            (SELECT COUNT(*) FROM 
                                            HiChat.COMMENT_LIKE
                                                WHERE 
                                                    COMMENT_LIKE.id_comment = COMMENTAIRE.id_commentaire) as 'nbrLike',
                                            (SELECT COUNT(*) FROM 
                                                    HiChat.COMMENT_LIKE 
                                                        WHERE COMMENT_LIKE.id_users = :id_users
                                                        AND COMMENT_LIKE.id_comment = COMMENTAIRE.id_commentaire
                                            )as 'alreadyLike' 
                                  
                                    FROM HiChat.COMMENTAIRE, HiChat.USERS 
                                    WHERE 
                                    COMMENTAIRE.id_publication = :id_pub
                                    AND 
                                    COMMENTAIRE.id_users = USERS.id_users 
                                    ORDER BY COMMENTAIRE.id_commentaire DESC LIMIT 65;
                            ");
    $query->execute([
        ':id_users'=> $data->id_CurrentUsers,
        ':id_pub' => $data->id_pub
    ]);

    $row = $query->rowCount();

    if($row > 0){
        $response = json_encode($query->fetchAll());
        echo $response;
    }else{
        echo json_encode([]);
    }
?>
