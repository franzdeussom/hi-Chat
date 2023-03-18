<?php
 use Ratchet\MessageComponentInterface;
 use Ratchet\ConnectionInterface;
 require('../connectDB.php');
 require('../header.php');
 require('../msg-api/postMessage.php');
 require 'vendor/autoload.php';
 global $saveMessageDB;

class Chat implements MessageComponentInterface{
    protected $user;
    protected $currentUsers;
    protected $tab_usersOnline;

    public function __construct(){
        $this->user = new \SplObjectStorage;
        $this->tab_usersOnline = array();
    }

    //implementations of method for the parent Interface

    public function onOpen(ConnectionInterface $conn){
        $this->user->attach($conn);
        //get param with the id_users
        $querystring =$conn->httpRequest->getUri()->getQuery();
        
        $this->addOnlineList($querystring, $conn);

        echo "\nNew connection! ({$conn->resourceId}) \n";

        //$this->sendNotifOnline($querystring, $conn);
    }   
    public function onMessage(ConnectionInterface $from, $msg){
        global $conn;
        //get the message and decode it in JSON format, then send to recipient with her ID
        
        $data = json_decode($msg);

       if($this->isMessageValid($data)){
            $id_users = '';
            $idReceiver = $data->id_destinateur_user;
            $id_users = 'param=' . $idReceiver;
            echo "id receive param {$data->id_destinateur_user}\n";
            
            if($this->isOnline($id_users)){
                //user online he will receive direct the message
                foreach($this->tab_usersOnline as $clef => $userOnline){
                   echo "{$clef} == {$id_users} ?\n ";
                    if($clef === strval($id_users)){
                        foreach($this->user as $user){
                            if($user === $userOnline){
                                $user->send($msg);
                                echo "New message send to {$clef} with id = {$user->resourceId}\n";
                                $id_users = '';
                            }
                        }
                    }
                }
            }else{
                try{
                    if(saveMessageDB($msg)){
                        echo 'Message Save Tmp in Database\n';
                    }else{
                        echo 'Error on save\n';
                    };
                }catch(Exception $e){
                   echo $e->getMessage();
                }
            }
            
        }
        
    }
    public function onClose(ConnectionInterface $conn){
        //deconnect the user on a list of user online
        $this->getParamOfUserLogOut($conn);
        $this->user->detach($conn);

        unset($this->tab_usersOnline[$this->currentUsers]);
        echo "Utilisateur move {$this->currentUsers} \n";
        echo "logout user {$conn->resourceId}\n********************\n";
    } 
    public function onError(ConnectionInterface $conn, Exception $e){
        
    }

    //my own function

    private function isOnline($id_users){
        //verify if the user is already online(present in the  online user tab)
        return isset($this->tab_usersOnline[strval($id_users)]) && !empty($this->tab_usersOnline[strval($id_users)]) ? true: false;   
    }

    private function getParamOfUserLogOut($conn){
        foreach($this->tab_usersOnline as $key => $user){
            if($user == $conn){
                $this->currentUsers = $key;
            }
        }
    }

 /*private function sendNotifOnline($id_users, $conn){
        $NotifOnline = ''. $id_users;
        foreach($this->user as $user){
            if($user !== $conn){
                $user->send($NotifOnline);
            }
            echo 'Notif send';
        }
    }*/

    private function addOnlineList($id_users, $conn){
        //try to add the user in the online list with her id = key and her connection stamment 
        try{
            if(!$this->isOnline($id_users)){
                $this->tab_usersOnline[strval($id_users)] = $conn;
                $a = $this->tab_usersOnline[strval($id_users)];
                $this->currentUsers = strval($id_users);

                echo "************************\nUsers add in online list ({$a->resourceId})\n";

            }else{
                echo "************************\nUsers dont add in online list ({$conn->resourceId})\n";
    
            }

            foreach($this->tab_usersOnline as $key => $user){
                echo "User {$user->resourceId} and {$key} \n";
            }
        }catch(Exception $e){
          echo $e->getMessage();
        }
        
    }

    private function isMessageValid($msgData){
        return isset($msgData) && !empty($msgData) ? true : false;
    }
  
 }
?>