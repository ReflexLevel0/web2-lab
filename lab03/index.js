var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CanvasElement = /** @class */ (function () {
    function CanvasElement(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    return CanvasElement;
}());
var MoveableCanvasElement = /** @class */ (function (_super) {
    __extends(MoveableCanvasElement, _super);
    function MoveableCanvasElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = [0, 0];
        return _this;
    }
    return MoveableCanvasElement;
}(CanvasElement));
var Canvas = /** @class */ (function () {
    function Canvas(canvasEl) {
        this.canvasEl = canvasEl;
        this.width = canvasEl.width;
        this.height = canvasEl.height;
        this.context = this.canvasEl.getContext("2d");
    }
    Canvas.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.printEndScreen = function (wonGame) {
        this.clear();
        // Printing GAME OVER or YOU WON
        this.context.font = "48px serif";
        this.context.shadowBlur = 0;
        this.context.fillStyle = "black";
        this.context.textAlign = "center";
        this.context.fillText(wonGame ? "YOU WON" : "GAME OVER", this.width / 2, this.height / 2);
        // Printing max score
        this.context.font = "36px serif";
        this.context.fillText("Highest score: " + game.getHighscore(), this.width / 2, (this.height * 3) / 4);
    };
    Canvas.prototype.printScore = function (score, maxScore) {
        this.context.font = "22px serif";
        this.context.shadowBlur = 0;
        this.context.fillStyle = "black";
        this.context.textAlign = "right";
        this.context.fillText(score + "/" + maxScore, this.width, 20, this.width);
    };
    return Canvas;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.left = false;
        _this.right = false;
        return _this;
    }
    Player.prototype.updatePosition = function () {
        this.speed[0] = 0;
        if (this.left && !this.right) {
            this.speed[0] = -this.maxSpeed;
        }
        else if (!this.left && this.right) {
            this.speed[0] = this.maxSpeed;
        }
        this.x += this.speed[0];
        this.x = Math.min(Math.max(this.x, 0), game.canvas.width - this.width);
    };
    Player.prototype.draw = function () {
        game.canvas.context.fillStyle = this.color;
        game.canvas.context.shadowBlur = 10;
        game.canvas.context.shadowColor = "black";
        game.canvas.context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}(MoveableCanvasElement));
