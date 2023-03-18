<?php
    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');

    $data = file_get_contents('php://input');

    if(isset($data) && !empty($data)){
        $userData = json_decode($data);
    }else{
        return;
    }
   
    $result = json_encode(getFollowers($userData->id_users));
    echo $result;
?>