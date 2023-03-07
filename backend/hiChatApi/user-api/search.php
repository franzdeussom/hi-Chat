<?php
    require('../connectDB.php');
    require('../header.php');
    include_once('searchOption.php');
    include_once('simpleSearch.php');


    $getData = file_get_contents('php://input');

    if(!empty($getData) && isset($getData)){
        $data = json_decode($getData);
        http_response_code(200);

    }else{
        http_response_code(400);
        return;
    }

    if(isset($data->withOption) || !empty($data->withOption)){
        searchWithOption($data);
    }else{
        singleSearch($data);
    }
  
?>