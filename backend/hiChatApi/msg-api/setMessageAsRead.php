<?php
    require('../connectDB.php');
    require('../header.php');

    global $conn;

    $getIdMsg = file_get_contents('php://input');

    if(isset($getIdMsg) && !empty($getIdMsg)){
        $data = json_decode($getIdMsg);
    }else{
        echo json_encode([
            'noDataSend' => true
        ]);
        return;
    }

    $idMsg = $data->id_message;

    if(isset($idMsg)){
        $query = $conn->prepare('UPDATE HiChat.MESSAGE 
                                 SET MESSAGE.statut = 1 
                                 WHERE MESSAGE.id_message = :idMsg 
            ');
        $query->execute([
            ':idMsg' => $idMsg
        ]);
        if($query){
            echo json_encode([
                'MESSAGE_Update' => true
            ]);
            http_response_code(200);
        }else{
            echo json_encode([]);
        }
    }else{
        echo json_encode([
            'ID_NOT_FOUND' => true
        ]);
    }
?>