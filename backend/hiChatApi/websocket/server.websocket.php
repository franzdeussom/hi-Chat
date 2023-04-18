<?php 
   use Ratchet\Server\IoServer;
   use Ratchet\Http\HttpServer;
   use Ratchet\WebSocket\WsServer;
   require('../header.php');
   require 'Chat.php';
   require 'vendor/autoload.php';
   
    global $Chat;

   $server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
     8084
    );
 $server->run();
?>