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