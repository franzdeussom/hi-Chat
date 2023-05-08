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
    if(isset($data->id_pub) && !empty($data->id_pub)){
                $query = $conn->prepare('INSERT INTO HiChat.PUB_LIKE( 
                            id_users,
                            id_pub
                           ) 
                            VALUES(
                                :id_users,
                                :idPub
                            )');
                    $query->execute([
                        ':id_users' => $data->id_users,
                        ':idPub' => $data->id_pub
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
                $query = $conn->prepare('INSERT INTO HiChat.PUB_LIKE( 
                            id_users,
                            id_pub
                           ) 
                            VALUES(
                                :id_users,
                                (SELECT PUBLICATION.id_pub FROM HiChat.PUBLICATION WHERE PUBLICATION.PID = :PID)
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
    }
    
?>