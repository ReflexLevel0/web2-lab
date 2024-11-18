class CanvasElement {
  constructor(x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }
}

class MoveableCanvasElement extends CanvasElement {
  speed = [0, 0]
}

class Canvas {
  constructor(canvasEl) {
    this.canvasEl = canvasEl
    this.width = canvasEl.width
    this.height = canvasEl.height
    this.context = this.canvasEl.getContext("2d")
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /** Prints end screen
   * @param wonGame true if user destroyed all bricks
   */
  printEndScreen(wonGame) {
    this.clear()

    // Printing GAME OVER or YOU WON
    this.context.font = "48px serif"
    this.context.shadowBlur = 0
    this.context.fillStyle = "black"
    this.context.textAlign = "center"
    this.context.fillText(
      wonGame ? "YOU WON" : "GAME OVER",
      this.width / 2,
      this.height / 2
    )

    // Printing max score
    this.context.font = "36px serif"
    this.context.fillText(
      "Highest score: " + game.getHighscore(),
      this.width / 2,
      (this.height * 3) / 4
    )
  }

  /** Prints the score in the top right corner */
  printScore(score, maxScore) {
    this.context.font = "22px serif"
    this.context.shadowBlur = 0
    this.context.fillStyle = "black"
    this.context.textAlign = "right"
    this.context.fillText(score + "/" + maxScore, this.width, 20, this.width)
  }
}

class Player extends MoveableCanvasElement {
  left = false
  right = false

  constructor(x, y, width, height, color, maxSpeed) {
    super(x, y, width, height, color)
    this.maxSpeed = maxSpeed

    // Player controls
    document.onkeydown = event => {
      if (event.key == "ArrowLeft") {
        this.left = true
      } else if (event.key == "ArrowRight") {
        this.right = true
      }
    }
    document.onkeyup = event => {
      if (event.key == "ArrowLeft") {
        this.left = false
      } else if (event.key == "ArrowRight") {
        this.right = false
      }
    }
  }

  /** Updates position of the player based on their current speed and whether they are hitting a wall or not  */
  updatePosition() {
    this.speed[0] = 0
    if (this.left && !this.right) {
      this.speed[0] = -this.maxSpeed
    } else if (!this.left && this.right) {
      this.speed[0] = this.maxSpeed
    }

    this.x += this.speed[0]
    this.x = Math.min(Math.max(this.x, 0), game.canvas.width - this.width)
  }

