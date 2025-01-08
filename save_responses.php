<?php
session_start();
include 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_email'])) {
    echo json_encode(['success' => false, 'message' => 'Please sign in first.']);
    exit;
}

$email = $_SESSION['user_email'];
$responses = [];

for ($i = 1; $i <= 36; $i++) {
    $responses[] = isset($_POST["q$i"]) ? ($_POST["q$i"] === 'agree' ? 1 : 0) : 0;
}

try {
    $insertQuery = "INSERT INTO responses (email, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34, q35, q36) 
                    VALUES (:email, :q1, :q2, :q3, :q4, :q5, :q6, :q7, :q8, :q9, :q10, :q11, :q12, :q13, :q14, :q15, :q16, :q17, :q18, :q19, :q20, :q21, :q22, :q23, :q24, :q25, :q26, :q27, :q28, :q29, :q30, :q31, :q32, :q33, :q34, :q35, :q36)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->bindParam(':email', $email);
    foreach ($responses as $i => $response) {
        $stmt->bindParam(":q" . ($i + 1), $responses[$i]);
    }
    $stmt->execute();

    // Call ML script
    $responseString = implode(",", $responses);
    $command = escapeshellcmd("python process_responses.py " . escapeshellarg($responseString));
    $output = shell_exec($command);

    if ($output === null) {
        throw new Exception("Error executing ML script.");
    }

    echo json_encode(['success' => true, 'job' => trim($output)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>