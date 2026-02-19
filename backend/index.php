<?php
// Include configuration (database connection + CORS)
require_once 'config.php';

// Get the request URI and scripts directory
$script_name = $_SERVER['SCRIPT_NAME']; // /Annapurna_Appartment/backend/index.php
$base_path = dirname($script_name);      // /Annapurna_Appartment/backend
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Calculate relative path
$path = substr($request_uri, strlen($base_path));
$path = trim($path, '/');

// Split path into parts
$path_parts = explode('/', $path);
$resource = $path_parts[0] ?? '';

// Set PATH_INFO for the sub-scripts
$_SERVER['PATH_INFO'] = '/' . implode('/', array_slice($path_parts, 1));

// Route the request
switch ($resource) {
    case 'rooms':
        require 'rooms.php';
        break;
    case 'reservations':
        require 'reservations.php';
        break;
    case 'payments':
        require 'payments.php';
        break;
    case 'contact':
        require 'contact.php';
        break;
    case 'prices':
        require 'prices.php';
        break;
    case 'admin':
        require 'auth.php';
        break;
    case 'debug':
        require 'debug_info.php';
        break;
    case 'gallery':
        require 'gallery.php';
        break;
    case '':
        echo json_encode(["message" => "Welcome to the Apartment Management API"]);
        break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Resource not found", "resource" => $resource]);
        break;
}
?>