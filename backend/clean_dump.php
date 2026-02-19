<?php
require_once 'config.php';

function dumpTable($con, $table)
{
    echo "=== Table: $table ===\n";
    $res = mysqli_query($con, "SELECT * FROM $table");
    while ($row = mysqli_fetch_assoc($res)) {
        foreach ($row as $k => $v) {
            echo "[$k]: $v | ";
        }
        echo "\n";
    }
    echo "-------------------\n";
}

dumpTable($con, 'roombook');
dumpTable($con, 'payment');
?>