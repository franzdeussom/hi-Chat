<?php
    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;
    require('../connectDB.php');
    require('../header.php');
    require 'vendor/autoload.php';

    class Notification implements MessageComponentInterface{
        protected $user;
        protected $currentUsers;
        protected $tab_usersOnline;
        protected $tabNotificationSave; 
    
        public function __construct(){
            $this->user = new \SplObjectStorage;
            $this->tab_usersOnline = array();
            $this->tabNotificationSave = array();
        } 
        
        public function onOpen(ConnectionInterface $conn)
        {
            $querystring =$conn->httpRequest->getUri()->getQuery();
            $this->user->attach($conn);

            $this->addInOnlineList($conn, $querystring);
            echo "New Connection\n";
            //checkNotificationSave();
        }

        public function onMessage(ConnectionInterface $from, $msg)
        {
            $notifTmp = json_decode($msg);
            if(isset($notifTmp) && !empty($notifTmp)){
                    $id_destinataire ='id='. strval($notifTmp->id_destinataire);
                if($this->isPublicationNotif($id_destinataire)){
                    //the notif is an publication, share notif to all friend
                    $this->sendToAllFriend($msg, $id_destinataire, 'id='.$notifTmp->id_UsersSender);
                }else{
                    if($this->isUserOnline($id_destinataire)){
                        $this->sendNotification($id_destinataire, $msg);
                    }else{
                            echo "User {$id_destinataire} pas connecté \n";
                    }
                }
                    
            }else{
                echo "pas de message recu \n";
            }
            
        }

        public function onClose(ConnectionInterface $conn)
        {       
               $this->user->detach($conn);
                echo "\n one user log out \n *********************\n";
        }
        public function onError(ConnectionInterface $conn, Exception $e)
        {
                echo " Error on user {$conn->ressourceId}: Error type : {$e->getMessage()} \n";
            
        }

        //function to help the class

        private function addInOnlineList($conn, $clef){
            try{
                if(count($this->tab_usersOnline) > 0){
                    if(!$this->isUserOnline($clef)){
                        $this->tab_usersOnline[strval($clef)] = $conn;
                        echo "**********************\n Add in websocket notif list \n";
                    }
                }else{
                    $this->tab_usersOnline[strval($clef)] = $conn;
                    echo " Add in websocket notif list \n";
                }
            }catch(Exception $e){
                    echo '\n'. $e->getMessage();
            }
            
                
        }

        private function isUserOnline($clef): bool{
            return array_key_exists(strval($clef), $this->tab_usersOnline);
        }

        private function sendNotification($id_destinataire, $notification){
            $userReceiver = $this->tab_usersOnline[strval($id_destinataire)];
           try{
                foreach($this->user as $userRessource){
                    if($userRessource === $userReceiver){
                        $userRessource->send($notification);
                        echo "Notification send to user with {$id_destinataire} \n";
                    }
                } 
           }catch(Exception $e){
                echo ''. $e->getMessage();
           }
             
        }

        private function isPublicationNotif($id): bool{
                return strcmp($id, 'id=*') === 0;
        }

        private function sendToAllFriend($msg, $id_destinataire, $idSenderRsrc){
            $ressoureID = $this->tab_usersOnline[strval($idSenderRsrc)];

            foreach($this->user as $friend){
                if($friend !== $ressoureID){
                    $friend->send($msg);
                    echo "Publication share to {$id_destinataire} friend\n";
                }
            }
        }
    }
?>