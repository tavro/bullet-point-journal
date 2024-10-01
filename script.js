let selectedBox = null;

const data = {};
const gridSize = 365;

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    createGrid();
    document.getElementById('file-input').addEventListener('change', loadFile);
    document.getElementById('save-button').addEventListener('click', saveToFile);
});

function loadData() {
    const sampleData = {
        "Emotion Tracker": {
            "Happy": "#FFD700",
            "Sad": "#1E90FF",
            "Angry": "#FF4500",
            "Neutral": "#A9A9A9"
        }
    };

    Object.assign(data, sampleData["Emotion Tracker"]);
    displayData();
    generateEmotionPicker();
}

function displayData() {
    const container = document.getElementById('data-container');
    container.innerHTML = '';
    for (const [key, color] of Object.entries(data)) {
        const div = document.createElement('div');
        div.className = 'key-label';
        div.style.color = color;
        div.textContent = `${key}: ${color}`;
        container.appendChild(div);
    }
}

function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.addEventListener('click', () => chooseKey(box));
        gridContainer.appendChild(box);
    }
}

function generateEmotionPicker() {
    const emotionPicker = document.getElementById('emotion-options');
    emotionPicker.innerHTML = '';

    for (const [emotion, color] of Object.entries(data)) {
        const emotionBox = document.createElement('div');
        emotionBox.className = 'emotion-box';
        emotionBox.style.backgroundColor = color;
        emotionBox.dataset.emotion = emotion;
        emotionBox.addEventListener('click', (event) => {
            selectEmotion(event.target.dataset.emotion);
        });
        emotionPicker.appendChild(emotionBox);
    }
}

function chooseKey(box) {
    const emotionPicker = document.getElementById('emotion-picker');
    emotionPicker.style.display = 'flex';

    selectedBox = box;
}

function selectEmotion(emotion) {
    if (selectedBox && data[emotion]) {
        selectedBox.style.backgroundColor = data[emotion];
        selectedBox.dataset.key = emotion;
    }
    const emotionPicker = document.getElementById('emotion-picker');
    emotionPicker.style.display = 'none';
}

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        Object.assign(data, jsonData["Emotion Tracker"]);
        displayData();
        generateEmotionPicker();
    };
    reader.readAsText(file);
}

function saveToFile() {
    const jsonData = JSON.stringify({ "Emotion Tracker": data }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
}
