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

    $query = $conn->prepare('DELETE FROM HiChat.FOLLOW 
                             WHERE
                                FOLLOW.id_users_WF = :id_users_WF
                                AND
                                FOLLOW.id_users_F = :id_users_F
                            ');
    $query->execute([
        ':id_users_WF' => $data->id_WF,
        ':id_users_F' => $data->id_F
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
