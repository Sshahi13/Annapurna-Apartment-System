<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
$res = mysqli_query($con, "SELECT * FROM payment ORDER BY `p-id` DESC LIMIT 10");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}
?>