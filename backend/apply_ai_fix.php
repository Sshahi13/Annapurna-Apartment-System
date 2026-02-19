<?php
require_once 'config.php';

echo "--- ATTEMPTING TO FIX SCHEMA ---\n";

// 1. First, let's remove any records with ID 0 or duplicates that might block the AUTO_INCREMENT
// Actually, it's safer to just empty it if it only has test data, or re-index.
// Let's try to just modify the column first.

$sql = "ALTER TABLE roombook MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT";
if (mysqli_query($con, $sql)) {
    echo "SUCCESS: roombook.id is now AUTO_INCREMENT.\n";
} else {
    echo "ERROR: Could not modify roombook: " . mysqli_error($con) . "\n";
    echo "Attempting recovery: Cleaning records and trying again...\n";
    mysqli_query($con, "DELETE FROM roombook WHERE id = 0");
    if (mysqli_query($con, $sql)) {
        echo "SUCCESS: roombook.id is now AUTO_INCREMENT after cleaning.\n";
    } else {
        echo "FINAL ERROR: " . mysqli_error($con) . "\n";
    }
}

// 2. Do the same for payment (p-id) just in case
$sql2 = "ALTER TABLE payment MODIFY COLUMN `p-id` int(11) NOT NULL AUTO_INCREMENT";
if (mysqli_query($con, $sql2)) {
    echo "SUCCESS: payment.p-id is now AUTO_INCREMENT.\n";
} else {
    echo "NOTE: payment.p-id already had it or failed: " . mysqli_error($con) . "\n";
}

echo "\n--- VERIFICATION ---\n";
$res = mysqli_query($con, "SHOW COLUMNS FROM roombook WHERE Field = 'id'");
$row = mysqli_fetch_assoc($res);
echo "roombook.id Extra: " . $row['Extra'] . "\n";
?>