<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST['name'], $_POST['contact'], $_POST['email'], $_POST['dob'], $_POST['gender'], $_POST['password'], $_POST['confirm_password'])) {
        $name = $_POST['name'];
        $contact = $_POST['contact'];
        $email = $_POST['email'];
        $dob = $_POST['dob'];
        $gender = $_POST['gender'];
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirm_password'];

        if ($password !== $confirmPassword) {
            echo "<script>alert('Passwords do not match!');</script>";
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM signup WHERE Email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo "<script>alert('These details are already used. Please try with a different email.');</script>";
        } else {
            $stmt = $conn->prepare("INSERT INTO signup (Name, Contact_Number, Email, DOB, Gender, Password, Confirm_Password) VALUES (:name, :contact, :email, :dob, :gender, :password, :confirmPassword)");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':contact', $contact);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':dob', $dob);
            $stmt->bindParam(':gender', $gender);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':confirmPassword', $confirmPassword);

            if ($stmt->execute()) {
                echo "Signup successful!";
            } else {
                echo "Signup failed! Please try again.>";
            }
        }
    } else {
        echo "Please fill in all the fields.";
    }
}
?>
