<?php 
    //who ? admin ?
    require('../header.php');
    require('../connectDB.php');

    global $conn;

    $getData = file_get_contents('php://input');

    if(isset($getData) && !empty($getData)){
        $data = json_decode($getData);
        http_response_code(200);
    }else{
        return;
    }

    $subQuery = $conn->prepare('UPDATE HiChat.USERS
                              SET USERS.isPremiumAccount = :decision_request,
                                  USERS.dateStartPremium = :startDate,
                                  USERS.dateEndPremium = :endDate
                              WHERE USERS.id_users = :idUsers
                            ');
    $subQuery->execute([
        ':decision_request'=> $data->decision == false ? 1:0,
        ':startDate'=> NULL,
        ':endDate'=> NULL,
        ':idUsers'=>$data->id_Account
    ]);

    if($subQuery){
        $respons = [
            'success'=> true,
        ];
        http_response_code(200);
        echo json_encode($respons);
    }else{
        http_response_code(500);
        return;
    }
?>