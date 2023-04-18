<?php

        try{
            $conn = new PDO('mysql:host=localhost:3306;db_name=HiChat;', 'root', '');
            $conn->setAttribute(PDO::ERRMODE_EXCEPTION, PDO::ATTR_ERRMODE);
         }
        catch(Exception $e){
            echo $e->getMessage();
        }
?>