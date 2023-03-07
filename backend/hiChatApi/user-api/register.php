<?php
    require('../connectDB.php');
    require('../header.php');

    global $conn;

    $getDataUser = file_get_contents('php://input');

    if(isset($getDataUser) && !empty($getDataUser)){
        $data = json_decode($getDataUser);
        http_response_code(200);
    }else{
        return;
    }

    $userName = $data->nom;
    $userPrenom = $data->prenom;
    $userEmail = $data->email;
    $userSexe = $data->sexe;
    $userAge =(int) $data->age;

    if(isset($data->tel)){
      $userTel = $data->tel;
    }

    if(isset($data->profilImgUrl)){
        $userProfilUrl = $data->profilImgUrl;
    }
    $userMdp = $data->mdp;
    $userVille = $data->ville;
    $userCountry = $data->pays;
    //date format yyyy:MM:DD
    $userDateNaiss = $data->date_naiss;
    $userDateCreationAccount = date('Y-m-d');
    
    if(checkAlreadyUsers($userName, $userEmail, $userPrenom) == 0){

        $alreadyUsers = json_encode(array(
            'sucess' => false,
            'alreadyUserName' => true,
            'alreadyUserEmail' => false
        ));
        echo $alreadyUsers;
    }else if(checkAlreadyUsers($userName, $userEmail, $userPrenom) == 1) {
            // no already user with the name and email
            insertData(); 

    }else if(checkAlreadyUsers($userName, $userEmail, $userPrenom) == 2){
        $alreadyUsers = json_encode(array(
            'sucess' => false,
            'alreadyUserName' => false,
            'alreadyUserEmail' => true
        ));
        echo $alreadyUsers;
    }

    //create function of insertion of Data
   

    function checkAlreadyUsers($name, $email, $prenom){
        global $conn;
        $sql = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.nom = :nom AND USERS.prenom = :prenom ");
        $sql->execute([
            ':nom' => $name,
            ':prenom' => $prenom
        ]);
        $result = $sql->rowCount();

        if($result > 0 ){
            return 0;
        }else{
             $verifMail = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.email = :email ");
             $verifMail->execute([
                ':email' => $email
              ]);
              $result = $verifMail->rowCount();
              
              if($result > 0){
                return 2;
              }
              else{
                return 1;
              }
        }
    }

    function insertData(){
        global $userName, $userPrenom, $userEmail, $userSexe, $userAge, $userTel, $userMdp, $userProfilUrl, $userVille, $userCountry, $userDateNaiss, $userDateCreationAccount;
        global $conn;
       $query = $conn->prepare("INSERT INTO HiChat.USERS(
            nom, 
            prenom, 
            email, 
            sexe,
            tel, 
            mdp, 
            profilImgUrl, 
            pays, 
            age, 
            date_naiss, 
            date_creationAccount, 
            ville
            )
            VALUES(
                :nom,
                :prenom,
                :email,
                :sexe,
                :tel,
                :mdp,
                :imgUrl,
                :pays,
                :age,
                :dateNaiss,
                :dateCreationAccount,
                :ville
                 );
        ");
        $query->execute([
            'nom' => $userName,
            'prenom' => $userPrenom,
            'email' => $userEmail,
            'sexe' => $userSexe,
            'tel' => $userTel,
            'mdp' => $userMdp,
            'imgUrl' => $userProfilUrl,
            'pays' => $userCountry,
            'age' => $userAge,
            'dateNaiss' => $userDateNaiss,
            'dateCreationAccount' => $userDateCreationAccount,
            'ville' => $userVille
        ]);

        if($query){
            //return insertion confirmation
            $resp = json_encode([
                'sucess' => true,
                'complete' => true
            ]);
        
            echo $resp;
        }else{
            echo json_encode([]);
        }
    }
?>