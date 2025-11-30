// ======================================
// 初期設定
// ======================================
let availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
let currentInterval = null;
let numberCells = [];

// 音
const soundStart = document.getElementById("soundStart");
const soundStop = document.getElementById("soundStop");

// DOM
const currentNumberDisplay = document.getElementById("currentNumber");
const tableContainer = document.getElementById("tableContainer");
const historyBox = document.getElementById("historyBox");

// 黄金演出
const bigEffect = document.getElementById("bigEffect");
const bigNumber = document.getElementById("bigNumber");

// ======================================
// 数字表を作成
// ======================================
function createNumberTable() {
    const table = document.createElement("div");
    table.className = "number-table";

    for (let i = 1; i <= 75; i++) {
        const cell = document.createElement("div");
        cell.className = "number-cell";
        cell.textContent = i;
        table.appendChild(cell);
        numberCells[i] = cell;
    }
    tableContainer.appendChild(table);
}
createNumberTable();


// ======================================
// 履歴管理（折り返し用）
// ======================================

// 最初の列を作成
let currentColumn = document.createElement("div");
currentColumn.classList.add("history-column");
historyBox.appendChild(currentColumn);

// 履歴に追加（
function addHistoryItem(num) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.textContent = num;

    currentColumn.appendChild(item);

    // ★ 10個になったら折り返し（新しい右列を作成）
    if (currentColumn.children.length >= 10) {
        const newCol = document.createElement("div");
        newCol.classList.add("history-column");
        historyBox.appendChild(newCol);
        currentColumn = newCol;
    }
}


// ======================================
// START（高速 → 減速 → 自動STOP）
// ======================================
document.getElementById("startBtn").onclick = () => {

    if (availableNumbers.length === 0) {
        currentNumberDisplay.textContent = "終了";
        return;
    }

    if (currentInterval) return;

    // START音1回
    soundStart.currentTime = 0;
    soundStart.loop = false;
    soundStart.play();

    let speed = 40; // 最速
    currentInterval = setInterval(spin, speed);

    function spin() {
        const temp = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        currentNumberDisplay.textContent = temp;
    }

    // のランダムで減速開始
    const randomDelay = 1000 + Math.random() * 1000;
    setTimeout(startDeceleration, randomDelay);


    function startDeceleration() {
        console.log("=== 減速開始 ===");

        let decelerator = setInterval(() => {
            speed += 40;
            clearInterval(currentInterval);
            currentInterval = setInterval(spin, speed);

            console.log(`減速中 speed: ${speed}ms`);

            if (speed >= 200) {
                clearInterval(decelerator);
                console.log("=== 減速終了 → STOP ===");

                setTimeout(stopDraw, 300);
            }
        }, 150);
    }
};


// ======================================
// STOP処理
// ======================================
function stopDraw() {
    if (!currentInterval) return;

    clearInterval(currentInterval);
    currentInterval = null;

    console.log("STOP処理実行");

    soundStart.pause();
    soundStart.currentTime = 0;

    // STOP音
    soundStop.currentTime = 0;
    soundStop.play();

    // 数字確定
    const index = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers.splice(index, 1)[0];

    currentNumberDisplay.textContent = selectedNumber;

    console.log(`選ばれた数字: ${selectedNumber}`);

    // 黄金演出
    bigNumber.textContent = selectedNumber;
    bigEffect.classList.add("active");

    setTimeout(() => {
        bigEffect.classList.remove("active");
        numberCells[selectedNumber].classList.add("hit");

        addHistoryItem(selectedNumber);

    }, 1600);
}


// ======================================
// 全画面モード
// ======================================
document.getElementById("fullscreenBtn").onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};