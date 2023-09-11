<?php
    require('../connectDB.php');
    require('../header.php');
    require('./function/getFemalle.php');
    require('./function/getMale.php');
    require('../file.service/file.class.php');

    global $conn;

    $array = array();
    $file = new File('');

    $data = [
        'NbrUsersOnline'=>$file->getFileData(Standard::FILE_USERS_ONLINE->value, null),

        'NbrMessageStore'=> $file->getFileData(Standard::FILE_MSG_STORE->value, null),

        'NbrNotifStore'=> $file->getFileData(Standard::FILE_NOTIF_STORE->value, null)
    ];

    array_push($array, getAllMale($conn));
    array_push($array, getAllFemalle($conn));
    array_push($array, $data);
    
    echo json_encode($array);

?>