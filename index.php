<?php

$db = 'scores.db';

$db_connect;

function db2Arr(SQLite3Result $data){
    $arr = [];
    while($row = $data->fetchArray(SQLITE3_ASSOC)){
        $arr[] = $row;
    }
    $result_string = '';
    foreach($arr as $k => $v){
        foreach($v as $key => $value){
            if($key != 'score'){
                $result_string .= $value . ':';
            }
            else{
                $result_string .= $value . '|';
            }
        }
    }
    return $result_string;
}


if($_SERVER['REQUEST_METHOD'] === 'POST'){

        if($_POST['action'] === 'load'){

            $name = $_POST['name'];
            
            $score = $_POST['score'];

            $delete = $_POST['delete'];
            
            
            if($delete > 0){
                $db_connect = new SQLite3($db);  
                $sql =  "DELETE FROM leaders 
                WHERE id
                 = $delete";
                $db_connect->exec($sql);  
            } 
            if(is_file($db)){
                
                $db_connect = new SQLite3($db);                
                $sql = "INSERT INTO leaders (name, score)
                        VALUES ('$name', $score)";
                $db_connect->exec($sql) or $db_connect->lastErrorMsg();      
            }
            else{
                $db_connect = new SQLite3($db);
                $sql = "CREATE TABLE leaders(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    score INT
                )";
                $db_connect->exec($sql);
                $sql = "INSERT INTO leaders (name, score)
                        VALUES ('$name', $score )";
                $db_connect->exec($sql);  
            }
            $sql = "SELECT * FROM leaders";
            $result = $db_connect->query($sql);             
            $result = db2Arr($result);
            echo $result;
            exit();
        }
        else{            
            if(is_file($db)){
                $db_connect = new SQLite3($db);      
            }
            else{
                $db_connect = new SQLite3($db);
                $sql = "CREATE TABLE leaders(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    score INT
                )";
                $db_connect->exec($sql) or $db_connect->lastErrorMsg();
            }
            $sql = "SELECT * FROM leaders";
            $result = $db_connect->query($sql);             
            $result = db2Arr($result);
            echo $result;
            exit();
        }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>

<body id='body' style="display: flex;flex-direction: row; justify-content: center; align-items: center; width: 100%; height: 100%">
    <div id = 'hud'>
        <div id = 'skill-bar'>
            <div id = 'skill-bar-left'>
                <p id = 'skill-bar-left-name'></p>
                <div id = 'skill-bar-left-sign'></div> 
            </div>
            <div id = 'skill-bar-right'>
                <div id = 'skill-bar-right-sign'></div> 
                <p id = 'skill-bar-right-name'></p>                
            </div>
        </div>
        <div id = 'hp-bar'>
        </div>
        <div id = 'hud-timer'>
        </div>
    </div>
    <div id = 'info'>
        <div id = 'bh-info'>
            <p id = 'bh-power'></p>
            <p id = 'bh-radius'></p>
            <p id = 'bh-influence'></p>
        </div>
        <div id = 'game-info'>
            <p id = 'timer'></p>
            <p id = 'mass'></p>
            <p id = 'accel'></p>
            <p id = 'cd'></p>
        </div>
    </div>
    <canvas id="cnv" width="900px" height="900px" ></canvas>
    <button id="start">GO</button>
    <script type="module" src="js/main.js"></script>
</body>
</html>