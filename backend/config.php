<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

$host = "localhost";
$user = "root";
$pass = "";
$db = "appartment";
$KHALTI_SECRET_KEY = '4513ed9f487d44ec91f9656e77b9d0fe';

$con = mysqli_connect($host, $user, $pass, $db);

if (mysqli_connect_errno()) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Database connection failed: " . mysqli_connect_error()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>