document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    let width = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameover = false

    // create board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() -0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div")
            square.setAttribute("id", i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener("click", function (e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains("valid")) {
                // if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++ // left
                // if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++ // upper right
                // if (!isRightEdge && squares[i + 1].classList.contains("bomb")) total++ // right
                // if (i < (width * width - width - 1) && !isRightEdge && squares[i + width + 1].classList.contains("bomb")) total++ // lower right
                // if (i < (width * width - width) && squares[i + width].classList.contains("bomb")) total++ // below
                // if (i > 0 && !isLeftEdge && (i < width * width - width) && squares[i + width - 1].classList.contains("bomb")) total++ // lower left
                // if ((i > (width + 1) && !isLeftEdge) && squares[i - width - 1].classList.contains("bomb")) total++ // upper left
                // if ((i > width - 1) && squares[i - width].classList.contains("bomb")) total++ // above
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++ // left
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++ // above right
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++ // above; instead of i > 10, i > 9
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++ // above left; instead of i > 11, i > 10
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++ // right; instead of i < 98, i < 99
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++ // below left
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++ // below right
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++ // below; instead of i < 89, i < 90
                squares[i].setAttribute("data", total)
                console.log(squares[i])
            }
        }
    }

    createBoard()

    // add flag with right click
    function addFlag(square) {
        if (isGameover) return
        if (!square.classList.contains("checked") && (flags < bombAmount)) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag")
                square.innerHTML = "🇻🇳"
                flags++
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove("flag")
                square.innerHTML = ""
                flags--
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    // click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameover) return;
        if (square.classList.contains("checked") || square.classList.contains("flag")) return;
        if (square.classList.contains("bomb")) {
            gameOver(square)
        } else {
            let total = square.getAttribute("data")
            if (total != 0) {
                square.classList.add("checked")
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                if (total == 5) square.classList.add('five')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add("checked")
    }

    // check neighbouring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    // game over
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameover = true

        // show all the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

    // check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
                matches++
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!'
                isGameover = true
            }
        }
    }

})
