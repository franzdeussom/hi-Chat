<?php 
    require('../connectDB.php');
    require('../header.php');

    global $conn;

    $getData = file_get_contents('php://input');

    if(!empty($getData) && isset($getData)){
        $data = json_decode($getData);
        http_response_code(200);
    }else{
        return;
    }
    $query = $conn->prepare("DELETE FROM HiChat.MESSAGE WHERE MESSAGE.id_destinateur_user = :id");
    $query->execute([
        ':id' => $data->id_users
    ]);
    if($query){
        echo json_encode([
            'confirm' => true,
            'success' => true
        ]);
    }else{
        echo json_encode([]);
    }
?>