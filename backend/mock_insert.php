<?php
require_once 'config.php';
header('Content-Type: text/plain');

echo "=== Table: roombook (DESCRIBE) ===\n";
$res = mysqli_query($con, "DESCRIBE roombook");
while ($row = mysqli_fetch_assoc($res)) {
    print_r($row);
}

echo "\n=== Mock INSERT attempt ===\n";
$sql = "INSERT INTO roombook (Title, FName, LName, Email, Phone, TRoom, Bed, People, Payment, Movein, Occupancy, stat) 
        VALUES ('Mr.', 'Test', 'User', 'test@example.com', '1234567890', 'Superior Room', 'Single', '1', 'Pay at the Apartment', '2026-02-17', '2026-02-18', 'Confirm')";

if (mysqli_query($con, $sql)) {
    echo "SUCCESS: Inserted mock record with ID: " . mysqli_insert_id($con) . "\n";
    // Delete it immediately
    $id = mysqli_insert_id($con);
    mysqli_query($con, "DELETE FROM roombook WHERE id=$id");
    echo "Removed mock record.\n";
} else {
    echo "FAILED: " . mysqli_error($con) . "\n";
}
?>