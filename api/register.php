<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'enertech_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        $firstName = $data['firstName'] ?? '';
        $lastName = $data['lastName'] ?? '';
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $role = $data['role'] ?? '1';

        if (empty($firstName) || empty($lastName) || empty($username) || empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$firstName, $lastName, $username, $email, $hashedPassword, $role]);

        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
