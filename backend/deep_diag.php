<?php
require_once 'config.php';

echo "=== SEARCHING FOR AMOUNT 4800 ===\n";
$res = mysqli_query($con, "SELECT * FROM payment WHERE fintot = 4800 OR room = 4800 OR bed = 4800");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}

echo "\n=== SEARCHING ROOMBOOK FOR KHALTI ===\n";
$res = mysqli_query($con, "SELECT * FROM roombook WHERE Payment = 'Pay Via Khalti'");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}

echo "\n=== FULL SCHEMA DUMP ===\n";
$tables = ['roombook', 'payment', 'room'];
foreach ($tables as $t) {
    $res = mysqli_query($con, "SHOW CREATE TABLE $t");
    $row = mysqli_fetch_row($res);
    echo "Table $t:\n" . $row[1] . "\n\n";
}
?>