const board = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

let currentPlayer = "red"; // Le joueur humain commence
let gameActive = true;
let grid = Array(6).fill().map(() => Array(7).fill(null));

function createBoard() {
    board.innerHTML = ""; // Vider le tableau
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", () => makeMove(col));
            board.appendChild(cell);
        }
    }
}

function makeMove(col) {
    if (!gameActive) return;

    // Trouver la première ligne vide dans la colonne
    for (let row = 5; row >= 0; row--) {
        if (!grid[row][col]) {
            grid[row][col] = currentPlayer;
            updateBoard();
            checkWinner();
            currentPlayer = currentPlayer === "red" ? "yellow" : "red"; // Changer de joueur
            if (currentPlayer === "yellow" && gameActive) {
                setTimeout(aiMove, 500); // L'IA fait son coup après un petit délai
            }
            return;
        }
    }
    message.textContent = "Colonne pleine ! Essayez une autre.";
}

function updateBoard() {
    const cells = board.getElementsByClassName("cell");
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const index = row * 7 + col;
            const cell = cells[index];
            if (grid[row][col]) {
                cell.classList.add(grid[row][col]);
            } else {
                cell.classList.remove("red", "yellow");
            }
        }
    }
}

function checkWinner() {
    // Vérifier les lignes, les colonnes et les diagonales
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (grid[row][col] && checkDirection(row, col)) {
                gameActive = false;
                message.textContent = `${grid[row][col] === "red" ? "Vous" : "L'IA"} gagne !`;
                return;
            }
        }
    }
}

function checkDirection(row, col) {
    const directions = [
        { r: 1, c: 0 }, // vertical
        { r: 0, c: 1 }, // horizontal
        { r: 1, c: 1 }, // diagonale descendante
        { r: 1, c: -1 } // diagonale montante
    ];

    for (let direction of directions) {
        let count = 0;
        for (let i = -3; i <= 3; i++) {
            const newRow = row + i * direction.r;
            const newCol = col + i * direction.c;
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && grid[newRow][newCol] === grid[row][col]) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) return true;
    }

    return false;
}

function aiMove() {
    if (!gameActive) return;

    // IA choisit une colonne aléatoire parmi les colonnes disponibles
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
        if (grid[0][col] === null) {
            availableColumns.push(col);
        }
    }

    const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    for (let row = 5; row >= 0; row--) {
        if (!grid[row][randomCol]) {
            grid[row][randomCol] = "yellow";
            updateBoard();
            checkWinner();
            currentPlayer = "red"; // C'est à ton tour maintenant
            return;
        }
    }
}

function resetGame() {
    grid = Array(6).fill().map(() => Array(7).fill(null));
    gameActive = true;
    currentPlayer = "red";
    message.textContent = "";
    createBoard();
}

createBoard();
