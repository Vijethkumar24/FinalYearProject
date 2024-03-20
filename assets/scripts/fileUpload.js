document.addEventListener("DOMContentLoaded", function () {
  const uploadButtons = document.getElementsByClassName("btn btn-primary");

  for (let i = 0; i < uploadButtons.length; i++) {
    uploadButtons[i].addEventListener("click", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      const fileInput = document.getElementById("input-file-now-custom")
        .files[0];
      formData.append("file", fileInput);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
  }
});
