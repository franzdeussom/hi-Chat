<?php
    function getAllMale($conn): array{
            $query = $conn->prepare("SELECT * FROM HiChat.USERS WHERE USERS.sexe = 'M' ORDER BY USERS.nom ASC");
            $query->execute();
            $row = $query->rowCount();

            if($row > 0){
                return $query->fetchAll();
                http_response_code(200); 
            }else{
                http_response_code(501); 
                return [];
            }
    }      
?>