<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
$res = mysqli_query($con, "SHOW COLUMNS FROM room");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . " | " . $row['Type'] . " | " . $row['Null'] . " | " . $row['Key'] . "\n";
}
echo "\n--- Constraints ---\n";
$res = mysqli_query($con, "SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'room' AND TABLE_SCHEMA = 'appartment' AND REFERENCED_TABLE_NAME IS NOT NULL");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}
?>