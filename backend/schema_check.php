<?php
require_once 'config.php';
header('Content-Type: text/plain');

$tables = ['room', 'roombook', 'payment', 'room_prices', 'login', 'contact', 'gallery'];

foreach ($tables as $table) {
    echo "=== Table: $table ===\n";
    $result = mysqli_query($con, "DESCRIBE $table");
    if ($result) {
        printf("%-20s | %-20s | %-10s | %-5s\n", "Field", "Type", "Null", "Key");
        echo str_repeat("-", 60) . "\n";
        while ($row = mysqli_fetch_assoc($result)) {
            printf("%-20s | %-20s | %-10s | %-5s\n", $row['Field'], $row['Type'], $row['Null'], $row['Key']);
        }
    } else {
        echo "Error describing $table: " . mysqli_error($con) . "\n";
    }
    echo "\n";
}
?>