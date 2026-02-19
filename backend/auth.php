<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';

if ($method === 'POST') {
    if ($path === '/login') {
        $data = getJsonInput();
        $email = mysqli_real_escape_string($con, $data['email']);
        $password = $data['password'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(["error" => "Invalid email format"], 400);
        }

        $sql = "SELECT * FROM login WHERE BINARY email='$email'";
        $result = mysqli_query($con, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);
            if (password_verify($password, $user['pass']) || $password === $user['pass']) {
                sendResponse([
                    "message" => "Login successful",
                    "user" => [
                        "id" => $user['id'],
                        "email" => $user['email'],
                        "phoneno" => $user['phoneno'],
                        "fullname" => $user['fullname']
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
        $email = mysqli_real_escape_string($con, $data['email']);
        $password = $data['password'];
        $phoneno = mysqli_real_escape_string($con, $data['phoneno']);
        $fullname = mysqli_real_escape_string($con, $data['fullname']);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(["error" => "Invalid email format"], 400);
        }

        if (strlen($phoneno) !== 10 || !ctype_digit($phoneno)) {
            sendResponse(["error" => "Phone number must be exactly 10 digits"], 400);
        }

        if (empty($fullname)) {
            sendResponse(["error" => "Full name is required"], 400);
        }

        // Strong password: min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
        $passwordRegex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
        if (!preg_match($passwordRegex, $password)) {
            sendResponse(["error" => "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."], 400);
        }

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Check if user already exists
        $check_sql = "SELECT * FROM login WHERE BINARY email='$email'";
        $check_result = mysqli_query($con, $check_sql);

        if (mysqli_num_rows($check_result) > 0) {
            sendResponse(["error" => "Email already registered"], 409);
        } else {
            $sql = "INSERT INTO login (email, pass, phoneno, fullname) VALUES ('$email', '$hashed_password', '$phoneno', '$fullname')";
            if (mysqli_query($con, $sql)) {
                sendResponse(["message" => "User registered successfully"]);
            } else {
                sendResponse(["error" => "Registration failed: " . mysqli_error($con)], 500);
            }
        }
    } elseif ($path === '/logout') {
        sendResponse(["message" => "Logged out successfully"]);
    } elseif ($path === '/forgot-password') {
        $data = getJsonInput();
        $email = isset($data['email']) ? mysqli_real_escape_string($con, trim($data['email'])) : '';
        $phoneno = isset($data['phoneno']) ? mysqli_real_escape_string($con, trim($data['phoneno'])) : '';

        // DEBUG: Log the verification attempt
        error_log("Forgot Password Attempt - Email: '$email', Phone: '$phoneno'");

        if (empty($email) || empty($phoneno)) {
            sendResponse(["error" => "Email and phone number are required"], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(["error" => "Invalid email format"], 400);
        }

        // Search for user with both matching
        $sql = "SELECT id FROM login WHERE BINARY email='$email' AND BINARY phoneno='$phoneno'";
        $result = mysqli_query($con, $sql);

        $num_rows = $result ? mysqli_num_rows($result) : 0;
        error_log("Forgot Password Query Result: $num_rows rows found");

        if ($result && $num_rows === 1) {
            sendResponse(["message" => "Identity verified. You can now reset your password."]);
        } else {
            error_log("Verification failed: expected 1 row, got $num_rows");
            sendResponse(["error" => "No matching account found with these details"], 401);
        }
    } elseif ($path === '/reset-password') {
        $data = getJsonInput();
        $email = isset($data['email']) ? mysqli_real_escape_string($con, trim($data['email'])) : '';
        $phoneno = isset($data['phoneno']) ? mysqli_real_escape_string($con, trim($data['phoneno'])) : '';
        $new_password = $data['password'] ?? '';

        if (empty($email) || empty($phoneno) || empty($new_password)) {
            sendResponse(["error" => "Required fields missing"], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(["error" => "Invalid email format"], 400);
        }

        // Validate new password strength
        $passwordRegex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
        if (!preg_match($passwordRegex, $new_password)) {
            sendResponse(["error" => "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."], 400);
        }

        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // Verify identity again before updating (stateless approach)
        $verify_sql = "SELECT id FROM login WHERE BINARY email='$email' AND BINARY phoneno='$phoneno'";
        $verify_result = mysqli_query($con, $verify_sql);

        if ($verify_result && mysqli_num_rows($verify_result) > 0) {
            $update_sql = "UPDATE login SET pass='$hashed_password' WHERE BINARY email='$email'";
            if (mysqli_query($con, $update_sql)) {
                sendResponse(["message" => "Password reset successfully"]);
            } else {
                sendResponse(["error" => "Failed to reset password: " . mysqli_error($con)], 500);
            }
        } else {
            sendResponse(["error" => "Identity verification failed. Please try again from the beginning."], 401);
        }
    }
}
?>