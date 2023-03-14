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

    $query = $conn->prepare('DELETE FROM HiChat.PUB_LIKE 
                             WHERE
                                PUB_LIKE.id_pub = :id_pub
                                AND
                                PUB_LIKE.id_users = :id_users
                            ');
    $query->execute([
        ':id_pub' => $data->id_pub,
        ':id_users' => $data->id_users
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
?>
