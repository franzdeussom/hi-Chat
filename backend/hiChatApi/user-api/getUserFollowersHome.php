<?php
    session_start();
    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');
    require('../user-api/getAbm.php');
    require('../autoload.php');

    $data = file_get_contents('php://input');

    if(isset($data) && !empty($data)){
        $userData = json_decode($data);
    }else{
        return;
    }
    $headers = $_SERVER['HTTP_AUTHORIZATION'];

  /*  if(isset($headers)){
        $tokenManager = TokenManager::getInstance();
        
        if(!$tokenManager->isTokenValid($headers)){
            http_response_code(401);
            echo json_encode(['res' =>$headers, 'sexion' => $_SESSION, 'isValid' => $tokenManager->decrypt($headers)]);
            return ;
        }
    }else{
        return;
    }
*/
    $response = array();
    array_push($response,  getFollowers($userData->id_users), getAbm($userData->id_users));
    $result = json_encode($response);
    echo $result;


?>