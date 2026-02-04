const API_URL = "https://crop-disease-backend-fdyh.onrender.com/predict";

const preview = document.getElementById("preview");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("resultBox");

document.getElementById("imageInput").onchange = (e) => {
  preview.src = URL.createObjectURL(e.target.files[0]);
  preview.classList.remove("hidden");
};

document.getElementById("predictBtn").onclick = async () => {
  const file = document.getElementById("imageInput").files[0];
  const crop = document.getElementById("cropSelect").value;

  if (!file) return alert("Upload image");

  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("crop", crop);
  formData.append("image", file);

  const res = await fetch(API_URL, { method: "POST", body: formData });
  const data = await res.json();

  loading.classList.add("hidden");

  resultBox.innerHTML = `
    <h3>${data.prediction}</h3>
    <p>Confidence: ${data.confidence}%</p>
    <p><strong>Treatment:</strong> ${TREATMENTS[data.prediction] || "No data"}</p>
  `;

  showScreen("result");
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
