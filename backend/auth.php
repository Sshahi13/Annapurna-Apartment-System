<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';

if ($method === 'POST') {
    if ($path === '/login') {
        $data = getJsonInput();
        $username = mysqli_real_escape_string($con, $data['username']);
        $password = $data['password'];

        $sql = "SELECT * FROM login WHERE BINARY usname='$username'";
        $result = mysqli_query($con, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);
            // Allow both hashed and plain text (for existing users)
            if (password_verify($password, $user['pass']) || $password === $user['pass']) {
                sendResponse([
                    "message" => "Login successful",
                    "user" => [
                        "id" => $user['id'],
                        "username" => $user['usname']
                    ],
                    "token" => "mock-jwt-token"
                ]);
            } else {
                sendResponse(["error" => "Invalid credentials"], 401);
            }
        } else {
            sendResponse(["error" => "Invalid credentials"], 401);
        }
    } elseif ($path === '/register') {
        $data = getJsonInput();
        $username = mysqli_real_escape_string($con, $data['username']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        // Check if user already exists
        $check_sql = "SELECT * FROM login WHERE BINARY usname='$username'";
        $check_result = mysqli_query($con, $check_sql);

        if (mysqli_num_rows($check_result) > 0) {
            sendResponse(["error" => "Username already exists"], 409);
        } else {
            $sql = "INSERT INTO login (usname, pass) VALUES ('$username', '$password')";
            if (mysqli_query($con, $sql)) {
                sendResponse(["message" => "User registered successfully"]);
            } else {
                sendResponse(["error" => "Registration failed: " . mysqli_error($con)], 500);
            }
        }
    } elseif ($path === '/logout') {
        sendResponse(["message" => "Logged out successfully"]);
    }
}
?>