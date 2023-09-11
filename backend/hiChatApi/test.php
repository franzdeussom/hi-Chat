<?php
    require('./autoload.php');

    $tokeMger = TokenManager::getInstance();

    $token = $tokeMger->generateToken(1);
    echo 'token generate' . $token ;

    echo 'list of tokens ekiee' . count($tokeMger->getTokensList());

?>