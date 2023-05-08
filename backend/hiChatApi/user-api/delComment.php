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

    if(isset($data->id_comment) && !empty($data->id_comment)){
        $query = $conn->prepare('DELETE FROM HiChat.COMMENTAIRE 
                                    WHERE
                                    COMMENTAIRE.id_commentaire = :id_comment
                                ');
            $query->execute([
                ':id_comment' => $data->id_comment
            ]);

            if($query){
                    $response = [
                    'success' => true,
                    'valid' => true
                    ];
                echo json_encode($response);
            }else{
                echo json_encode([]);
            }
    }else{
        $query = $conn->prepare('DELETE FROM HiChat.COMMENTAIRE 
                                    WHERE
                                    COMMENTAIRE.PID = :id
                                ');
            $query->execute([
                ':id' => $data->PID,
            ]);

            if($query){
                    $response = [
                    'success' => true,
                    'valid' => true
                    ];
                echo json_encode($response);
            }else{
                echo json_encode([]);
            }
    }
   
?>
