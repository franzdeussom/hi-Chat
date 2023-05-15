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

    $query = $conn->prepare('INSERT INTO HiChat.PREMIUM_REQUEST( 
                            id_user,
                            date_request,
                            premiumType,
                            REQUEST_DECISION,
                            PRICE
                           ) 
                            VALUES(
                                :id_user,
                                :date_request,
                                :premiumType,
                                :requestDecision,
                                :price
                            )');
    $query->execute([
        ':id_user' => $data->id_user,
        ':date_request' => $data->date_request,
        ':premiumType'=> $data->premiumType,
        ':requestDecision'=>$data->REQUEST_DECISION,
        ':price'=> $data->price
    ]);

    $sub = $conn->prepare("UPDATE HiChat.USERS 
                           SET USERS.accountType = 'EN_COURS'
                           WHERE USERS.id_users = :id_users
                        ");
    $sub->execute([
        ':id_users'=>$data->id_user
    ]);

    if($query && $sub){
        $response = [
            'success' => true,
            'valid' => true
        ];
        echo json_encode($response);
    }else{
        echo json_encode([]);
    }
?>
