<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
$res = mysqli_query($con, "DESCRIBE payment");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . " | " . $row['Type'] . "\n";
}
?>