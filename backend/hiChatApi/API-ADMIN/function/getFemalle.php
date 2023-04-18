<?php

    function getAllFemalle($conn): array{
            $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.sexe = 'F' ORDER BY USERS.nom ASC");
            $query->execute();
            $row = $query->rowCount();

            if($row > 0){
                return $query->fetchAll(); 
            }else{
                return [];
            }
    }      
?>