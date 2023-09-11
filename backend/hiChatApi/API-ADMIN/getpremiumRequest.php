<?php 
     require('../connectDB.php');
     require('../header.php');
     require('./function/getFemalle.php');
     require('./function/getMale.php');
     require('../file.service/file.class.php');

     global $conn;

     $sql = "SELECT DISTINCT PREMIUM_REQUEST.id_request,
                    PREMIUM_REQUEST.id_user,
                    PREMIUM_REQUEST.date_request,
                    PREMIUM_REQUEST.premiumType,
                    PREMIUM_REQUEST.REQUEST_DECISION,
                    PREMIUM_REQUEST.price,
                    USERS.nom,
                    USERS.prenom,
                    USERS.profilImgUrl
             FROM HiChat.PREMIUM_REQUEST, HiChat.USERS WHERE  PREMIUM_REQUEST.id_user = USERS.id_users";
     
     $query = $conn->prepare($sql);
     $query->execute();
     
     $result = $query->fetchAll();
     $rowCount = $query->rowCount();

     if($rowCount < 0){
            $response = [];
            echo json_encode($response);
     }else{
        echo json_encode($result);
     }
?>