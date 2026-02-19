<?php
require_once 'config.php';

echo "--- CLEAN SLATE INITIATED ---\n";

// Clear reservations and payments
mysqli_query($con, "TRUNCATE TABLE roombook");
echo "roombook table cleared.\n";

mysqli_query($con, "TRUNCATE TABLE payment");
echo "payment table cleared.\n";

// Reset room statuses
mysqli_query($con, "UPDATE room SET place = 'Free', cusid = 0");
echo "All rooms reset to 'Free'.\n";

echo "--- SYSTEM IS NOW FRESH AND READY ---\n";
?>