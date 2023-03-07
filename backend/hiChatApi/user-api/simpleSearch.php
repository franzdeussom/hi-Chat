<?php
    require('../connectDB.php');
    require('../header.php');
    

    function singleSearch($data){
        global $conn;
        $nom = $data->nom;
        $prenom = $data->prenom;

        if($nom == '' || empty($nom) || !isset($nom)){
            echo json_encode([]);
        }else{

            //search only with name
            try{
                if(!empty($prenom)){
                    $query = $conn->prepare("SELECT * From HiChat.USERS WHERE USERS.nom = :nom AND USERS.prenom LIKE :prenom");
                    $query->execute([
                       ':nom'=>$nom,
                       ':prenom'=>$prenom . '%'
                    ]);
                    $row = $query->rowCount();
                    $result = $query->fetchAll();
                       if($row > 0){
                           echo json_encode($result);
                       }else{
                        //no user found
                           echo json_encode([]);
                       }
                   }else{
                    $sql = $conn->prepare("SELECT * From HiChat.USERS WHERE USERS.nom LIKE :nom");
                    $sql->execute([
                        ':nom' =>$nom . '%'
                       ]);
       
                    $row = $sql->rowCount();
                    $result = $sql->fetchAll();
                       if($row > 0){
                           echo json_encode($result);
                       }else{
                        //no user found
                           echo json_encode([]);
                       }
               }
            }catch(Exception $e){
                echo $e->getMessage();
            }
        }
            
    }
  
?>