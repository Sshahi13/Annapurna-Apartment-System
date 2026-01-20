<?php
require_once 'db_api.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';

// Define upload directory
$uploadDir = '../public/images/';

if ($method === 'GET') {
    $sql = "SELECT * FROM gallery ORDER BY id DESC";
    $result = mysqli_query($con, $sql);
    $images = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $images[] = $row;
    }
    sendResponse($images);
} elseif ($method === 'POST') {
    // Handle File Upload
    if (isset($_FILES['image'])) {
        $file = $_FILES['image'];
        $title = isset($_POST['title']) ? mysqli_real_escape_string($con, $_POST['title']) : '';

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $uploadErrors = [
                UPLOAD_ERR_INI_SIZE => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
                UPLOAD_ERR_FORM_SIZE => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
                UPLOAD_ERR_PARTIAL => 'The uploaded file was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload',
            ];
            $errorMessage = isset($uploadErrors[$file['error']]) ? $uploadErrors[$file['error']] : 'Unknown upload error';
            sendResponse(["error" => $errorMessage], 500);
            exit;
        }

        // Ensure upload directory exists
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                sendResponse(["error" => "Failed to create upload directory"], 500);
                exit;
            }
        }

        $fileName = time() . '_' . basename($file['name']);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $sql = "INSERT INTO gallery (image, title) VALUES ('$fileName', '$title')";
            if (mysqli_query($con, $sql)) {
                sendResponse(["message" => "Image uploaded successfully", "image" => $fileName]);
            } else {
                // If DB insert fails, delete the file
                unlink($targetPath);
                sendResponse(["error" => "Database error: " . mysqli_error($con)], 500);
            }
        } else {
            sendResponse(["error" => "Failed to move uploaded file. Check directory permissions."], 500);
        }
    } else {
        sendResponse(["error" => "No image file provided"], 400);
    }
} elseif ($method === 'DELETE') {
    // Extract ID from path (e.g., /123)
    $id = trim($path, '/');

    if ($id) {
        // Get image filename first to delete file
        $sql = "SELECT image FROM gallery WHERE id = $id";
        $result = mysqli_query($con, $sql);

        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $fileName = $row['image'];
            $filePath = $uploadDir . $fileName;

            // Delete from DB
            $deleteSql = "DELETE FROM gallery WHERE id = $id";
            if (mysqli_query($con, $deleteSql)) {
                // Delete file if exists
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                sendResponse(["message" => "Image deleted successfully"]);
            } else {
                sendResponse(["error" => "Failed to delete record"], 500);
            }
        } else {
            sendResponse(["error" => "Image not found"], 404);
        }
    } else {
        sendResponse(["error" => "ID required"], 400);
    }
}
?>