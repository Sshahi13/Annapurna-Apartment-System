<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);
$res = mysqli_query($con, "SELECT * FROM payment WHERE payment LIKE '%Khalti%'");
if (mysqli_num_rows($res) == 0) {
    echo "No Khalti payments found in 'payment' table.\n";
} else {
    while ($row = mysqli_fetch_assoc($res)) {
        print_r($row);
    }
}

echo "\n--- Searching in roombook table for Khalti ---\n";
$res2 = mysqli_query($con, "SELECT * FROM roombook WHERE Payment LIKE '%Khalti%'");
if (mysqli_num_rows($res2) == 0) {
    echo "No Khalti bookings found in 'roombook' table.\n";
} else {
    while ($row = mysqli_fetch_assoc($res2)) {
        print_r($row);
    }
}
?>