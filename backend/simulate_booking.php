<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['PATH_INFO'] = '/';
require_once 'config.php';

// Mock JSON input function for this simulation
function getJsonInput()
{
    return [
        'title' => 'Mr.',
        'fname' => 'Simulated',
        'lname' => 'Guest',
        'email' => 'sim@example.com',
        'phone' => '9812345678',
        'troom' => 'Deluxe Room',
        'bed' => 'Single',
        'people' => '1',
        'payment' => 'Pay at the Apartment',
        'movein' => '2026-03-01',
        'occupancy' => '2026-03-05',
        'days' => 4,
        'roomPrice' => 110000,
        'bedPrice' => 0,
        'totalPrice' => 440000,
        'stat' => 'Confirm',
        'room_no' => 'D1' // Assuming D1 exists as a Deluxe/Single room
    ];
}

// Redirect require 'reservations.php' logic here
ob_start();
require 'reservations.php';
$output = ob_get_clean();

echo "=== Simulation Result ===\n";
echo "Output: $output\n";

// Verify room status
$room_res = mysqli_query($con, "SELECT * FROM room WHERE room_no = 'D1'");
$room = mysqli_fetch_assoc($room_res);
echo "Room D1 Status: " . ($room['place'] ?? 'Not found') . "\n";
echo "Room D1 CusID: " . ($room['cusid'] ?? 'N/A') . "\n";

// Verify reservation exists
$book_res = mysqli_query($con, "SELECT * FROM roombook ORDER BY id DESC LIMIT 1");
$book = mysqli_fetch_assoc($book_res);
echo "Last Reservation ID: " . ($book['id'] ?? 'None') . "\n";
echo "Last Reservation Status: " . ($book['stat'] ?? 'N/A') . "\n";

echo "\nSimulation Complete.\n";
?>