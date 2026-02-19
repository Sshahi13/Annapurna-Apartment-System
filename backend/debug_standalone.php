<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}
$res = mysqli_query($con, "SHOW COLUMNS FROM roombook");
if (!$res) {
    die("Query failed: " . mysqli_error($con));
}
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . "\n";
}
?>