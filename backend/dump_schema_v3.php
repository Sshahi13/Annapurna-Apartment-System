<?php
require_once 'config.php';

$res = mysqli_query($con, "SHOW CREATE TABLE roombook");
$row = mysqli_fetch_row($res);
echo "--- roombook ---\n" . $row[1] . "\n\n";

$res = mysqli_query($con, "SHOW CREATE TABLE payment");
$row = mysqli_fetch_row($res);
echo "--- payment ---\n" . $row[1] . "\n\n";
?>