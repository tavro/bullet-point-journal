const emotions = {};
const gridSize = 365;

document.addEventListener('DOMContentLoaded', () => {
    loadEmotions();
    createGrid();
    document.getElementById('file-input').addEventListener('change', loadFile);
    document.getElementById('save-button').addEventListener('click', saveToFile);
});

function loadEmotions() {
    const sampleData = {
        "Emotion Tracker": {
            "Happy": "#FFD700",
            "Sad": "#1E90FF",
            "Angry": "#FF4500",
            "Neutral": "#A9A9A9"
        }
    };
    Object.assign(emotions, sampleData["Emotion Tracker"]);
    displayEmotions();
}

function displayEmotions() {
    const container = document.getElementById('emotion-container');
    for (const [emotion, color] of Object.entries(emotions)) {
        const div = document.createElement('div');
        div.className = 'emotion-label';
        div.style.color = color;
        div.textContent = `${emotion}: ${color}`;
        container.appendChild(div);
    }
}

function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    for (let i = 0; i < gridSize; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.addEventListener('click', () => chooseEmotion(box));
        gridContainer.appendChild(box);
    }
}

function chooseEmotion(box) {
    const emotion = prompt("Enter your emotion (Happy, Sad, Angry, Neutral):");
    if (emotions[emotion]) {
        box.style.backgroundColor = emotions[emotion];
        box.dataset.emotion = emotion;
    } else {
        alert("Invalid emotion!");
    }
}

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        Object.assign(emotions, jsonData["Emotion Tracker"]);
        displayEmotions();
    };
    reader.readAsText(file);
}

function saveToFile() {
    const jsonData = JSON.stringify({ "Emotion Tracker": emotions }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotions.json';
    a.click();
    URL.revokeObjectURL(url);
}
