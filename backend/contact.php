<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM contact ORDER BY id DESC";
    $result = mysqli_query($con, $sql);
    $contacts = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $contacts[] = $row;
    }
    sendResponse($contacts);
} elseif ($method === 'POST') {
    $data = getJsonInput();
    $fullname = mysqli_real_escape_string($con, $data['fullname']);
    $phoneno = mysqli_real_escape_string($con, $data['phoneno']);
    $email = mysqli_real_escape_string($con, $data['email']);
    $cdate = date('Y-m-d');
    $approval = 'Not Allowed';

    $sql = "INSERT INTO contact (fullname, phoneno, email, cdate, approval) 
            VALUES ('$fullname', '$phoneno', '$email', '$cdate', '$approval')";

    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Contact inquiry sent successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
} elseif ($method === 'DELETE') {
    $path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $parts = explode('/', trim($path, '/'));
    $id = end($parts);

    if (!is_numeric($id)) {
        sendResponse(["error" => "Invalid message ID"], 400);
    }

    $sql = "DELETE FROM contact WHERE id = $id";
    if (mysqli_query($con, $sql)) {
        sendResponse(["message" => "Message deleted successfully"]);
    } else {
        sendResponse(["error" => mysqli_error($con)], 500);
    }
}
?>