<?php
   require('../../connectDB.php');
   require('../../header.php');

 function searchWithOption($data){
    global $conn;
    
    if(withAllParameter($data)){
         execSearchWithAllParameter($data, $conn);
         return;
    }
    //double parameter
    if(isWithAgeAndCountry($data)){

        execSearchWithAgeAndCountry($data, $conn);
        return;
    }
    if(isWithAgeAndTown($data)){
        
        execSearchWithAgeAndTown($data, $conn);
        return;
    }
    if(isWithAgeAndSexe($data)){
        
        execSearchWithAgeAndSexe($data, $conn);
        return;
    }
    if(isWithCountryAndSexe($data)){
        execSearchWithCountryAndSexe($data, $conn);
        return;
    }
    if(isWithCountryAndTown($data)){
        
        execSearchWithCountryAndTown($data, $conn);
    }
    if(isWithTownAndSexe($data)){
        
        execSearchWithTownAndSex($data, $conn);
    }

    //unique parameter
    if(isWithAge($data)){
        execWithAge($data, $conn);
    }
    if(isWithCountry($data)){
        execWithCountry($data, $conn);
    }
    if(isWithTown($data)){
        execWithTown($data, $conn);
    }
    if(isWithSexe($data)){
        execWithSex($data, $conn);
    }

    //triple parameter

 }

function withAllParameter($data){
    return isWithAge($data) && isWithCountry($data) && isWithTown($data) && isWithSexe($data) ? true : false;
}
function isWithAge($data){
    return isset($data->age) ? true : false;
 }

function isWithCountry($data){
    return isset($data->pays) ? true : false;
}   

function isWithTown($data){
    return isset($data->ville) ? true : false;
}

function isWithSexe($data){
    return isset($data->sexe) ? true : false;
   
}

//double parameter
function isWithAgeAndCountry($data){
    //age and country
    return isWithAge($data) && isWithCountry($data) ? true : false;
}
function isWithAgeAndTown($data){
    //age and town
    return isWithAge($data) && isWithTown($data) ? true : false;
}
function isWithAgeAndSexe($data){
    //age and sex
    return isWithAge($data) && isWithSexe($data) ? true : false;
}
function isWithCountryAndTown($data){
    //country and Town
    return isWithCountry($data) && isWithTown($data) ? true : false;
}
function isWithCountryAndSexe($data){
    //Country and sex
    return isWithCountry($data) && isWithSexe($data) ? true : false;
}
function isWithTownAndSexe($data){
    //age and sex
    return isWithTown($data) && isWithSexe($data) ? true : false;
}

//triple function
function isWithAgeSexeAndTown($data){
 //age, sex, town
   return isWithAge($data) && isWithSexe($data) && isWithTown($data) ? true : false; 
}

function isWithAgeSexeAndCountry($data){
    //age, sex, country
    return isWithAge($data) && isWithSexe($data) && isWithCountry($data) ? true : false;
}

function isWithAgeCountryAndTown($data){
    return isWithAge($data) && isWithCountry($data) && isWithAgeAndTown($data);
}

function execWithAge($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.age = :age"); 
        $query->execute([
            ':age' => $data->age
        ]);
        $nbrRow = $query->rowCount();
        execResponse($nbrRow, $query);
}

function execWithCountry($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE  USERS.pays = :pays"); 
        $query->execute([
            ':pays' => $data->pays
        ]);
        $nbrRow = $query->rowCount();
        execResponse($nbrRow, $query);
}

function execWithTown($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE  USERS.ville = :ville"); 
    $query->execute([
        ':ville' => $data->ville
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

function execWithSex($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE  USERS.sexe = :sexe"); 
    $query->execute([
        ':sexe' => $data->sexe
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

            /*exec functions...
            ** all double functions
            */

function execResponse($nbrRow, $query){
    //function of response statment of all search possibility...

    /*if($nbrRow == 1) {
        //user found
        $result = $query->fetchAll();
        $response = json_encode($result);
        echo $response;

    }else */
    if($nbrRow > 0){
        //users found 
        $result = $query->fetchAll();
        $response = json_encode($result);
        echo $response;
    }else{
        //no user found
        echo json_encode([]);

    }
}

function execSearchWithAllParameter($data, $conn){

        $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.age = :age AND USERS.pays = :pays AND USERS.ville = :ville AND USERS.sexe = :sexe"); 
        $query->execute([
            ':age' => $data->age,
            ':pays' => $data->pays,
            ':ville' => $data->ville,
            ':sexe' => $data->sexe
        ]);
        $nbrRow = $query->rowCount();
        execResponse($nbrRow, $query);
        
}
//age with country

function execSearchWithAgeAndCountry($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.age = :age AND USERS.pays = :pays"); 
    $query->execute([
        ':age' => $data->age,
        ':pays' => $data->pays
    ]);
    $nbrRow = $query->rowCount();

    execResponse($nbrRow, $query);
}

// age with Town 
function execSearchWithAgeAndTown($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.age = :age AND USERS.ville = :ville"); 
    $query->execute([
        ':age' => $data->age,
        ':ville' => $data->ville
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

//age And Sexe
function execSearchWithAgeAndSexe($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.age = :age AND USERS.sexe = :sexe"); 
    $query->execute([
        ':age' => $data->age,
        ':sexe' => $data->sexe
    ]);
    $nbrRow = $query->rowCount();
    
    execResponse($nbrRow, $query);

}

//country and town
function execSearchWithCountryAndTown($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.pays = :pays AND USERS.ville = :ville"); 
    $query->execute([
        ':pays' => $data->pays,
        ':ville' => $data->ville
    ]);

    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);

}
// country and sexe 
function execSearchWithCountryAndSexe($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.pays = :pays AND USERS.sexe = :sexe"); 
    $query->execute([
        ':pays' => $data->pays,
        ':sexe' => $data->sexe
    ]);

    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

// town and Sexe

function execSearchWithTownAndSex($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.ville = :ville AND USERS.sexe = :sexe"); 
    $query->execute([
        ':ville' => $data->ville,
        ':sexe' => $data->sexe
    ]);

    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}  

  /*exec functions...
            ** all triple functions
          */

function execSearchWithAgeSexeAndTown($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.ville = :ville AND USERS.sexe = :sexe AND USERS.ville = :ville"); 
    $query->execute([
        ':age' => $data->age,
        ':sexe' => $data->sexe,
        ':ville' => $data->ville
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}
function execSearchWithAgeSexeAndCountry($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.ville = :ville AND USERS.sexe = :sexe AND USERS.pays = :pays"); 
    $query->execute([
        ':age' => $data->age,
        ':sexe' => $data->sexe,
        ':pays' => $data->pays
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

function execSearchWithAgeCountryAndTown($data, $conn){
    $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.ville = :ville AND USERS.pays = :pays AND USERS.ville = :ville"); 
    $query->execute([
        ':age' => $data->age,
        ':pays' => $data->pays,
        ':ville' => $data->ville
    ]);
    $nbrRow = $query->rowCount();
    execResponse($nbrRow, $query);
}

 ?>