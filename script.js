const gameBoard = (() => {
    let board = [[],[],[]];
    const resetBoard = () => {
        board[0] = [];
        board[1] = [];
        board[2] = [];
    };
    const fillBoard = (x, y, peice) => {
        board[x][y] = peice
    };
    const checkWin = () => {
        let a = 0;
        while (a <= 2) {
            if (board[a][0] && board[a][1] && board[a][2] && board[a][0] == board[a][1] && board[a][1] == board[a][2]) {
                // checks rows
                return 1;
            } else if (board[0][a] && board[1][a] && board[2][a] && board[0][a] == board[1][a] && board[1][a] == board[2][a]) {
                // checks columns
                return 1;
            }

            a += 1;
        }
        if (board[0][0] && board[1][1] && board[2][2] && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return 1;
        } else if (board[0][2] && board[1][1] && board[2][0] && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            return 1;
        } else if (board[0][0] && board[0][1] && board[0][2] && board[1][0] && board[1][1] && board[1][2] && board[2][0] && board[2][1] && board[2][2]) {
            return -1;
        } else {
            return 0;
        }
    };
    const displayBoard = (currentPlayer) => {
        for (let row in [0, 1, 2]) {
            for (let column in [0, 1, 2]) {
                let old_box = document.querySelector(`[id='${row}-${column}']`);
                //removes past event listeners
                let box = old_box.cloneNode(true)
                old_box.parentNode.replaceChild(box, old_box);
                box.textContent = gameBoard.board[row][column];
                box.addEventListener('click', () => {
                    game.players[currentPlayer].makeMove(row, column);
                    if (!gameBoard.checkWin()) {
                        game.play(currentPlayer);
                    } else {
                        gameBoard.displayBoard(currentPlayer);
                        clearSquareFunctionality();
                        game.end(gameBoard.checkWin(), currentPlayer);
                    }
                });
            }
        }
    };
    const clearSquareFunctionality = () => {
        for (let row in [0, 1, 2]) {
            for (let column in [0, 1, 2]) {
                let old_box = document.querySelector(`[id='${row}-${column}']`);
                //removes past event listeners
                let box = old_box.cloneNode(true)
                old_box.parentNode.replaceChild(box, old_box);
            }
        }
    };
    const unlockBoard = () => {
        $gameboard = document.querySelector('#game-board');
        $gameboard.classList.remove('locked')
    };
    return { board, resetBoard, fillBoard, checkWin, displayBoard, unlockBoard, clearSquareFunctionality };
})();

const Player = (name, piece) => {
    const makeMove = (x, y) => {
        if (x <= 2 && y <= 2 && !gameBoard.board[x][y]) {
            gameBoard.fillBoard(x, y, piece);
        } else {
            throw new Error("Move is invalid");
        }
    }
    return {name, piece, makeMove}
}

const Bot = (name, piece) => {
    const makeRandomMove = () => {
        x = Math.floor(Math.random() * 3);
        y = Math.floor(Math.random() * 3);
        if (!gameBoard.board[x][y]) {
            setTimeout(gameBoard.fillBoard(x, y, piece), 8000)
        } else {
            makeRandomMove();
        }
    }
    const makePerfectMoves = () => {
        
    }
    return {name, piece, makeRandomMove}
}

const game = (() => {
    $winner = document.querySelector('.winner');
    let players = [Bot("Bot Player 1", "X"), Bot("Bot Player 2", "O")];
    const playVsPlayer = (currentPlayer) => {
        //swaps players
        (currentPlayer) ? currentPlayer = 0 : currentPlayer = 1;
        gameBoard.displayBoard(currentPlayer);
    };
    const playVsComputer = (currentPlayer) => {
        (currentPlayer) ? currentPlayer = 0 : currentPlayer = 1;
        if (players[currentPlayer].name.indexOf("Bot ") != -1) {
            players[currentPlayer].makeRandomMove();
            if (!gameBoard.checkWin()) {
                game.play(currentPlayer);
            } else {
                gameBoard.displayBoard(currentPlayer);
                gameBoard.clearSquareFunctionality();
                game.end(gameBoard.checkWin(), currentPlayer);
            }
        } else {
            gameBoard.displayBoard(currentPlayer);
        }
    };
    const play = (currentPlayer = 1) => {
        if (players[0].name.indexOf("Bot ") != -1 && players[1].name.indexOf("Bot ") != -1) {
            displayError(new Error("Not Enough Players"));
        } else if (players[0].name.indexOf("Bot ") == -1 && players[1].name.indexOf("Bot ") == -1) {
            $winner.classList.add('hidden');
            gameBoard.unlockBoard();
            hideError();
            playVsPlayer(currentPlayer);
        } else {
            $winner.classList.add('hidden');
            gameBoard.unlockBoard();
            hideError();
            playVsComputer(currentPlayer);
        }
    }
    const end = (endType, currentPlayer) => {
        $winner.classList.remove('hidden');
        if (endType == -1) {
            $winner.textContent = "It's a tie!"
        } else {
            $winner.textContent = `${game.players[currentPlayer].name} (${game.players[currentPlayer].piece}) wins!`;
        }
    };
    const displayError = (error) => {
        const $error = document.querySelector('.error');
        $error.classList.remove('hidden');
        $error.textContent = error
    };
    const hideError = () => {
        const $error = document.querySelector('.error');
        $error.classList.add('hidden');
    };
    return { players, play, end, displayError, hideError}
})();

