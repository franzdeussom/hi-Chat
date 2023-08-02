<?php
    require('standard.enum.php');

    class File{
        private $fileName;
        private $DEFAULT_FILE_PATH = Standard::DEFAULT_FILE_PATH_DATA->value;

        public function __construct($fileName)
        {   
            $this->fileName = $fileName;
        }

        public function setFileName($newFileName){
            $this->fileName = $newFileName;
        }

        public function writeFileData($data, $path): bool {

            if($path == null){
               return gettype(file_put_contents($this->DEFAULT_FILE_PATH.$this->fileName, $data)) !== 'boolean' ? true: false;
            }else{
               return gettype(file_put_contents($path.$this->fileName, $data)) !== 'boolean' ? true: false;        
            }
        }

        public function getFileData($fileName, $path): string{
            if($this->checkIfFileExist($fileName, $path)){
                $fileContent = $path == null ? file_get_contents($this->DEFAULT_FILE_PATH.$fileName):file_get_contents($path.$fileName);
            }else{
                $fileContent = 'Pas De Donnees';
            }

            return gettype($fileContent) !== 'boolean' ? $fileContent : 'ERROR_ON_OPEN';
        }

        private function checkIfFileExist($fileName, $path): bool{
            return $path == null ? file_exists($this->DEFAULT_FILE_PATH.$fileName):file_exists($path.$fileName);
        }

    }
?>