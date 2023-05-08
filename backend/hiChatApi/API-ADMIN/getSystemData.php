<?php
    require('../header.php');
    require('./function/setSystem.data.php');

       /* $receivingData = file_get_contents('php://input');

        if(isset($receivingData) && !empty($receivingData)){

            $data = json_decode($receivingData);

        }else{
            http_response_code(501);
            return;
        }*/

     $type = '*';
    switch ($type){

        /*case 'NBR_USERS_ONLINE':
            $response =[
                'number' => getNbrUserOnline()
            ];
            echo json_encode($response);
            break;

        case 'NBR_MESSAGE_STORE':
            $response = [
                'number' => getNbrMessageStore()
            ];
            echo json_encode($response);
            break;

        case 'NBR_NOTIF_STORE':
            $response = [
                'number' => $_SESSION['nbrNotif']
            ];
            echo json_encode($response);
            break;*/

        case '*':
            $response = [
                'nbrUserOnline' =>  getNbrUserOnlineStore(),
                'nbrMessageStore' =>getMsgStore(),
                'nbrNotif' =>  getNbrNotif()
            ];
            echo json_encode($response);
            break;
    }

?>