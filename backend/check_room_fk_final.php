<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
echo "=== ROOM COLUMNS ===\n";
$res = mysqli_query($con, "DESCRIBE room");
while ($row = mysqli_fetch_assoc($res)) {
    echo $row['Field'] . " | " . $row['Type'] . " | Null: " . $row['Null'] . " | Key: " . $row['Key'] . " | Default: " . $row['Default'] . "\n";
}
echo "\n=== FOREIGN KEYS ===\n";
$res = mysqli_query($con, "SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'room' AND TABLE_SCHEMA = 'appartment' AND REFERENCED_TABLE_NAME IS NOT NULL");
while ($row = mysqli_fetch_assoc($res)) {
    echo "Column: " . $row['COLUMN_NAME'] . " references " . $row['REFERENCED_TABLE_NAME'] . "(" . $row['REFERENCED_COLUMN_NAME'] . ")\n";
}
?>