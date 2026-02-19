<?php
require_once 'config.php';
$tables = ['room', 'roombook', 'payment'];
foreach ($tables as $table) {
    echo "--- Table: $table ---\n";
    $res = mysqli_query($con, "SHOW CREATE TABLE $table");
    if ($res) {
        $row = mysqli_fetch_array($res);
        echo $row[1] . "\n\n";
    } else {
        echo "Error: " . mysqli_error($con) . "\n\n";
    }
}
?>