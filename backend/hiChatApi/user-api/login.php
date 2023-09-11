<?php 
    session_start();
    require('../connectDB.php');
    require('../header.php');
    require('../user-api/getFollowers.php');
    require_once('../autoload.php');


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
        ':mdp' =>$mdp // hash('md5', $mdp)
    ]);
    $responseRow = $query->rowCount();
    $queryResult = Array();
    $tmpUserData = $query->fetchAll();


    if($responseRow > 0){
        //it's the user
       // array_push($queryResult, getListOfIsPubLike($conn, $tmpUserData));

        $token = generateTokenAndSave(getUserID($tmpUserData));
        $tmpUserData[0]['token'] = $token;
        $tmpUserData[0]['session'] = $_SESSION;
        
        $tmpUserData[0]['isTokenValid'] = getTokenList($token);
        if($_SESSION[strval(getUserID($tmpUserData))]){
            array_push($queryResult, $tmpUserData);
        }

        //array_push($queryResult, getFollowers(getUserID($tmpUserData)));

        $response = json_encode($queryResult);
        echo $response;
    }


    function generateTokenAndSave($userID){
        $tokenManager = TokenManager::getInstance();
        $token = $tokenManager->generateToken($userID);

        return $token;
    }

    function getTokenList($token){
        $tokenManager = TokenManager::getInstance();
        return $tokenManager->isTokenValid($token);
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