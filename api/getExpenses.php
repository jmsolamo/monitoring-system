<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'enertech_db');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$sql = "SELECT * FROM actual_expenses ORDER BY expense_date DESC";
$result = $conn->query($sql);

$expenses = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $expenses[] = $row;
    }
}

echo json_encode(['success' => true, 'data' => $expenses]);
$conn->close();
?>
