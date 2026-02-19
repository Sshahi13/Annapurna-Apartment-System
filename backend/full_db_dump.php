<?php
require_once 'config.php';

echo "=== ROOMBOOK RECORDS ===\n";
$res = mysqli_query($con, "SELECT * FROM roombook");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}

echo "\n=== PAYMENT RECORDS ===\n";
$res = mysqli_query($con, "SELECT * FROM payment");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}
?>