<?php
       spl_autoload_register(function ($className){
                $path  = __DIR__ .'/TokenManager'.'.php';
                if(file_exists($path)){
                        require_once($path);
                        if($className === 'TokenManager'){
                                TokenManager::getInstance();
                        }
                }
       })
?>