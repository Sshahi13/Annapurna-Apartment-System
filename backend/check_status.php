<?php
require_once 'config.php';

function countAndList($con, $table, $idCol)
{
    echo "--- Table: $table ---\n";
    $res = mysqli_query($con, "SELECT COUNT(*) as cnt FROM $table");
    $row = mysqli_fetch_assoc($res);
    echo "Total Rows: " . $row['cnt'] . "\n";

    $res = mysqli_query($con, "SELECT $idCol, FName, LName FROM $table");
    while ($row = mysqli_fetch_assoc($res)) {
        echo "ID: " . $row[$idCol] . " | " . $row['FName'] . " " . $row['LName'] . "\n";
    }
    echo "\n";
}

countAndList($con, 'roombook', 'id');
// payment doesn't have FName/LName in all versions maybe? Let's check
$res = mysqli_query($con, "SELECT COUNT(*) as cnt FROM payment");
$row = mysqli_fetch_assoc($res);
echo "--- Table: payment ---\nTotal Rows: " . $row['cnt'] . "\n";
?>