<?php
    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;
    require('../connectDB.php');
    require('../header.php');
    require 'vendor/autoload.php';

    class Notification implements MessageComponentInterface{
        protected $user;
        protected $notifMissed;
        protected $currentUsers;
        protected $tab_usersOnline;
        protected $tabNotificationSave;
        protected $idCurrentUsers;
        protected $globalUserOnlineTab;

    
        public function __construct(){
            $this->user = new \SplObjectStorage;
            $this->tab_usersOnline = array();
            $this->tabNotificationSave = array();
            $this->notifMissed = array();
            $this->globalUserOnlineTab = array();        
        } 
        
        public function onOpen(ConnectionInterface $conn)
        {
            $querystring =$conn->httpRequest->getUri()->getQuery();
            $this->user->attach($conn);
            //add in list to send of users who are online
            array_push($this->globalUserOnlineTab, strval($querystring));
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
                            $formatNotif = [
                                'idUser' => $id_destinataire,
                                'notif' => $msg
                            ];
                            array_push($this->notifMissed, json_encode($formatNotif));
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
               $key = array_search($conn, $this->tab_usersOnline);
               unset($this->tab_usersOnline[strval($key)]);

               $index = array_search(strval($key), $this->globalUserOnlineTab);
               array_splice($this->globalUserOnlineTab, $index, 1);

               $this->notifOnLogOut($key, $conn);
               echo "one user log out \n *********************\n";
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
                        $this->getListUserOnline($conn);
                        $this->notifOnNewConnection($clef, $conn);
                        $this->checkOfNotifMissedAndSendIt($clef, $conn);
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
        private function getListUserOnline($currentUsers){
            //send on log in to current user the list of online user 
            $response = [
                'type'=> 'LIST_USER_ONLINE',
                'list'=>$this->globalUserOnlineTab
            ];
            $currentUsers->send(json_encode($response));
        }

        private function notifOnNewConnection($clef, $currentConn){
            //notif other user when an new user log in
            $response = [
                'type'=> 'NEW_USER_ONLINE',
                'id'=> $clef
            ];
                foreach($this->user as $userOnline){
                    if($userOnline !== $currentConn){
                      $userOnline->send(json_encode($response));
                    }
                }
        }
        private function notifOnLogOut($clef, $currentConn){
            //notif other user when a user log out
            $response = [
                'type'=> 'USER_LOGOUT',
                'id'=> $clef
            ];
                foreach($this->user as $userOnline){
                    if($userOnline !== $currentConn){
                      $userOnline->send(json_encode($response));
                    }
                }
        }

        private function checkOfNotifMissedAndSendIt($idUser, $conn){
                $index = 0;
                if(count($this->notifMissed) > 0){
                    foreach($this->notifMissed as $notif){
                        $notifDecode = json_decode($notif);
                        if($notifDecode->idUser === $idUser){
                            echo 'SEND NOTIF MISSED';
                            $conn->send($notifDecode->notif);
                            array_splice($this->notifMissed, $index, 1);
                        }
                    }
                    $this->deleteNotifOfUserAlreadySend($idUser, count($this->notifMissed));
                }     
        }
        
        private function deleteNotifOfUserAlreadySend($idUser, $size){
            $tmp = array();
            for($i = 0; $i < $size; $i++){
                $notifDecode = json_decode($this->notifMissed[$i]);
                if($notifDecode->idUser !== $idUser){
                     array_push($tmp, json_encode($notifDecode));
                }
            }
            $this->notifMissed = $tmp;
               
        }
    }
?>