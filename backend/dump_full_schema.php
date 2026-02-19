<?php
require_once 'config.php';
$tables = ['payment', 'roombook'];
foreach ($tables as $t) {
    echo "--- Table: $t ---\n";
    $res = mysqli_query($con, "SHOW CREATE TABLE $t");
    if ($res) {
        $row = mysqli_fetch_row($res);
        echo $row[1] . "\n\n";
    } else {
        echo "Error: " . mysqli_error($con) . "\n";
    }
}
?>