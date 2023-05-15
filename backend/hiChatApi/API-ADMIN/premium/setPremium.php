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
     $query = $conn->prepare('UPDATE HiChat.USERS
                              SET USERS.isPremiumAccount = :decision,
                                  USERS.accountType = :accountType,
                                  USERS.dateStartPremium = :startDate,
                                  USERS.dateEndPremium = :endDate
                              WHERE USERS.id_users = :id_users
                            ');
    $query->execute([
        ':decision'=> $data->decision,
        ':accountType'=> $data->accountType,
        ':startDate'=> $data->startDate,
        ':endDate'=> $data->endDate,
        ':id_users'=>$data->id_users
    ]);

    $subQuery = $conn->prepare('UPDATE HiChat.PREMIUM_REQUEST 
                              SET PREMIUM_REQUEST.REQUEST_DECISION = :decision_request
                        
                              WHERE PREMIUM_REQUEST.id_user = :idUsers
                            ');
    $subQuery->execute([
        ':decision_request'=> $data->decisionRequest,
        ':idUsers'=>$data->id_users
    ]);

    if($query && $subQuery){
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