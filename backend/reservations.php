<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
$parts = explode('/', trim($path, '/'));

if ($method === 'GET') {
    $id = isset($parts[0]) && is_numeric($parts[0]) ? $parts[0] : null;

    if ($id) {
        $sql = "SELECT * FROM roombook WHERE id = $id";
        $result = mysqli_query($con, $sql);
        $reservation = mysqli_fetch_assoc($result);
        if ($reservation) {
            sendResponse($reservation);
        } else {
            sendResponse(["error" => "Reservation not found"], 404);
        }
    } else {
        $sql = "SELECT * FROM roombook ORDER BY id DESC";
        $result = mysqli_query($con, $sql);
        $reservations = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $reservations[] = $row;
        }
        sendResponse($reservations);
    }
} elseif ($method === 'POST') {
    $id = isset($parts[0]) && is_numeric($parts[0]) ? $parts[0] : null;
    $action = isset($parts[1]) ? $parts[1] : null;

    if ($id && $action === 'confirm') {
        $sql = "UPDATE roombook SET stat='Confirm' WHERE id=$id";
        if (mysqli_query($con, $sql)) {
            sendResponse(["message" => "Reservation confirmed"]);
        } else {
            sendResponse(["error" => mysqli_error($con)], 500);
        }
    } else {
        $data = getJsonInput();
        $title = mysqli_real_escape_string($con, $data['title']);
        $fname = mysqli_real_escape_string($con, $data['fname']);
        $lname = mysqli_real_escape_string($con, $data['lname']);
        $email = mysqli_real_escape_string($con, $data['email']);
        $phone = mysqli_real_escape_string($con, $data['phone']);
        $troom = mysqli_real_escape_string($con, $data['troom']);
        $bed = mysqli_real_escape_string($con, $data['bed']);
        $people = mysqli_real_escape_string($con, $data['people']);
        $payment = mysqli_real_escape_string($con, $data['payment']);
        $movein = mysqli_real_escape_string($con, $data['movein']);
        $occupancy = isset($data['occupancy']) ? mysqli_real_escape_string($con, $data['occupancy']) : null;
        $stat = isset($data['stat']) ? mysqli_real_escape_string($con, $data['stat']) : 'Not Confirm';

        $sql = "INSERT INTO roombook (Title, FName, LName, Email, Phone, TRoom, Bed, People, Payment, Movein, Occupancy, stat) 
                VALUES ('$title', '$fname', '$lname', '$email', '$phone', '$troom', '$bed', '$people', '$payment', '$movein', " . ($occupancy ? "'$occupancy'" : "NULL") . ", '$stat')";

        if (mysqli_query($con, $sql)) {
            $new_reservation_id = mysqli_insert_id($con);

            $update_room_sql = "UPDATE room SET place = 'NotFree', cusid = '$new_reservation_id' WHERE type = '$troom' AND bedding = '$bed' AND place = 'Free' LIMIT 1";
            mysqli_query($con, $update_room_sql);

            sendResponse(["message" => "Reservation created successfully", "id" => $new_reservation_id]);
        } else {
            sendResponse(["error" => mysqli_error($con)], 500);
        }
    }
} elseif ($method === 'PUT') {
    $id = end($parts);
    if (!is_numeric($id)) {
        sendResponse(["error" => "Invalid reservation ID"], 400);
    }

    $data = getJsonInput();
    $updates = [];
    if (isset($data['Occupancy'])) {
        $occupancy = mysqli_real_escape_string($con, $data['Occupancy']);
        $updates[] = "Occupancy='$occupancy'";
    }
    if (isset($data['stat'])) {
        $stat = mysqli_real_escape_string($con, $data['stat']);
        $updates[] = "stat='$stat'";
    }

    if (empty($updates)) {
        sendResponse(["error" => "No fields to update"], 400);
    }

    $sql = "UPDATE roombook SET " . implode(', ', $updates) . " WHERE id=$id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Reservation updated successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
} elseif ($method === 'DELETE') {
    $id = end($parts);
    if (!is_numeric($id)) {
        sendResponse(["error" => "Invalid reservation ID"], 400);
    }

    $free_room_sql = "UPDATE room SET place = 'Free', cusid = 0 WHERE cusid = $id";
    mysqli_query($con, $free_room_sql);

    $sql = "DELETE FROM roombook WHERE id=$id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Reservation deleted successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
}
?>