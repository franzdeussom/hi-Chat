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
    $query = $conn->prepare('UPDATE HiChat.PUBLICATION
                            SET PUBLICATION.libelle = :newValue
                            WHERE 
                                PUBLICATION.id_pub = :id_pub
                            ');
    $query->execute([
        ':newValue' => $data->newValue,
        ':id_pub' => $data->id_pub
    ]);
    
    if($query){
        $response = [
            'success' => true,
            'valid' => true,
        ];
        echo json_encode($response);
    }else{
        echo json_encode([]);
    }
?>