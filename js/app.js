document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid")
  let width = 10
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameover = false

  // create board
  function createBoard() {
    // game array with bombs
    const bombsArray = Array(bombAmount).fill("bomb")
    const validArray = Array(width * width - bombAmount).fill("valid")
    const gameArray = validArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

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
      // ctrl and left click
      square.oncontextmenu = function (e) {
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
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++ // left
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++ // upper right
        if (!isRightEdge && squares[i + 1].classList.contains("bomb")) total++ // right
        if (i < (width * width - width - 1) && !isRightEdge && squares[i + width + 1].classList.contains("bomb")) total++ // lower right
        if (i < (width * width - width) && squares[i + width].classList.contains("bomb")) total++ // below
        if (i > 0 && !isLeftEdge && (i < width * width - width) && squares[i + width - 1].classList.contains("bomb")) total++ // lower left
        if ((i > (width + 1) && !isLeftEdge) && squares[i - width - 1].classList.contains("bomb")) total++ // upper left
        if ((i > width - 1) && squares[i - width].classList.contains("bomb")) total++ // above

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
        checkForWin()
      } else {
        square.classList.remove("flag")
        square.innerHTML = ""
        flags--
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
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add("checked")
  }

  // check neighbouring squares once square is clicked
  function checkSquare(square, currendId) {
    const isLeftEdge = (currendId % width === 0)
    const isRightEdge = (currendId % width === width - 1)
    setTimeout(() => {
      if (currendId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currendId) - 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currendId) + 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId > 10) {
        const newId = squares[parseInt(currendId - width)].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currendId) - 1 - width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currendId) + 1].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currendId) - 1 + width].idx
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currendId) + 1 + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currendId < 89) {
        const newId = squares[parseInt(currendId) + width].id
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  // game over
  function gameOver(square) {
    console.log("BOOM! Game over!")
    isGameover = true

    // show all the bombs
    squares.forEach(square => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣"
      }
    })
    alert("BOOM! Game over!")
  }

  // check for win
  function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
        matches++
      }
      if (matches === bombAmount) {
        console.log("YOU WIN!")
        alert("Congrats, you won!")
        isGameover = true
      }
    }
  }

})
