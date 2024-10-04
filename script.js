let selectedBox = null;
let lastFilledIndex = -1;

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
            "Metadata": {
                "Title": "Emotion Tracker",
                "Year": 2024
            },
            "Alternatives": {
                "Happy": "#FFD700",
                "Sad": "#1E90FF",
                "Angry": "#FF4500",
                "Neutral": "#A9A9A9"
            }
        }
    };

    Object.assign(data, sampleData["Emotion Tracker"]["Alternatives"]);
    updateHeadings(sampleData["Emotion Tracker"]["Metadata"]);
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

    const year = parseInt(document.querySelector('h1').textContent);

    const daysInMonths = getDaysInMonths(year);

    let boxIndex = 0;
    for (let month = 0; month < daysInMonths.length; month++) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-container';

        const monthLabel = document.createElement('h3');
        monthLabel.textContent = getMonthName(month);
        monthDiv.appendChild(monthLabel);

        for (let day = 0; day < daysInMonths[month]; day++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.dataset.index = boxIndex;
            box.addEventListener('click', () => chooseKey(box));

            if (boxIndex !== 0) {
                box.classList.add('disabled');
            }

            monthDiv.appendChild(box);
            boxIndex++;
        }

        gridContainer.appendChild(monthDiv);
    }
}

function getDaysInMonths(year) {
    return [
        31, // January
        isLeapYear(year) ? 29 : 28, // February (accounting for leap year)
        31, // March
        30, // April
        31, // May
        30, // June
        31, // July
        31, // August
        30, // September
        31, // October
        30, // November
        31  // December
    ];
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getMonthName(monthIndex) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
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
    const boxIndex = parseInt(box.dataset.index);

    if (boxIndex === lastFilledIndex + 1) {
        const emotionPicker = document.getElementById('emotion-picker');
        emotionPicker.style.display = 'flex';
        selectedBox = box;
    }
}

function selectEmotion(emotion) {
    if (selectedBox && data[emotion]) {
        selectedBox.style.backgroundColor = data[emotion];
        selectedBox.dataset.key = emotion;

        lastFilledIndex = parseInt(selectedBox.dataset.index);

        selectedBox.classList.add('disabled');
        
        const nextBox = document.querySelector(`[data-index="${lastFilledIndex + 1}"]`);
        if (nextBox) {
            nextBox.classList.remove('disabled');
        }
    }
    const emotionPicker = document.getElementById('emotion-picker');
    emotionPicker.style.display = 'none';
}

function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        Object.assign(data, jsonData["Emotion Tracker"]["Alternatives"]);
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

function updateHeadings(metadata) {
    const yearHeading = document.querySelector('h1');
    const titleHeading = document.querySelector('h2');

    yearHeading.textContent = metadata.Year;
    titleHeading.textContent = metadata.Title;
}