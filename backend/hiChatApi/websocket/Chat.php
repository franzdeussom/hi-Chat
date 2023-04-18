<?php
 session_start();
 use Ratchet\MessageComponentInterface;
 use Ratchet\ConnectionInterface;
 require('../API-ADMIN/admin.model.php');
 require('../API-ADMIN/function/setSystem.data.php');

 require 'vendor/autoload.php';
 
class Chat implements MessageComponentInterface{
    protected $user;
    protected $currentUsers;
    protected $tab_usersOnline;
    protected $msgMissed;
    private $nbreMsgStore;
    private $nbrUsersOnline;

    public function __construct(){
        $this->user = new \SplObjectStorage;
        $this->tab_usersOnline = array();
        $this->msgMissed = array();
        $this->nbrUsersOnline = 0;
        $this->nbreMsgStore = 0;
    }

    //implementations of method for the parent Interface

    public function onOpen(ConnectionInterface $conn){
        $this->user->attach($conn);
        //get param with the id_users
        $querystring =$conn->httpRequest->getUri()->getQuery();
        
        $this->addOnlineList($querystring, $conn);

        echo "\nNew connection! ({$conn->resourceId}) \n";

    }   
    public function onMessage(ConnectionInterface $from, $msg){
        //get the message and decode it in JSON format, then send to recipient with her ID
        
        $data = json_decode($msg);

       if($this->isMessageValid($data)){
            $id_users = '';
            $idReceiver = $data->id_destinateur_user;
            $id_users = 'param=' . $idReceiver;
            
            if($this->isOnline($id_users)){
                //user online he will receive direct the message
               // foreach($this->tab_usersOnline as $clef => $userOnline){
                  // echo "{$clef} == {$id_users} ?\n ";
                   // if($clef === strval($id_users)){
                        //foreach($this->user as $user){
                            $ressourceUserReceiver = $this->tab_usersOnline[strval($id_users)];
                            if(isset($ressourceUserReceiver) && !empty($ressourceUserReceiver)){
                                $ressourceUserReceiver->send($msg);
                                echo "New message send to {$id_users} with id = {$ressourceUserReceiver->resourceId}\n";
                                $id_users = '';
                            }
                       // }
                  //  }
            }else{
                try{
                   /* if(saveMessageDB($msg)){
                        echo 'Message Save Tmp in Database\n';
                    }else{
                        echo 'Error on save\n';
                    };*/
                    $formatNotif = [
                        'idUser' => $id_users,
                        'message' => $msg
                    ];
                    array_push($this->msgMissed, json_encode($formatNotif));
                      //  setNbrMsgStore($this->nbreMsgStore++);
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
       // $_SESSION["nbrUserOnline"] = count($this->tab_usersOnline);
       // setNbrUsersOnline($this->nbrUsersOnline--);
        echo "one user log out \n";
    } 
    public function onError(ConnectionInterface $conn, Exception $e){
        
    }

    //my own function

    private function isOnline($id_users){
        //verify if the user is already online(present in the  online user tab)
        return isset($this->tab_usersOnline[strval($id_users)]) && !empty($this->tab_usersOnline[strval($id_users)]) ? true: false;   
    }

    private function getParamOfUserLogOut($conn){
                $this->currentUsers = array_search($conn, $this->tab_usersOnline);
    }

    private function addOnlineList($id_users, $conn){
        //try to add the user in the online list with her id = key and her connection stamment 
        try{
            if(!$this->isOnline($id_users)){
                $this->tab_usersOnline[strval($id_users)] = $conn;
                $this->currentUsers = strval($id_users);
                $this->checkOfNotifMissedAndSendIt($id_users, $conn);
            }

        }catch(Exception $e){
          echo $e->getMessage();
        }
        
    }

    private function isMessageValid($msgData){
        return isset($msgData) && !empty($msgData) ? true : false;
    }

    private function checkOfNotifMissedAndSendIt($idUser, $conn){
        if(count($this->msgMissed) > 0){
            foreach($this->msgMissed as $msg){
                $msgDecode = json_decode($msg);
                if($msgDecode->idUser === $idUser){
                    $conn->send($msgDecode->message);
                }
                
            }
            $this->deleteMsgOfUserAlreadySend($idUser, count($this->msgMissed));
        }     
    }

    private function deleteMsgOfUserAlreadySend($idUser, $size){
        $tmp = array();
        for($i = 0; $i < $size; $i++){
            $msgDecode = json_decode($this->msgMissed[$i]);
            if($msgDecode->idUser !== $idUser){
                 array_push($tmp, json_encode($msgDecode));
            }
        }
        $this->msgMissed = $tmp;
    }
 }
?>