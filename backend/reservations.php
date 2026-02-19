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
        $raw_input = file_get_contents('php://input');
        file_put_contents('reservations_debug.log', "POST Received: " . $raw_input . "\n", FILE_APPEND);
        $data = json_decode($raw_input, true);
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
        $stat = isset($data['stat']) ? mysqli_real_escape_string($con, $data['stat']) : 'Confirm';

        $sql = "INSERT INTO roombook (Title, FName, LName, Email, Phone, TRoom, Bed, People, Payment, Movein, Occupancy, stat) 
                VALUES ('$title', '$fname', '$lname', '$email', '$phone', '$troom', '$bed', '$people', '$payment', '$movein', " . ($occupancy ? "'$occupancy'" : "NULL") . ", '$stat')";

        if (mysqli_query($con, $sql)) {
            $new_reservation_id = mysqli_insert_id($con);

            // Update room status
            $room_update_success = false;
            if (isset($data['room_no']) && !empty($data['room_no'])) {
                $room_no = mysqli_real_escape_string($con, $data['room_no']);
                $room_sql = "UPDATE room SET place = 'NotFree', cusid = '$new_reservation_id' WHERE room_no = '$room_no' AND place = 'Free'";
                if (mysqli_query($con, $room_sql) && mysqli_affected_rows($con) > 0) {
                    $room_update_success = true;
                }
            }

            if (!$room_update_success) {
                // Fallback: Assign any free room of that type
                $update_room_sql = "UPDATE room SET place = 'NotFree', cusid = '$new_reservation_id' WHERE type = '$troom' AND bedding = '$bed' AND place = 'Free' LIMIT 1";
                mysqli_query($con, $update_room_sql);
            }

            // Auto-create payment record
            $room_price = isset($data['roomPrice']) ? $data['roomPrice'] : 0;
            $bed_price = isset($data['bedPrice']) ? $data['bedPrice'] : 0;
            $fintot = isset($data['totalPrice']) ? $data['totalPrice'] : 0;
            $noofdays = isset($data['days']) ? $data['days'] : 0;
            $payment_method = isset($data['payment']) ? mysqli_real_escape_string($con, $data['payment']) : 'Unknown';

            $payment_sql = "INSERT INTO payment (id, title, fname, lname, troom, tbed, people, min, room, bed, fintot, payment, noofdays) 
                            VALUES ('$new_reservation_id', '$title', '$fname', '$lname', '$troom', '$bed', '$people', '$movein', '$room_price', '$bed_price', '$fintot', '$payment_method', '$noofdays')";

            if (!mysqli_query($con, $payment_sql)) {
                file_put_contents('db_error.log', "Payment Insert Error: " . mysqli_error($con) . " | SQL: $payment_sql\n", FILE_APPEND);
            }

            sendResponse(["message" => "Reservation created and confirmed successfully", "id" => $new_reservation_id]);
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