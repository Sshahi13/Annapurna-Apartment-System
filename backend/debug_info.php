<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = [
    'connection' => 'Connected successfully',
    'table_structure' => []
];

if (mysqli_connect_errno()) {
    $response['connection'] = 'Connection failed: ' . mysqli_connect_error();
    echo json_encode($response);
    exit();
}

$result = mysqli_query($con, "DESCRIBE login");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response['table_structure'][] = $row;
    }
} else {
    $response['table_structure'] = 'Error describing table: ' . mysqli_error($con);
}

echo json_encode($response);
?>