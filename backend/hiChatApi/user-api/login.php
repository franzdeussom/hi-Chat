<?php 
    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');


    global $conn;
  //get data send from frontEnd
    $getDataUsers = file_get_contents('php://input');

    if(!empty($getDataUsers) && isset($getDataUsers)){

        $data = json_decode($getDataUsers);
        http_response_code(200);

    }else{
        echo 'Pas de Donnees envoyer au serveur';
        return;
    } 
   

    $userName = $data->login;
    $mdp = $data->mdp;
    
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE nom = :nom AND mdp = :mdp");
    $query->execute([
        ':nom' => $userName,
        ':mdp' => $mdp
    ]);
    $responseRow = $query->rowCount();
    $queryResult = Array();
    $tmpUserData = $query->fetchAll();

    array_push($queryResult, $tmpUserData);

    if($responseRow > 0){
        //it's the user
       // array_push($queryResult, getListOfIsPubLike($conn, $tmpUserData));
        array_push($queryResult, getFollowers(getUserID($tmpUserData)));
        $response = json_encode($queryResult);
        echo $response;
    }

    function getListOfIsPubLike($conn, $tmp): array{
         $sql = $conn->prepare('SELECT * FROM HiChat.PUB_LIKE WHERE PUB_LIKE.id_users = :id_users LIMIT 70');
         $sql->execute([
            ':id_users'=> getUserID($tmp)
         ]);
         if($sql->rowCount() > 0){
            return $sql->fetchAll();   
         }else{
            return [];
         }
         
    }

    function getUserID($data): int{
        return $data[0]['id_users'];
    }
?>