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

    $query = $conn->prepare('UPDATE HiChat.USERS 
                             SET USERS.nom = :nom,
                                 USERS.prenom = :prenom,
                                 USERS.email = :email,
                                 USERS.sexe = :sexe,
                                 USERS.tel = :tel,
                                 USERS.mdp = :mdp,
                                 USERS.pays = :pays,
                                 USERS.age = :age,
                                 USERS.date_naiss =:dateNaiss,
                                 USERS.ville = :stadt
                            WHERE USERS.id_users = :idUser
                            ');
    $query->execute([
        ':nom' => $data->nom,
        ':prenom' => $data->prenom,
        ':email' => $data->email,
        ':sexe'=> $data->sexe,
        ':tel'=> $data->tel,
        ':mdp'=> $data->mdp,
        ':pays'=> $data->pays,
        ':age'=>$data->age,
        ':dateNaiss'=>$data->date_naiss,
        ':stadt'=> $data->ville,
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
?>
