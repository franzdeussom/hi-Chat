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

        if(!isset($data->PID) && empty($data->PID)){
            $query = $conn->prepare("DELETE FROM HiChat.PUBLICATION 
                                        WHERE
                                        PUBLICATION.id_pub = :id
                                    ");
             $query->execute([':id'=> $data->id_pub]);


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
                $query = $conn->prepare("DELETE FROM HiChat.PUBLICATION 
                                        WHERE
                                        PUBLICATION.PID = :id
                                    ");
             $query->execute([':id'=> $data->PID]);


            if($query){
                $response = [
                    'success' => true,
                    'valid_PID' => true
                ];
                echo json_encode($response);
            }else{
                echo json_encode([]);
        }
    }
                
      

    
?>
