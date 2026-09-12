<?php
// TMC Private Detective Agency - simple PHP mail handler.
// Requires a PHP-enabled hosting environment. Change $to if the receiving email changes.
$to = "info@triguna.org";
$subject = "New Confidential Enquiry - TMC Private Detective Agency";

function clean($value) {
    return trim(str_replace(["\r", "\n"], " ", $value ?? ""));
}

$name = clean($_POST["name"] ?? "");
$phone = clean($_POST["phone"] ?? "");
$email = clean($_POST["email"] ?? "");
$service = clean($_POST["service"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($name === "" || $phone === "" || $service === "" || $message === "") {
    http_response_code(400);
    echo "Please complete all required fields.";
    exit;
}

$body = "New confidential enquiry\n\n"
      . "Name: $name\n"
      . "Phone: $phone\n"
      . "Email: $email\n"
      . "Service: $service\n\n"
      . "Message:\n$message\n\n"
      . "Submitted through TMC Private Detective Agency website.";

$headers = "From: TMC Website <no-reply@triguna.org>\r\n";
if ($email !== "" && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers .= "Reply-To: $email\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    header("Location: index.html?sent=1#contact");
    exit;
}

http_response_code(500);
echo "We could not send the enquiry from this server. Please contact us by WhatsApp or email at info@triguna.org.";
?>
