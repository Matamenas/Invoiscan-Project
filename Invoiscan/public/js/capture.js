(() => {
  let video, canvas, photo, startbutton, uploadImage, ocrResult;

  function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");
    uploadImage = document.getElementById("uploadImage");
    ocrResult = document.getElementById("ocr-result");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    startbutton.addEventListener("click", (ev) => {
      capturePhoto();
      ev.preventDefault();
    });

    uploadImage.addEventListener("change", (ev) => {
      handleImageUpload(ev.target.files[0]);
    });

    clearPhoto();
  }

  function clearPhoto() {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    photo.setAttribute("src", "");
  }

  function capturePhoto() {
    const context = canvas.getContext("2d");
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
      sendImageToServer(data);
    }
  }

  function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64Image = event.target.result;
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        photo.setAttribute("src", base64Image);
        sendImageToServer(base64Image);
      };
      img.src = base64Image;
    };
    reader.readAsDataURL(file);
  }

  function sendImageToServer(imageData) {
    fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
      // Extracted text from OCR
      const extractedText = data.fullText;

      // Identify Date using regex
      const dateRegex = /\b(0?[1-9]|[12][0-9]|3[01])([\/.])(0?[1-9]|1[0-2])\2(\d{4})\b/;

      const dateMatch = extractedText.match(dateRegex);
      const date = dateMatch ? dateMatch[0] : "Date not found";

      // Identify VAT Registration Number using regex (Irish format as an example)
      const vatRegex = /\bIE\d{7}[A-Z]\b/;
      const vatMatch = extractedText.match(vatRegex);
      const vatReg = vatMatch ? vatMatch[0] : "VAT Registration not found";

      // Display extracted details
      document.getElementById("store-name").innerText = `Store: ${data.storeName || "Not found"}`;
      document.getElementById("total").innerText = `Total: ${data.total || "Not found"}`;
      document.getElementById("vat").innerText = `VAT: ${data.vat || "Not found"}`;
      document.getElementById("date").innerText = `Date: ${date}`;
      document.getElementById("vat-reg").innerText = `VAT Registration: ${vatReg}`;
      
      // Display full OCR text
      document.getElementById("full-text").innerText = extractedText;
    })
    .catch(error => console.error('Error:', error));
  }

  window.addEventListener("load", startup);
})();