const form = (() => {
    const $form = document.querySelector('.form');
    const $name = $form.querySelector('#name');
    const $piece = $form.querySelector('#piece');
    const $game = document.querySelector('#game');
    const $p1Name = document.querySelector('#p1-name');
    const $p1Piece = document.querySelector('#p1-piece');
    const $p2Name = document.querySelector('#p2-name');
    const $p2Piece = document.querySelector('#p2-piece');
    const $p1Submit = document.querySelector('#p1-submit');
    const $p2Submit = document.querySelector('#p2-submit');
    const initializeEventHandlers = () => {
        const $returnButon = $form.querySelector('#return');
        $returnButon.addEventListener('click', () => {
            form.toggleDisplay();
            form.clearForm();
            game.hideError();
            const $p1Submit = document.querySelector('#p1-submit');
            const $p2Submit = document.querySelector('#p2-submit');
            $p1Submit.classList.add('hidden');
            $p2Submit.classList.add('hidden');
        });
        
        $p1Submit.addEventListener('click', () => {
            try {
                form.submit(0)
            } catch (error) {
                game.displayError(error);
            }
        });
        
        const $addP1 = document.querySelector('#p1-add');
        $addP1.addEventListener('click', () => {
            $winner = document.querySelector('.winner');
            $winner.classList.add('hidden')
            form.toggleDisplay();
            $p1Submit.classList.remove('hidden');
        });
        
        $p2Submit.addEventListener('click', () => {
            try {
                form.submit(1)
            } catch (error) {
                game.displayError(error);
            }
        });
        
        const $addP2 = document.querySelector('#p2-add');
        $addP2.addEventListener('click', () => {
            $winner = document.querySelector('.winner');
            $winner.classList.add('hidden')
            form.toggleDisplay();
            $p2Submit.classList.remove('hidden');
        });
        
        const $startGame = document.querySelector('.start > button');
        $startGame.addEventListener('click', () => {
            gameBoard.resetBoard();
            game.play();
        });
        
        const $p1Remove = document.querySelector('#p1-remove')
        $p1Remove.addEventListener('click', () => {
            game.players[0] = Bot('Bot Player 1', 'X')
            $p1Name.textContent = game.players[0].name;
            $p1Piece.textContent = `(${game.players[0].piece})`;
        })
        
        const $p2Remove = document.querySelector('#p2-remove')
        $p2Remove.addEventListener('click', () => {
            game.players[1] = Bot('Bot Player 2', 'O')
            $p2Name.textContent = game.players[1].name;
            $p2Piece.textContent = `(${game.players[1].piece})`;
        })
    };
    const toggleDisplay = () => {
        $form.classList.toggle('hidden');
        $game.classList.toggle('hidden');
    };
    const clearForm = () => {
        $name.value = "";
        $piece.value = "";
    };
    const submit = (index) => {
        let name = $name.value;
        let piece = $piece.value;
         if (index == 0 && piece.length == 1 && name.length >= 1 && game.players[1].name != name && game.players[1].piece != piece.toUpperCase()) {
            game.players[0] = Player(name, piece.toUpperCase());
            $p1Name.textContent = game.players[0].name;
            $p1Piece.textContent = `(${game.players[0].piece})`;
            toggleDisplay();
            $p1Submit.classList.add('hidden');
            $p2Submit.classList.add('hidden');
            game.hideError();
            clearForm();
        } else if (piece.length == 1 && name.length >= 1 && game.players[0].name != name && game.players[0].piece != piece.toUpperCase()) {
            game.players[1] = Player(name, piece.toUpperCase());
            $p2Name.textContent = game.players[1].name;
            $p2Piece.textContent = `(${game.players[1].piece})`;
            toggleDisplay();
            $p1Submit.classList.add('hidden');
            $p2Submit.classList.add('hidden');
            game.hideError();
            clearForm();
        } else {
            throw new Error("Invalid Player");
        }
    };
    return { toggleDisplay, clearForm, submit, initializeEventHandlers };
})();

form.initializeEventHandlers();



