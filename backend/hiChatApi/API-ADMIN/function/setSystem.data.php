<?php
      $nbrUsersOnline;
      $nbrMsgStore;
      $nbrNotifStore;


        function setNbrUsersOnline( $nbrUsers){
            global $nbrUsersOnline;
            
            echo "User Syst {$nbrUsers} ";
            $nbrUsersOnline = $nbrUsers;
        }

        function setNbrMsgStore($nbrMsg){
            global $nbrMsgStore;
            echo "User Syst {$nbrMsg} ";

            $nbrMsgStore = $nbrMsg;
        }

        function setNbrNotif($nbrNotif){
            global $nbrNotifStore;

            $nbrNotifStore  = $nbrNotif;
        }

        function getNbrNotif(){
            global $nbrNotifStore;

            return $nbrNotifStore;
        } 

        function getNbrUserOnlineStore(){
            global $nbrUsersOnline;
            
            return $nbrUsersOnline;
        }

        function getMsgStore(){
            global $nbrMsgStore;

            return $nbrMsgStore;
        }
?>