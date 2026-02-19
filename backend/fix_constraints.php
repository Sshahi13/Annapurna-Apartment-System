<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);

echo "Checking room table constraints...\n";
$res = mysqli_query($con, "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'room' AND TABLE_SCHEMA = 'appartment' AND REFERENCED_TABLE_NAME IS NOT NULL");
$constraints = [];
while ($row = mysqli_fetch_assoc($res)) {
    $constraints[] = $row['CONSTRAINT_NAME'];
}

foreach ($constraints as $c) {
    echo "Dropping constraint: $c\n";
    mysqli_query($con, "ALTER TABLE room DROP FOREIGN KEY $c");
}

echo "Updating room table: allowing cusid to be NULL and removing default 0 (which breaks FKs if not found).\n";
// 1. Ensure cusid allows NULL
mysqli_query($con, "ALTER TABLE room MODIFY cusid INT(11) DEFAULT NULL");
// 2. Clear out any invalid 0s
mysqli_query($con, "UPDATE room SET cusid = NULL WHERE cusid = 0");

echo "Schema maintenance complete.\n";
?>