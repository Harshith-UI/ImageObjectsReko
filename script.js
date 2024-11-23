
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const resultDiv = document.getElementById("result");

// Replace with your API Gateway endpoint
const API_ENDPOINT = "https://xm5ucab960.execute-api.us-east-1.amazonaws.com/prod";

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image file.");
    return;
  }

  // Convert file to Base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    try {
      // Send Base64 image to API
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: base64Image,
          isBase64Encoded: true,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Display labels
        resultDiv.innerHTML = `
          <h3>Detected Labels:</h3>
          <ul>
            ${result.labels
              .map(
                (label) =>
                  `<li>${label.Name}: ${label.Confidence}%</li>`
              )
              .join("")}
          </ul>
        `;
      } else {
        resultDiv.innerHTML = `<p>Error: ${result.error}</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
    }
  };

  reader.readAsDataURL(file);
});
