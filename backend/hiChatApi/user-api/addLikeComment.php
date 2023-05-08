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
    if(!isset($data->id_commentaire) && empty($data->id_commentaire)){
             $query = $conn->prepare('INSERT INTO HiChat.COMMENT_LIKE( 
                                        id_users,
                                        id_comment
                                    ) 
                                    VALUES(
                                        :id_users,
                                        (SELECT COMMENTAIRE.id_commentaire FROM HiChat.COMMENTAIRE WHERE COMMENTAIRE.PID = :PID)
                                    )');
                $query->execute([
                        ':id_users' => $data->id_users,
                        ':PID' => $data->PID
                        ]);

                if($query){
                        $response = [
                            'success' => true,
                            'valid' => true
                        ];
                        echo json_encode($response);
                }else{
                    echo json_encode([]);
                }
    }else{
         $query = $conn->prepare('INSERT INTO HiChat.COMMENT_LIKE( 
                                        id_users,
                                        id_comment
                                    ) 
                                    VALUES(
                                        :id_users,
                                        :idComment
                                    )');
                $query->execute([
                        ':id_users' => $data->id_users,
                        ':idComment' => $data->id_commentaire
                   ]);

                if($query){
                        $response = [
                            'success' => true,
                            'valid' => true
                        ];
                        echo json_encode($response);
                }else{
                    echo json_encode([]);
                }
    }
           
    
?>