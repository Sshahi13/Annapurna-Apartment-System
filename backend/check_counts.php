<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
$tables = ['room', 'roombook', 'payment'];
foreach ($tables as $t) {
    $res = mysqli_query($con, "SELECT COUNT(*) FROM $t");
    $row = mysqli_fetch_row($res);
    echo "$t: " . $row[0] . "\n";
}
?>