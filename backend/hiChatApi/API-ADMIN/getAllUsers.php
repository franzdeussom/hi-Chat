<?php
    require('../connectDB.php');
    require('../header.php');
    require('./function/getFemalle.php');
    require('./function/getMale.php');

    global $conn;
    $array = array();
    array_push($array, getAllMale($conn));
    array_push($array, getAllFemalle($conn));

    echo json_encode($array);

?>