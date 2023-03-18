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

    $id_users = $data->id_user;
    $libellePub = $data->libelle;
    $datePub = $data->date_pub;
    $url_file  = null;
    $is_public = $data->is_public;
    $bgColor  = $data->colorBg;

    $query = $conn->prepare('INSERT INTO HiChat.PUBLICATION(
                                id_user,
                                libelle,
                                date_pub,
                                url_file,
                                is_public,
                                colorBg,
                                PID )  VALUES(
                                    :id,
                                    :libelle,
                                    :date_pub,
                                    :url_file,
                                    :isPublic,
                                    :Color,
                                    :pid
                                     )
                            ');
    $query->execute([
        ':id' => $id_users,
        ':libelle' => $libellePub,
        ':date_pub' => $datePub,
        ':url_file' => $url_file,
        ':isPublic' => $is_public,
        ':Color' => $bgColor,
        ':pid'=> $data->PID
    ]);

    if($query){
        $response =json_encode([
            'success'=> true,
            'insert'=> true
        ]);
        echo $response;
    }else{
        $response = json_encode([]);
        http_response_code(500);
        echo $response;
    }
?>