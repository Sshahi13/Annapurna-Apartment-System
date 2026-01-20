<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $parts = explode('/', trim($path, '/'));
    $id = isset($parts[0]) && is_numeric($parts[0]) ? $parts[0] : null;

    if ($id) {
        $sql = "SELECT * FROM payment WHERE `p-id` = $id";
        $result = mysqli_query($con, $sql);
        $payment = mysqli_fetch_assoc($result);
        if ($payment) {
            sendResponse($payment);
        } else {
            sendResponse(["error" => "Payment not found"], 404);
        }
    } else {
        $sql = "SELECT * FROM payment ORDER BY `p-id` DESC";
        $result = mysqli_query($con, $sql);
        $payments = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $payments[] = $row;
        }
        sendResponse($payments);
    }
} elseif ($method === 'POST') {
    $data = getJsonInput();
    $id = mysqli_real_escape_string($con, $data['id']);
    $title = mysqli_real_escape_string($con, $data['title']);
    $fname = mysqli_real_escape_string($con, $data['fname']);
    $lname = mysqli_real_escape_string($con, $data['lname']);
    $troom = mysqli_real_escape_string($con, $data['troom']);
    $tbed = mysqli_real_escape_string($con, $data['tbed']);
    $people = mysqli_real_escape_string($con, $data['people']);
    $min = mysqli_real_escape_string($con, $data['min']);
    $room = mysqli_real_escape_string($con, $data['room']);
    $bed = mysqli_real_escape_string($con, $data['bed']);
    $fintot = mysqli_real_escape_string($con, $data['fintot']);
    $payment = mysqli_real_escape_string($con, $data['payment']);
    $noofdays = isset($data['noofdays']) ? mysqli_real_escape_string($con, $data['noofdays']) : 0;

    $sql = "INSERT INTO payment (id, title, fname, lname, troom, tbed, people, min, room, bed, fintot, payment, noofdays) 
            VALUES ('$id', '$title', '$fname', '$lname', '$troom', '$tbed', '$people', '$min', '$room', '$bed', '$fintot', '$payment', '$noofdays')";

    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Payment record created successfully", "id" => mysqli_insert_id($con)]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
} elseif ($method === 'DELETE') {
    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $parts = explode('/', trim($path, '/'));
    $id = end($parts);
    if (!is_numeric($id)) {
        sendResponse(["error" => "Invalid payment ID"], 400);
    }

    $sql = "DELETE FROM payment WHERE `p-id` = $id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Payment record deleted successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
}
?>