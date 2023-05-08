<?php
    require('standard.enum.php');

    class SaveFile{
        private $FOLDER_NAME  = '../hichatpubs/';
        private $fileToMove;
        private $idUser;
        private $img_full_path;

        public function __construct($fileBase64, $idUser){
            $this->fileToMove = $fileBase64;
            $this->idUser = $idUser;
        }

        public function decodeFile(): string{
            $file_parts = explode(';base64,', $this->fileToMove);
            
            return $file_parts[1];
        }

        public function moveFile($fileToDecode): bool{
            $prev_path = 'User'.$this->idUser;

            if(!is_dir($this->FOLDER_NAME.$prev_path)){
                mkdir($this->FOLDER_NAME.$prev_path.'/');
                mkdir($this->FOLDER_NAME.$prev_path.'/Publications');
                
                $file = $this->FOLDER_NAME.$prev_path."/Publications/".uniqid().''. $this->idUser.'.png';
                
            }else{
                $file = $this->FOLDER_NAME.$prev_path.'/Publications/'.uniqid().''. $this->idUser.'.png';
            }

            $this->img_full_path =Standard::API_PORT->value.Standard::FOLDER_ROOT_IMG->value.$file;

            return gettype(file_put_contents($file, base64_decode($fileToDecode))) !== 'boolean' ? true:false;
        }

       public function moveFileAvatar($fileToDecode){
            $prev_path = 'User'.$this->idUser;
            
            if(!is_dir($this->FOLDER_NAME.$prev_path)){
                mkdir($this->FOLDER_NAME.$prev_path.'/');
                mkdir($this->FOLDER_NAME.$prev_path.'/Avatar');
            }else{
                if(!is_dir($this->FOLDER_NAME.$prev_path.'/Avatar')){
                    mkdir($this->FOLDER_NAME.$prev_path.'/Avatar');
                }
            }
            $file = $this->FOLDER_NAME.$prev_path.'/Avatar/'. uniqid() . '.png';
            $this->img_full_path =Standard::API_PORT->value.Standard::FOLDER_ROOT_IMG->value.$file;
            
            return gettype(file_put_contents($file, base64_decode($fileToDecode))) !== 'boolean' ? true:false;
       }

       public function getFileFullPath(): string{
                return $this->img_full_path;
        }

    }

?>