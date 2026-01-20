<?php
require_once 'db_api.php';

// 1. Get data from React
$data = getJsonInput();

if (!isset($data['amount'])) {
    sendResponse(["error" => "Amount is required"], 400);
}

$amount = $data['amount'];
$purchase_order_id = isset($data['order_id']) ? $data['order_id'] : "Order_" . time();
$purchase_order_name = isset($data['order_name']) ? $data['order_name'] : "Room Reservation";
$customer_name = isset($data['customer_name']) ? $data['customer_name'] : "Guest";
$customer_email = isset($data['customer_email']) ? $data['customer_email'] : "guest@example.com";
$customer_phone = isset($data['customer_phone']) ? $data['customer_phone'] : "9800000000";

// 2. Prepare the Khalti Request
$payload = json_encode([
    "return_url" => "http://localhost:3000/payment-success",
    "website_url" => "http://localhost:3000",
    "amount" => $amount * 100, // Convert Rs to Paisa
    "purchase_order_id" => $purchase_order_id,
    "purchase_order_name" => $purchase_order_name,
    "customer_info" => [
        "name" => $customer_name,
        "email" => $customer_email,
        "phone" => $customer_phone
    ]
]);

// 3. Send to Khalti using CURL
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://dev.khalti.com/api/v2/epayment/initiate/',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => array(
        'Authorization: key ' . $KHALTI_SECRET_KEY,
        'Content-Type: application/json'
    ),
    CURLOPT_RETURNTRANSFER => true,
));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    sendResponse(["error" => "CURL Error: " . $err], 500);
} else {
    echo $response;
}
?>