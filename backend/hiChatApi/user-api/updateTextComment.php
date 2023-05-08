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
    if(isset($data->id_commentaire) && !empty($data->id_commentaire)){
                
        $query = $conn->prepare('UPDATE HiChat.COMMENTAIRE
                                SET COMMENTAIRE.libelle = :newValue
                                WHERE 
                                    COMMENTAIRE.id_commentaire = :id_comment
                                ');
        $query->execute([
            ':newValue' => $data->newValue,
            ':id_comment' => $data->id_comment
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

    }else{

        $query = $conn->prepare('UPDATE HiChat.COMMENTAIRE
                                SET COMMENTAIRE.libelle = :newValue
                                WHERE                                         
                                   COMMENTAIRE.id_commentaire = (SELECT COMMENTAIRE.id_commentaire FROM HiChat.COMMENTAIRE WHERE COMMENTAIRE.PID = :PID)
                                ');
        $query->execute([
            ':newValue' => $data->newValue,
            ':PID' => $data->PID
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
    }
   
?>