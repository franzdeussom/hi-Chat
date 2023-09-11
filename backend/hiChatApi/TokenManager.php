<?php

    class TokenManager{
        private $tokensList;
        private static $instance = null;
        private $secretKey = 'HiChat-Franz2003';
        private $algo  = 'aes-256-cbc';

        private function __construct() {
            $this->tokensList = [];
        }

        public static function getInstance(){
                if(!self::$instance || self::$instance == null){
                    self::$instance = new TokenManager();
                }
            
                return self::$instance;
        }

        function generateToken($userID): string{
                $iv = openssl_random_pseudo_bytes(16);
                

                $token = openssl_encrypt(strval($userID), $this->algo, $this->secretKey, 0, 16);

                $_SESSION[strval($userID)] = $token;
                
                return $token;
        }

        function isTokenValid($token){
            $iv = openssl_random_pseudo_bytes(16);
            
            $userID = openssl_decrypt($token, $this->algo, $this->secretKey, 0, 16);
            
            return isset($_SESSION[$userID]) ? true: false;
         //   return isset($this->tokensList[$userID]) && $this->tokensList[$userID] === $token; 
        }

        function decrypt($token){

            $userID = openssl_decrypt($token, $this->algo, $this->secretKey, 0, 16);
            
            return $userID;
        }

        function getTokensList(): array{
            
            return $_SESSION;
        }
    }

?>