var Brick = /** @class */ (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Brick.prototype.draw = function () {
        game.canvas.context.fillStyle = this.color;
        game.canvas.context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Brick;
}(CanvasElement));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ball.prototype.updatePosition = function () {
        var _this = this;
        this.x += this.speed[0] * this.maxSpeed;
        this.y += this.speed[1] * this.maxSpeed;
        // Game is over if ball is below bottom line
        if (this.y > game.canvas.height) {
            game.gameOver(false);
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
            var pixelDiff = this.x + this.width / 2 - game.player.x - game.player.width / 2;
            var percentageDiff = (pixelDiff / game.player.width) * 2;
            percentageDiff = Math.min(0.9, Math.max(-0.9, percentageDiff));
            this.speed[0] = percentageDiff * this.maxSpeed;
            this.speed[1] = this.calculateYSpeed();
            return;
        }
        // Checking if ball colliding with any brick
        var collidingBrick = undefined;
        game.bricks.forEach(function (brick) {
            if (_this.checkCollision(_this, brick)) {
                collidingBrick = brick;
            }
        });
        // Removing a brick if ball is colliding with it and changing the y direction of the ball
        if (collidingBrick != undefined) {
            // Checking if ball colliding on the side of the brick
            if ((this.x >= collidingBrick.x + collidingBrick.width ||
                this.x <= collidingBrick.x) &&
                this.speed[0] > 0.05 * this.maxSpeed) {
                this.speed[0] = -this.speed[0];
            }
            // If ball is colliding on brick on top or bottom
            else {
                this.speed[1] = -this.speed[1];
            }
            game.bricks.splice(game.bricks.indexOf(collidingBrick), 1);
            game.score++;
        }
        // Player won if no more bricks are left
        if (game.bricks.length == 0) {
            game.gameOver(true);
        }
    };
    Ball.prototype.calculateYSpeed = function () {
        return -Math.abs(Math.sqrt(Math.pow(this.maxSpeed, 2) - Math.pow(this.speed[0], 2)));
    };
    Ball.prototype.draw = function () {
        game.canvas.context.fillStyle = this.color;
        game.canvas.context.fillRect(this.x, this.y, this.width, this.height);
    };
    Ball.prototype.checkCollision = function (source, target) {
        for (var i = source.x; i <= source.x + source.width; i++) {
            for (var j = source.y; j <= source.y + source.height; j++) {
                if (i >= target.x &&
                    i <= target.x + target.width &&
                    j >= target.y &&
                    j <= target.y + target.height) {
                    return true;
                }
            }
        }
        return false;
    };
    return Ball;
}(MoveableCanvasElement));
var Game = /** @class */ (function () {
    function Game() {
        this.brickColors = [
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
        this.bricks = [];
    }
    Game.prototype.init = function () {
        // Initializing the canvas
        var canvasEl = document.createElement("canvas");
        canvasEl.id = "gameCanvas";
        canvasEl.width = window.innerWidth - 20;
        canvasEl.height = window.innerHeight - 20;
        canvasEl.setAttribute("hidden", "true");
        this.canvas = new Canvas(canvasEl);
        document.body.appendChild(canvasEl);
    };
    Game.prototype.start = function () {
        var _this = this;
        this.score = 0;
        this.rows = this.getParameterValue("rowCount");
        this.columns = this.getParameterValue("columnCount");
        document.getElementById("parameterForm").setAttribute("hidden", "true");
        this.canvas.canvasEl.removeAttribute("hidden");
        // Drawing bricks
        var brickSize = [this.canvas.width / this.columns, 20];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                var color = this.brickColors[(i + j) % this.brickColors.length];
                var brick = new Brick(brickSize[0] * j, brickSize[1] * (i + 1), brickSize[0], brickSize[1], color);
                this.bricks.push(brick);
            }
        }
        // Drawing the player
        var playerSize = [brickSize[0] + 10, brickSize[1] / 2];
        var playerCords = [
            this.canvas.width / 2 - playerSize[0] / 2,
            this.canvas.height - playerSize[1] - 50,
        ];
        this.player = new Player(playerCords[0], playerCords[1], playerSize[0], playerSize[1], "red");
        this.player.maxSpeed = this.getParameterValue("playerSpeed");
        // Drawing the ball
        var ballSize = [10, 10];
        var ballCords = [
            playerCords[0] + playerSize[0] / 2 - ballSize[0] / 2,
            playerCords[1] - ballSize[1],
        ];
        this.ball = new Ball(ballCords[0], ballCords[1], ballSize[0], ballSize[1], "black");
        this.ball.maxSpeed = this.getParameterValue("ballSpeed");
        this.ball.speed[0] = (0.5 - Math.random()) * this.ball.maxSpeed;
        this.ball.speed[1] = this.ball.calculateYSpeed();
        document.onkeydown = function (event) {
            if (event.key == "ArrowLeft") {
                _this.player.left = true;
            }
            else if (event.key == "ArrowRight") {
                _this.player.right = true;
            }
        };
        document.onkeyup = function (event) {
            if (event.key == "ArrowLeft") {
                _this.player.left = false;
            }
            else if (event.key == "ArrowRight") {
                _this.player.right = false;
            }
        };
        this.refreshInterval = setInterval(function () {
            _this.refreshGame();
        }, 10);
    };
    Game.prototype.refreshGame = function () {
        this.canvas.clear();
        this.player.updatePosition();
        this.player.draw();
        this.bricks.forEach(function (brick) { return brick.draw(); });
        this.ball.updatePosition();
        this.ball.draw();
        this.canvas.printScore(this.score, this.rows * this.columns);
    };
    Game.prototype.gameOver = function (won) {
        var _this = this;
        clearInterval(this.refreshInterval);
        if (game.score > this.getHighscore()) {
            localStorage.setItem("highscore", game.score.toString());
        }
        setTimeout(function () { return _this.canvas.printEndScreen(won); }, 100);
    };
    Game.prototype.getParameterValue = function (inputId) {
        var el = document.getElementById(inputId);
        return el.value === "" ? +el.placeholder : +el.value;
    };
    Game.prototype.getHighscore = function () {
        var highscore = localStorage.getItem("highscore");
        return highscore == null ? 0 : +highscore;
    };
    return Game;
}());
// Disabling form from refreshing page when clicking on Start Game button
var form = document.getElementById("parameterForm");
function handleForm(event) {
    event.preventDefault();
}
form.addEventListener("submit", handleForm);
// Initializing the game and setting parameters based on form input
var game = new Game();
game.init();
