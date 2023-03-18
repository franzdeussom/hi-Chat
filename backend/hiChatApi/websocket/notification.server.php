<?php
    use Ratchet\Server\IoServer;
    use Ratchet\Http\HttpServer;
    use Ratchet\WebSocket\WsServer;
    require('../header.php');
    require 'Notification.php';
    require 'vendor/autoload.php';

    global $Notification;

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Notification()
            )
            ), 
        8085   
    );
    
    $server->run();
?>