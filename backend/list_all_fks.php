<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
echo "=== ALL DATABASE FOREIGN KEYS ===\n";
$res = mysqli_query($con, "SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'appartment' AND REFERENCED_TABLE_NAME IS NOT NULL");
while ($row = mysqli_fetch_assoc($res)) {
    echo "Table [" . $row['TABLE_NAME'] . "] Column [" . $row['COLUMN_NAME'] . "] -> " . $row['REFERENCED_TABLE_NAME'] . "(" . $row['REFERENCED_COLUMN_NAME'] . ")\n";
}
?>