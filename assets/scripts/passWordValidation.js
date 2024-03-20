document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("togglePassword1")
    .addEventListener("click", function () {
      const password1 = document.getElementById("userpassword");
      const type =
        password1.getAttribute("type") === "password" ? "text" : "password";
      password1.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });

  document
    .getElementById("togglePassword2")
    .addEventListener("click", function () {
      const password2 = document.getElementById("userConfirmPass");
      const type =
        password2.getAttribute("type") === "password" ? "text" : "password";
      password2.setAttribute("type", type);
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });

  // Function to upload file when the "Upload" button is clicked
  document
    .querySelectorAll(".modal-footer .btn-primary")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        const password = document.getElementById("userpassword").value;
        const confirmPass = document.getElementById("userConfirmPass").value;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{10,}$/;
        const file = document.getElementById("input-file-now-custom").files[0];

        // Validate passwords
        if (password !== confirmPass) {
          alert("Passwords do not match.");
          return;
        }

        if (!passwordRegex.test(password)) {
          alert(
            "Password should be minimum 10 characters long, start with a capital letter, contain at least one special character (!@#$%^&*), and at least one digit."
          );
          return;
        }

        // Perform file upload here
        const formData = new FormData();
        formData.append("file", file);
        formData.append("password", password);

        fetch("/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Show success message
            if (data.success) {
              alert("File uploaded successfully.");
              // Optionally, you can close the modal or redirect to another page
            } else {
              alert("Error uploading file: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again later.");
          });
      });
    });
});
