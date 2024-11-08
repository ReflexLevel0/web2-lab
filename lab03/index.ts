class CanvasElement {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class MoveableCanvasElement extends CanvasElement {
  speed: number[] = [0, 0];
}

class Canvas {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  clear() {
    context.clearRect(0, 0, this.width, this.height);
  }
}

class Player extends MoveableCanvasElement {
  left: boolean = false;
  right: boolean = false;
  maxSpeed: number = 3;

  updatePosition() {
    this.speed[0] = 0;
    if (this.left && !this.right) {
      this.speed[0] = -this.maxSpeed;
    } else if (!this.left && this.right) {
      this.speed[0] = this.maxSpeed;
    }

    this.x += this.speed[0];
    this.x = Math.min(Math.max(this.x, 0), game.canvas.width - this.width);
  }

  draw() {
    context.fillStyle = this.color;
    context.shadowBlur = 10;
    context.shadowColor = "black";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Brick extends CanvasElement {
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ball extends MoveableCanvasElement {
  max_speed: number = 2;

  updatePosition() {
    this.x += this.speed[0] * this.max_speed;
    this.y += this.speed[1] * this.max_speed;

    // Game is over if ball is below bottom line
    if (this.y > game.canvas.height) {
      //game.gameOver();
      return;
    }

    // Ball colliding with left or right wall
    if (this.x < 0 || this.x > game.canvas.width - this.width) {
      this.speed[0] = -this.speed[0];
      return;
    }

    // Ball colliding with top wall
    if (this.y < 0) {
      this.speed[1] = Math.abs(this.speed[1]);
      return;
    }

    // Ball colliding with player
    if (this.checkCollision(this, game.player)) {
      let pixelDiff =
        this.x + this.width / 2 - game.player.x - game.player.width / 2;
      let percentageDiff = (pixelDiff / game.player.width) * 2;
      this.speed[0] = percentageDiff * this.max_speed;
      this.speed[1] = -Math.abs(
        Math.sqrt(Math.pow(this.max_speed, 2) - Math.pow(this.speed[0], 2)),
      );
      return;
    }

    // Checking if ball colliding with any brick
    let collidingBrick: Brick | undefined = undefined;
    game.bricks.forEach((brick) => {
      if (this.checkCollision(this, brick)) {
        collidingBrick = brick;
      }
    });

    // Removing a brick if ball is colliding with it and changing the y direction of the ball
    if (collidingBrick != undefined) {
      game.bricks.splice(game.bricks.indexOf(collidingBrick), 1);
      this.speed[1] = -this.speed[1];
    }
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(source: CanvasElement, target: CanvasElement) {
    for (let i = source.x; i <= source.x + source.width; i++) {
      for (let j = source.y; j <= source.y + source.height; j++) {
        if (
          i >= target.x &&
          i <= target.x + target.width &&
          j >= target.y &&
          j <= target.y + target.height
        ) {
          return true;
        }
      }
    }
    return false;

    //return (
    //  midX >= element.x &&
    //  midX <= element.x + element.width &&
    //  midY <= element.y + element.height &&
    //  midY >= element.y
    //);
  }
}

class Game {
  rows: number = 10;
  columns: number = 10;
  brickColors: string[] = [
    "red",
    "green",
    "blue",
    "brown",
    "pink",
    "purple",
    "orange",
    "#4c1c24",
    "teal",
    "yellow",
  ];
  player: Player;
  canvas: Canvas;
  bricks: Brick[] = [];
  ball: Ball;

  start() {
    // Initializing the canvas
    this.canvas = new Canvas(canvasEl.width, canvasEl.height);

    // Drawing bricks
    let brickSize = [canvasEl.width / this.columns, 20];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let color = this.brickColors[(i + j) % this.brickColors.length];
        let brick = new Brick(
          brickSize[0] * j,
          brickSize[1] * i,
          brickSize[0],
          brickSize[1],
          color,
        );
        this.bricks.push(brick);
      }
    }

    // Drawing the player
    let playerSize = [brickSize[0] + 10, brickSize[1] / 2];
    let playerCords = [
      this.canvas.width / 2 - playerSize[0] / 2,
      this.canvas.height - playerSize[1] - 50,
    ];
    this.player = new Player(
      playerCords[0],
      playerCords[1],
      playerSize[0],
      playerSize[1],
      "red",
    );

    // Drawing the ball
    let ballSize = [10, 10];
    let ballCords = [
      playerCords[0] + playerSize[0] / 2 - ballSize[0] / 2,
      playerCords[1] - ballSize[1],
    ];
    this.ball = new Ball(
      ballCords[0],
      ballCords[1],
      ballSize[0],
      ballSize[1],
      "black",
    );
    this.ball.speed[0] = (0.5 - Math.random()) * this.ball.max_speed;
    this.ball.speed[1] = -Math.abs(
      Math.sqrt(
        Math.pow(this.ball.max_speed, 2) - Math.pow(this.ball.speed[0], 2),
      ),
    );

    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key == "ArrowLeft") {
        this.player.left = true;
      } else if (event.key == "ArrowRight") {
        this.player.right = true;
      }
    };

    document.onkeyup = (event: KeyboardEvent) => {
      if (event.key == "ArrowLeft") {
        this.player.left = false;
      } else if (event.key == "ArrowRight") {
        this.player.right = false;
      }
    };

    setInterval(() => {
      this.refreshGame();
    }, 10);
  }

  refreshGame() {
    this.canvas.clear();
    this.player.updatePosition();
    this.player.draw();
    this.bricks.forEach((brick) => brick.draw());
    this.ball.updatePosition();
    this.ball.draw();
  }
}

let canvasEl: HTMLCanvasElement = document.getElementById(
  "gameCanvas",
) as HTMLCanvasElement;
let context = canvasEl.getContext("2d");
let game = new Game();
game.start();
