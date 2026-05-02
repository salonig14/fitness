<?php

header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Read JSON input
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

// ✅ Prevent crash if JSON missing
if (!$input) {
    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);
    exit;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validation
if ($name === '' || $email === '' || $password === '') {
    echo json_encode([
        "success" => false,
        "message" => "All fields required"
    ]);
    exit;
}

try {
    $pdo = getDb();

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([
        $name,
        strtolower($email),
        password_hash($password, PASSWORD_DEFAULT)
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Signup successful"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
