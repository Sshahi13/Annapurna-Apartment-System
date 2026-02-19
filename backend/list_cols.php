<?php
$_SERVER['REQUEST_METHOD'] = 'GET'; // Fix for config.php
require_once 'config.php';
$res = mysqli_query($con, "SHOW COLUMNS FROM roombook");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . "\n";
}
?>