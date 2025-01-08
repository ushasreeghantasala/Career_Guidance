<?php
session_start();
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Access POST data
    $email = $_POST['signin_email'];
    $password = $_POST['signin_password'];

    // Check if email and password match in the database
    $stmt = $conn->prepare("SELECT * FROM signup WHERE Email = :email AND Password = :password");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Sign-in successful
        $_SESSION['user_email'] = $email;
        echo "Sign-in successful!"; // Send response message
    } else {
        // Invalid credentials
        echo "Invalid credentials. Please sign up first.";
    }
}
?>


