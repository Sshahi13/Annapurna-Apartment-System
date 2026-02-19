<?php
require_once 'config.php';
header('Content-Type: text/plain');

echo "=== Full Schema Definition ===\n";
$tables = ['room', 'roombook', 'payment', 'room_prices'];
foreach ($tables as $table) {
    $res = mysqli_query($con, "SHOW CREATE TABLE $table");
    if ($res) {
        $row = mysqli_fetch_array($res);
        echo "Table: $table\n" . $row[1] . "\n\n";
    } else {
        echo "Table: $table Error: " . mysqli_error($con) . "\n\n";
    }
}
?>