<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
$parts = explode('/', trim($path, '/'));

if ($method === 'GET') {
    $today = date('Y-m-d');
    $expire_sql = "SELECT id FROM roombook WHERE Occupancy < '$today' AND stat = 'Confirm'";
    $expire_result = mysqli_query($con, $expire_sql);

    while ($row = mysqli_fetch_assoc($expire_result)) {
        $expired_id = $row['id'];
        // Free the room
        $free_sql = "UPDATE room SET place = 'Free', cusid = 0 WHERE cusid = $expired_id";
        mysqli_query($con, $free_sql);
    }

    if ($path === '/availability') {
        $checkin = isset($_GET['checkin']) ? mysqli_real_escape_string($con, $_GET['checkin']) : null;
        $checkout = isset($_GET['checkout']) ? mysqli_real_escape_string($con, $_GET['checkout']) : null;

        $availability = [];

        if ($checkin && $checkout) {
            $room_counts_sql = "SELECT type, bedding, COUNT(*) as count FROM room GROUP BY type, bedding";
            $room_counts_res = mysqli_query($con, $room_counts_sql);
            $total_rooms = [];
            while ($row = mysqli_fetch_assoc($room_counts_res)) {
                $key = $row['type'] . '|' . $row['bedding'];
                $total_rooms[$key] = (int) $row['count'];
            }

            $booking_sql = "SELECT TRoom, Bed, COUNT(*) as count FROM roombook 
                            WHERE (Movein < '$checkout' AND Occupancy > '$checkin') 
                            AND stat != 'Cancelled'
                            GROUP BY TRoom, Bed";
            $booking_res = mysqli_query($con, $booking_sql);
            $booked_rooms = [];
            while ($row = mysqli_fetch_assoc($booking_res)) {
                $key = $row['TRoom'] . '|' . $row['Bed'];
                $booked_rooms[$key] = (int) $row['count'];
            }

            $sql = "SELECT room_no, type, bedding FROM room";
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $key = $row['type'] . '|' . $row['bedding'];
                $total = isset($total_rooms[$key]) ? $total_rooms[$key] : 0;
                $booked = isset($booked_rooms[$key]) ? $booked_rooms[$key] : 0;

                if ($booked >= $total) {
                    $availability[$row['room_no']] = 'Not Available';
                } else {
                    $availability[$row['room_no']] = 'Available';
                }
            }
        } else {
            $sql = "SELECT room_no, place FROM room";
            $result = mysqli_query($con, $sql);
            while ($row = mysqli_fetch_assoc($result)) {
                $availability[$row['room_no']] = ($row['place'] === 'Free' ? 'Available' : 'Not Available');
            }
        }
        sendResponse($availability);
    } elseif (isset($parts[0]) && !empty($parts[0]) && !is_numeric($parts[0])) {
        // Fetch by room_no (e.g., /rooms/D1)
        $room_no = mysqli_real_escape_string($con, $parts[0]);
        $sql = "SELECT * FROM room WHERE room_no = '$room_no'";
        $result = mysqli_query($con, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            sendResponse($row);
        } else {
            sendResponse(["error" => "Room not found"], 404);
        }
    } else {
        $sql = "SELECT * FROM room";
        $result = mysqli_query($con, $sql);
        $rooms = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $rooms[] = $row;
        }
        sendResponse($rooms);
    }
} elseif ($method === 'POST') {
    if ($path === '/reset') {
        $sql = "UPDATE room SET place = 'Free', cusid = 0";
        if (mysqli_query($con, $sql)) {
            sendResponse(["message" => "All rooms reset to Free"]);
        } else {
            sendResponse(["error" => mysqli_error($con)], 500);
        }
        exit;
    }
    $data = getJsonInput();
    $type = mysqli_real_escape_string($con, $data['troom']);
    $bedding = mysqli_real_escape_string($con, $data['bed']);
    $place = 'Free';

    // Generate a room_no if not provided
    $room_no = isset($data['room_no']) ? mysqli_real_escape_string($con, $data['room_no']) : substr($type, 0, 1) . rand(10, 99);

    $sql = "INSERT INTO room (room_no, type, bedding, place) VALUES ('$room_no', '$type', '$bedding', '$place')";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Room created successfully", "id" => mysqli_insert_id($con)]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
} elseif ($method === 'PUT') {
    $id = end($parts);
    if (!is_numeric($id)) {
        sendResponse(["error" => "Invalid room ID"], 400);
    }

    $data = getJsonInput();
    $updates = [];
    if (isset($data['troom'])) {
        $type = mysqli_real_escape_string($con, $data['troom']);
        $updates[] = "type='$type'";
    }
    if (isset($data['bed'])) {
        $bedding = mysqli_real_escape_string($con, $data['bed']);
        $updates[] = "bedding='$bedding'";
    }
    if (isset($data['place'])) {
        $place = mysqli_real_escape_string($con, $data['place']);
        $updates[] = "place='$place'";
    }
    if (isset($data['cusid'])) {
        $cusid = mysqli_real_escape_string($con, $data['cusid']);
        $updates[] = "cusid='$cusid'";
    }

    if (empty($updates)) {
        sendResponse(["error" => "No fields to update"], 400);
    }

    $sql = "UPDATE room SET " . implode(', ', $updates) . " WHERE id=$id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Room updated successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
} elseif ($method === 'DELETE') {
    $id = end($parts);

    if (is_numeric($id)) {
        $sql = "DELETE FROM room WHERE id=$id";
    } else {
        $room_no = mysqli_real_escape_string($con, $id);
        $sql = "DELETE FROM room WHERE room_no='$room_no'";
    }

    if (mysqli_query($con, $sql)) {
        if (mysqli_affected_rows($con) > 0) {
            sendResponse(["message" => "Room deleted successfully"]);
        } else {
            sendResponse(["error" => "Room not found"], 404);
        }
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
}
?>