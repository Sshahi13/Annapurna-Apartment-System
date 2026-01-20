<?php
// Include configuration (database connection + CORS)
require_once 'config.php';

// Get the request URI
$request_uri = $_SERVER['REQUEST_URI'];

// Parse the path
// If running on localhost:8000, the URI might be /rooms or /rooms/1
// We want to remove query strings if any
$parsed_url = parse_url($request_uri);
$path = trim($parsed_url['path'], '/');

// Split path into parts
$path_parts = explode('/', $path);
$resource = $path_parts[0] ?? '';

// Set PATH_INFO for the sub-scripts (e.g., if path is rooms/1, PATH_INFO should be /1)
// Re-construct the path info from the remaining parts
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