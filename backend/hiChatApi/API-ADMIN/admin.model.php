<?php
    class AdminOperation{
        public $nbreUsersOnline;
        public $nbreMessageStore;
        public $nbreNotifStore;

        public function __construct(){
            $this->nbreUsersOnline = 0;
            $this->nbreMessageStore = 0;
            $this->nbreNotifStore = 0;
        }

        public function getNbrUserOnline(): int{
            return $this->nbreUsersOnline;
        }
        public function setNbrUserOnline($nbr){
           $this->nbreUsersOnline = $nbr;
        }
        public function getNbrMessageStore(): int{
            return $this->nbreMessageStore;
        }
        public function setNbrMessageStore($nbr){
             $this->nbreMessageStore = $nbr;
        }

    }
?>
