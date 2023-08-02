<?php 
    //who ? admin ?
    require('../../header.php');
    require('../../connectDB.php');

    global $conn;

    $getData = file_get_contents('php://input');

    if(isset($getData) && !empty($getData)){
        $data = json_decode($getData);
        http_response_code(200);
    }else{
        return;
    }
     $query = $conn->prepare('UPDATE HiChat.Users 
                              SET Users.isPremiumAccount = :decision
                              WHERE Users.id_users = : id_users
                            ');
    $query->execute([
        ':decision'=> $data->decision == false ? 0:1,
        ':id_users'=>$data->id_users
    ]);

    if($query){
        $respons = [
            'success'=> true,
        ];
        http_response_code(200);
        echo json_encode($respons);
    }else{
        http_response_code(500);
    }
?>