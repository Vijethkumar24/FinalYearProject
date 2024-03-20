function uploadFile() {
  var password1 = document.getElementById("password1").value;
  var password2 = document.getElementById("password2").value;
  var password3 = document.getElementById("password3").value;

  // Password validation rules
  var passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{10,}$/;

  if (password1 !== password2 || password2 !== password3) {
    alert("Passwords do not match.");
    return;
  }

  if (!passwordRegex.test(password1)) {
    alert(
      "Password should be minimum 10 characters long, start with a capital letter, contain at least one special character (!@#$%^&*), and at least one digit."
    );
    return;
  }

  // If password passes validation, proceed with upload
  // You can add your upload logic here
  console.log("Upload logic goes here");
}
