<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);

echo "=== ROOMBOOK SAMPLES ===\n";
$res = mysqli_query($con, "SELECT * FROM roombook ORDER BY id DESC LIMIT 5");
while ($row = mysqli_fetch_assoc($res)) {
    echo "ID: " . $row['id'] . " | Guest: " . $row['FName'] . " " . $row['LName'] . " | Status: " . $row['stat'] . "\n";
}

echo "\n=== ROOM SAMPLES ===\n";
$res = mysqli_query($con, "SELECT * FROM room WHERE place != 'Free' LIMIT 5");
while ($row = mysqli_fetch_assoc($res)) {
    echo "No: " . $row['room_no'] . " | Place: " . $row['place'] . " | CusID: " . $row['cusid'] . "\n";
}

$count = mysqli_fetch_row(mysqli_query($con, "SELECT COUNT(*) FROM roombook"))[0];
echo "\nTotal Reservations: $count\n";

if ($count > 0) {
    echo "SUCCESS: Data is now being saved!\n";
} else {
    echo "NOTICE: Database is still empty. Ready for first booking.\n";
}
?>