// 获取画布和上下文
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');

// 游戏配置
const GRID_SIZE = 15; // 15x15的棋盘
let CELL_SIZE; // 动态计算格子大小
let PIECE_RADIUS; // 动态计算棋子半径

// 游戏状态
let gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
let currentPlayer = 'black'; // 'black' 或 'white'
let gameOver = false;

// 更新画布尺寸
function updateCanvasSize() {
    const size = Math.min(600, Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95));
    canvas.width = size;
    canvas.height = size;
    CELL_SIZE = canvas.width / GRID_SIZE;
    PIECE_RADIUS = CELL_SIZE * 0.4;
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // 绘制横线和竖线
    for (let i = 0; i < GRID_SIZE; i++) {
        // 横线
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        // 竖线
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
    }
    ctx.stroke();

    // 绘制棋子
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (gameBoard[i][j]) {
                const x = j * CELL_SIZE + CELL_SIZE / 2;
                const y = i * CELL_SIZE + CELL_SIZE / 2;
                drawPiece(x, y, gameBoard[i][j]);
            }
        }
    }
}

// 绘制棋子
function drawPiece(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// 处理点击事件
function handleClick(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // 计算点击的格子位置
    const i = Math.floor(y / CELL_SIZE);
    const j = Math.floor(x / CELL_SIZE);

    // 如果该位置为空，则放置棋子
    if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE && !gameBoard[i][j]) {
        gameBoard[i][j] = currentPlayer;
        
        // 检查是否获胜
        if (checkWin(i, j)) {
            gameOver = true;
            status.textContent = `游戏结束！${currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;
        } else {
            // 切换玩家
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            status.textContent = `当前回合: ${currentPlayer === 'black' ? '黑子' : '白子'}`;
        }
        
        drawBoard();
    }
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [[0, 1], [0, -1]],  // 水平
        [[1, 0], [-1, 0]],  // 垂直
        [[1, 1], [-1, -1]], // 对角线
        [[1, -1], [-1, 1]]  // 反对角线
    ];

    for (const direction of directions) {
        let count = 1;
        
        for (const [dx, dy] of direction) {
            let r = row + dx;
            let c = col + dy;
            
            while (
                r >= 0 && r < GRID_SIZE &&
                c >= 0 && c < GRID_SIZE &&
                gameBoard[r][c] === currentPlayer
            ) {
                count++;
                r += dx;
                c += dy;
            }
        }
        
        if (count >= 5) return true;
    }
    
    return false;
}

// 重新开始游戏
function restart() {
    gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));
    currentPlayer = 'black';
    gameOver = false;
    status.textContent = '当前回合: 黑子';
    drawBoard();
}

// 添加事件监听器
canvas.addEventListener('click', handleClick);
restartButton.addEventListener('click', restart);
window.addEventListener('resize', updateCanvasSize);

// 初始化游戏
updateCanvasSize(); 