const API_URL = "https://xm5ucab960.execute-api.us-east-1.amazonaws.com/prod/upload";

function handleFileUpload(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageContainer = document.getElementById("uploaded-image");
    imageContainer.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image"/>`;
  };
  reader.readAsDataURL(file);
}

function uploadImage() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image to upload.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result.split(",")[1]; // Extract base64 data
    const payload = {
      body: base64Image,
      isBase64Encoded: true,
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in API request");
        }
        return response.json();
      })
      .then((data) => {
        const resultContainer = document.getElementById("result");
        const labels = JSON.parse(data.body).labels;
        resultContainer.innerHTML =
          `<h3>Detected Items:</h3><ul>` +
          labels.map((label) => `<li>${label.Name}: ${label.Confidence}%</li>`).join("") +
          `</ul>`;
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while uploading the image.");
      });
  };
  reader.readAsDataURL(file);
}

