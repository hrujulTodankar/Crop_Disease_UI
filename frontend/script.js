const API_URL = "https://crop-disease-backend-fdyh.onrender.com/predict";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.onchange = () => {
  const file = imageInput.files[0];
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
};

document.getElementById("predictBtn").onclick = async () => {
  const file = imageInput.files[0];
  const crop = document.getElementById("cropSelect").value;

  if (!file) return alert("Upload image");

  document.getElementById("loading").classList.remove("hidden");

  const formData = new FormData();
  formData.append("crop", crop);
  formData.append("image", file);

  const response = await fetch(API_URL, { method: "POST", body: formData });
  const data = await response.json();

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");

  showTopPredictions(data.top_predictions);
};

function showTopPredictions(predictions) {
  const list = document.getElementById("predictionList");
  list.innerHTML = "";

  predictions.slice(0,3).forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.label} (${p.confidence}%)`;
    list.appendChild(li);
  });

  const topDisease = predictions[0].label;
  document.getElementById("treatmentText").innerText =
    TREATMENTS[topDisease] || "No treatment info available.";
}
