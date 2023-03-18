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
    $dateComment = date('Y-M-D H:i:s');

    $query = $conn->prepare("INSERT INTO HiChat.COMMENTAIRE( 
                            id_users,
                            id_publication,
                            libelle,
                            date_comment,
                            PID
                           ) 
                            VALUES(
                                :id_users,
                                :id_pub,
                                :libelle,
                                :date_comment,
                                :PID
                            )");
    $query->execute([
        ':id_users' => $data->id_users,
        ':id_pub' => $data->id_publication,
        ':libelle' => $data->libelle,
        ':date_comment' =>$dateComment,
        ':PID' => $data->PID
    ]);

    if($query){
        $response = [
            'success' => true,
            'valid' => true,
            'date' => $dateComment
        ];
        echo json_encode($response);
    }else{
        echo json_encode([]);
    }