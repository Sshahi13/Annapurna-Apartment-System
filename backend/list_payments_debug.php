<?php
require_once 'config.php';
echo "--- Table: payment ---\n";
$res = mysqli_query($con, "SELECT `p-id`, id, fname, lname, payment FROM payment");
while ($row = mysqli_fetch_assoc($res)) {
    echo "P-ID: " . $row['p-id'] . " | ResID: " . $row['id'] . " | Name: " . $row['fname'] . " " . $row['lname'] . " | Method: " . $row['payment'] . "\n";
}
?>