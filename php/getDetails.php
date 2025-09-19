<?php
include('./dbDetails.php');

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
// $domain_name = $_POST['message'];
$message = $_POST['message'];

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO queries (name,email,phone,message) VALUES('$name','$email','$phone','$message')";

if ($conn->query($sql) === TRUE) {
  echo '<script>
  alert("We will catch you as soon as possible");
  window.location.href = "../index.html";
  </script>';
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
