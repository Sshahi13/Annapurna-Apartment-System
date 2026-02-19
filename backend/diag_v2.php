<?php
require_once 'config.php';
$tables = ['room', 'roombook', 'payment', 'room_prices'];
echo "--- COUNTS ---\n";
foreach ($tables as $t) {
    $res = mysqli_query($con, "SELECT COUNT(*) FROM $t");
    if ($res) {
        $row = mysqli_fetch_row($res);
        echo "$t: " . $row[0] . "\n";
    } else {
        echo "$t: Error " . mysqli_error($con) . "\n";
    }
}
echo "\n--- SCHEMA ---\n";
foreach ($tables as $t) {
    $res = mysqli_query($con, "SHOW CREATE TABLE $t");
    if ($res) {
        $row = mysqli_fetch_row($res);
        echo "Table $t:\n" . $row[1] . "\n\n";
    }
}
?>