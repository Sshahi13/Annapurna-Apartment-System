<?php
require_once 'db_api.php';

// 1. Get data from React
$data = getJsonInput();

if (!isset($data['pidx'])) {
    sendResponse(["error" => "pidx is required"], 400);
}

// 2. Prepare the Khalti Verification Request
$payload = json_encode([
    "pidx" => $data['pidx']
]);

// 3. Send to Khalti using CURL
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://dev.khalti.com/api/v2/epayment/lookup/',
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
    echo $response; // Send Khalti's verification response back to React
}
?>