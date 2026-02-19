<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$config_path = __DIR__ . '/config.php';
if (!file_exists($config_path)) {
    die("Config file not found at $config_path\n");
}
require_once $config_path;

if (!isset($con)) {
    die("\$con variable not defined in config.php\n");
}

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