<?php
    require('../connectDB.php');
    require('../header.php');
    global $conn;

    $getRessource = file_get_contents('php://input');

    if(isset($getRessource)  && !empty($getRessource)){
        $data = json_decode($getRessource);
    }else{
        http_response_code(501);
        return;
    }

    $query = $conn->prepare("INSERT INTO HiChat.ACCOUNT_SIGNALED(id_signal, id_user_WMS, id_user_S) 
                                    VALUES('', :id_userWMS, :id_userS) 
                            ");
    $query->execute([
        ':id_userWMS' => $data->id_user_WMS,
        ':id_userS'=> $data->id_user_S
    ]);

    if($query){
        $response = [
            'sucess'=>true,
            'done'=>true
        ];
        http_response_code(200);
        echo json_encode($response);
    }else{
        http_response_code(500);
        echo json_encode([]);
    }
    
  
?>