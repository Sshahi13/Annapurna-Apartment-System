<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $troom = isset($_GET['troom']) ? trim(mysqli_real_escape_string($con, $_GET['troom'])) : null;
    $tbed = isset($_GET['tbed']) ? trim(mysqli_real_escape_string($con, $_GET['tbed'])) : null;

    if ($troom && $tbed) {
        // Use case-insensitive search and trim to be robust
        $sql = "SELECT * FROM room_prices WHERE LOWER(troom)=LOWER('$troom') AND LOWER(tbed)=LOWER('$tbed')";
        $result = mysqli_query($con, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            sendResponse($row);
        } else {
            sendResponse(["room_price" => 0, "bed_price" => 0]);
        }
    } else {
        $sql = "SELECT * FROM room_prices ORDER BY troom, tbed";
        $result = mysqli_query($con, $sql);
        $prices = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $prices[] = $row;
        }
        sendResponse($prices);
    }
} elseif ($method === 'PUT') {
    $data = getJsonInput();
    $id = mysqli_real_escape_string($con, $data['id']);
    $room_price = mysqli_real_escape_string($con, $data['room_price']);
    $bed_price = mysqli_real_escape_string($con, $data['bed_price']);

    $sql = "UPDATE room_prices SET room_price='$room_price', bed_price='$bed_price' WHERE id=$id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Price updated successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
}
?>