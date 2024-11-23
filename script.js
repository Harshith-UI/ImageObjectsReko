// Replace this with your actual API Gateway invoke URL
const API_URL = "https://xm5ucab960.execute-api.us-east-1.amazonaws.com/prod/upload";
document.getElementById("imageUploadForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission
  const fileInput = document.getElementById("imageInput");
  const errorDiv = document.getElementById("error");
  const resultDiv = document.getElementById("result");

  // Clear previous messages
  errorDiv.textContent = "";
  resultDiv.textContent = "";

  if (!fileInput.files.length) {
    errorDiv.textContent = "Please select an image to upload.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1]; // Extract Base64 data

    try {
      // Make POST request to API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: base64Image,
          isBase64Encoded: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Display detected labels
      const labels = JSON.parse(data.body).labels;
      resultDiv.textContent = "Detected Labels:";
      labels.forEach((label) => {
        const p = document.createElement("p");
        p.textContent = `${label.Name}: ${label.Confidence}%`;
        resultDiv.appendChild(p);
      });
    } catch (error) {
      console.error("Error:", error);
      errorDiv.textContent = "An error occurred: " + error.message;
    }
  };

  reader.readAsDataURL(file);
});

