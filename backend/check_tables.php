<?php
require_once 'config.php';

function describeTable($con, $tableName)
{
    echo "--- Table: $tableName ---\n";
    $res = mysqli_query($con, "DESCRIBE $tableName");
    if (!$res) {
        echo "Error describing $tableName: " . mysqli_error($con) . "\n";
        return;
    }
    while ($row = mysqli_fetch_assoc($res)) {
        printf(
            "%-15s | %-15s | %-10s | %-5s | %-10s | %s\n",
            $row['Field'],
            $row['Type'],
            $row['Null'],
            $row['Key'],
            $row['Default'],
            $row['Extra']
        );
    }
    echo "\n";
}

describeTable($con, 'roombook');
describeTable($con, 'payment');
?>