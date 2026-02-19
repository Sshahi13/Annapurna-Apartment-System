<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$con = mysqli_connect($host, $user, $pass, $db);

echo "--- SCANNING FOR ALL RELATIONS (FOREIGN KEYS) ---\n";
$res = mysqli_query($con, "SELECT TABLE_NAME, CONSTRAINT_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = '$db' AND REFERENCED_TABLE_NAME IS NOT NULL");

$found = false;
while ($row = mysqli_fetch_assoc($res)) {
    $found = true;
    $table = $row['TABLE_NAME'];
    $constraint = $row['CONSTRAINT_NAME'];
    echo "Removing relation: $constraint from table $table...\n";
    $drop_sql = "ALTER TABLE $table DROP FOREIGN KEY $constraint";
    if (mysqli_query($con, $drop_sql)) {
        echo "Successfully removed.\n";
    } else {
        echo "Failed to remove: " . mysqli_error($con) . "\n";
    }
}

if (!$found) {
    echo "No more relations found. The database is already clean!\n";
}

echo "\nDatabase is now completely 'Relation-Free' (Loose mode enabled).\n";
?>