  draw() {
    game.canvas.context.fillStyle = this.color
    game.canvas.context.shadowBlur = 10
    game.canvas.context.shadowColor = "black"
    game.canvas.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Brick extends CanvasElement {
  draw() {
    game.canvas.context.fillStyle = this.color
    game.canvas.context.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Ball extends MoveableCanvasElement {
  constructor(x, y, width, height, color, maxSpeed) {
    super(x, y, width, height, color)
    this.maxSpeed = maxSpeed
  }

  /** Updates position of the ball based on current speed and whether it is colliding with any wall, player, or brick */
  updatePosition() {
    this.x += this.speed[0] * this.maxSpeed
    this.y += this.speed[1] * this.maxSpeed

    // Game is over if ball is below bottom line
    if (this.y > game.canvas.height) {
      game.gameOver(false)
      return
    }

    // Ball colliding with left or right wall
    if (this.x < 0 || this.x > game.canvas.width - this.width) {
      this.speed[0] = -this.speed[0]
      return
    }

    // Ball colliding with top wall
    if (this.y < 0) {
      this.speed[1] = Math.abs(this.speed[1])
      return
    }

    // Ball colliding with player
    if (this.checkCollision(this, game.player)) {
      let pixelDiff =
        this.x + this.width / 2 - game.player.x - game.player.width / 2
      let percentageDiff = (pixelDiff / game.player.width) * 2
      percentageDiff = Math.min(0.9, Math.max(-0.9, percentageDiff))
      this.speed[0] = percentageDiff * this.maxSpeed
      this.speed[1] = this.calculateYSpeed()
      return
    }

    // Checking if ball colliding with any brick
    let collidingBrick = undefined
    game.bricks.forEach(brick => {
      if (this.checkCollision(this, brick)) {
        collidingBrick = brick
      }
    })

    // Removing a brick if ball is colliding with it and changing the y direction of the ball
    if (collidingBrick != undefined) {
      // Checking if ball colliding on the side of the brick
      if (
        (this.x >= collidingBrick.x + collidingBrick.width ||
          this.x <= collidingBrick.x) &&
        this.speed[0] > 0.05 * this.maxSpeed
      ) {
        this.speed[0] = -this.speed[0]
      }

      // If ball is colliding on brick on top or bottom
      else {
        this.speed[1] = -this.speed[1]
      }

      game.bricks.splice(game.bricks.indexOf(collidingBrick), 1)
      game.score++
    }

    // Player won if no more bricks are left
    if (game.bricks.length == 0) {
      game.gameOver(true)
    }
  }

  /** Calculates Y speed based on the X so that X^2 + Y^2 = maxSpeed^2 */
  calculateYSpeed() {
    return -Math.abs(
      Math.sqrt(Math.pow(this.maxSpeed, 2) - Math.pow(this.speed[0], 2))
    )
  }

  draw() {
    game.canvas.context.fillStyle = this.color
    game.canvas.context.fillRect(this.x, this.y, this.width, this.height)
  }

  /** Checks for collision between source and target elements */
  checkCollision(source, target) {
    for (let i = source.x; i <= source.x + source.width; i++) {
      for (let j = source.y; j <= source.y + source.height; j++) {
        if (
          i >= target.x &&
          i <= target.x + target.width &&
          j >= target.y &&
          j <= target.y + target.height
        ) {
          return true
        }
      }
    }
    return false
  }
}

class Game {
  brickColors = [
    "red",
    "green",
    "blue",
    "brown",
    "pink",
    "purple",
    "orange",
    "#4c1c24",
    "teal",
    "yellow"
  ]
  bricks = []

  /** Initializing the canvas
   */
  init() {
    let canvasEl = document.createElement("canvas")
    canvasEl.id = "gameCanvas"
    canvasEl.width = window.innerWidth - 20
    canvasEl.height = window.innerHeight - 20
    canvasEl.setAttribute("hidden", "true")
    this.canvas = new Canvas(canvasEl)
    document.body.appendChild(canvasEl)
  }

  /** Starts the game */
  start() {
    this.score = 0
    this.rows = this.getParameterValue("rowCount")
    this.columns = this.getParameterValue("columnCount")
    document.getElementById("parameterForm").setAttribute("hidden", "true")
    this.canvas.canvasEl.removeAttribute("hidden")

    // Drawing bricks
    let brickSize = [this.canvas.width / this.columns, 20]
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let color = this.brickColors[(i + j) % this.brickColors.length]
        let brick = new Brick(
          brickSize[0] * j,
          brickSize[1] * (i + 1),
          brickSize[0],
          brickSize[1],
          color
        )
        this.bricks.push(brick)
      }
    }

    // Drawing the player
    let playerSize = [brickSize[0] + 10, brickSize[1] / 2]
    let playerCords = [
      this.canvas.width / 2 - playerSize[0] / 2,
      this.canvas.height - playerSize[1] - 50
    ]
    this.player = new Player(
      playerCords[0],
      playerCords[1],
      playerSize[0],
      playerSize[1],
      "red",
      this.getParameterValue("playerSpeed")
    )

    // Drawing the ball
    let ballSize = [10, 10]
    let ballCords = [
      playerCords[0] + playerSize[0] / 2 - ballSize[0] / 2,
      playerCords[1] - ballSize[1]
    ]
    this.ball = new Ball(
      ballCords[0],
      ballCords[1],
      ballSize[0],
      ballSize[1],
      "black",
      this.getParameterValue("ballSpeed")
    )
    this.ball.speed[0] = (0.5 - Math.random()) * this.ball.maxSpeed
    this.ball.speed[1] = this.ball.calculateYSpeed()

    this.refreshInterval = setInterval(() => {
      this.refreshGame()
    }, 10)
  }

  /** Updates the entire canvas, runs every time after a set interval expires */
  refreshGame() {
    this.canvas.clear()
    this.player.updatePosition()
    this.player.draw()
    this.bricks.forEach(brick => brick.draw())
    this.ball.updatePosition()
    this.ball.draw()
    this.canvas.printScore(this.score, this.rows * this.columns)
  }

  /**
   * Clearing the canvas and printing out end screen messages when game is won or lost
   * @param won true if user cleared all the bricks
   */
  gameOver(won) {
    clearInterval(this.refreshInterval)
    if (game.score > this.getHighscore()) {
      localStorage.setItem("highscore", game.score.toString())
    }
    setTimeout(() => this.canvas.printEndScreen(won), 100)
  }

  /**
   * Gets parameter value from the HTML form
   * @param inputId ID of the HTMLInputElement
   */
  getParameterValue(inputId) {
    let el = document.getElementById(inputId)
    return el.value === "" ? +el.placeholder : +el.value
  }

  /** Fetches highscore from local storage */
  getHighscore() {
    let highscore = localStorage.getItem("highscore")
    return highscore == null ? 0 : +highscore
  }
}

// Disabling form from refreshing page when clicking on Start Game button
var form = document.getElementById("parameterForm")
function handleForm(event) {
  event.preventDefault()
}
form.addEventListener("submit", handleForm)

let game = new Game()
game.init()
