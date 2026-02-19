<?php
require_once 'config.php';
$res = mysqli_query($con, "SHOW COLUMNS FROM roombook WHERE Field = 'id'");
$row = mysqli_fetch_assoc($res);
echo "Column: " . $row['Field'] . " | Extra: [" . $row['Extra'] . "]\n";
if (empty($row['Extra'])) {
    echo "CRITICAL: id column is NOT auto-incrementing!\n";
} else {
    echo "id column is: " . $row['Extra'] . "\n";
}
?>