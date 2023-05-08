<?php
    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');
    require('../user-api/getAbm.php');

    $data = file_get_contents('php://input');

    if(isset($data) && !empty($data)){
        $userData = json_decode($data);
    }else{
        return;
    }
    $response = array();
    array_push($response,  getFollowers($userData->id_users), getAbm($userData->id_users));
    $result = json_encode($response);
    echo $result;


?>