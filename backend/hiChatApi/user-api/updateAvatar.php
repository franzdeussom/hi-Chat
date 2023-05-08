<?php
    require('../connectDB.php');
    require('../header.php');
    require('../file.service/saveFile.class.php');


    global $conn;

    $getData = file_get_contents('php://input');

    if(isset($getData) && !empty($getData)){
        $data = json_decode($getData);
        http_response_code(200);
    }else{
        return;
    }
    if($data->isBase64File){
        //base64 user image
         $saveFile = new SaveFile($data->profilImgUrl, $data->id_users);
       $fileToDecode = $saveFile->decodeFile();
       
      if($saveFile->moveFileAvatar($fileToDecode)){

            $query = $conn->prepare('UPDATE HiChat.USERS 
                             SET USERS.profilImgUrl = :img
                            WHERE USERS.id_users = :idUser
                            ');
            $query->execute([
                ':img' => $saveFile->getFileFullPath(),
                ':idUser'=> $data->id_users
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
        
    }else{
        //avatar from app
            $query = $conn->prepare('UPDATE HiChat.USERS 
                             SET USERS.profilImgUrl = :img
                            WHERE USERS.id_users = :idUser
                            ');
            $query->execute([
                ':img' => $data->profilImgUrl,
                ':idUser'=> $data->id_users
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
