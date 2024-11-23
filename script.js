const API_URL = "https://xm5ucab960.execute-api.us-east-1.amazonaws.com/prod/upload";

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const responseContainer = document.getElementById("responseData");
  const uploadedImage = document.getElementById("uploadedImage");

  // Clear previous responses
  responseContainer.innerHTML = "";
  uploadedImage.src = "";

  if (fileInput.files.length === 0) {
    alert("Please select an image file.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
    const base64Image = reader.result.split(",")[1]; // Extract the base64 string
    uploadedImage.src = reader.result; // Show image preview

    try {
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
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const labels = JSON.parse(data.body).labels;

      // Populate response
      labels.forEach((label) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${label.Name} (${label.Confidence}%)`;
        responseContainer.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the image.");
    }
  };

  reader.readAsDataURL(file);
});

