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
    function Canvas(width, height) {
        this.width = width;
        this.height = height;
    }
    Canvas.prototype.clear = function () {
        context.clearRect(0, 0, this.width, this.height);
    };
    return Canvas;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.left = false;
        _this.right = false;
        _this.maxSpeed = 3;
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
        context.fillStyle = this.color;
        context.shadowBlur = 10;
        context.shadowColor = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}(MoveableCanvasElement));
var Brick = /** @class */ (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Brick.prototype.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Brick;
}(CanvasElement));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.max_speed = 2;
        return _this;
    }
    Ball.prototype.updatePosition = function () {
        var _this = this;
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
            var pixelDiff = this.x + this.width / 2 - game.player.x - game.player.width / 2;
            var percentageDiff = (pixelDiff / game.player.width) * 2;
            this.speed[0] = percentageDiff * this.max_speed;
            this.speed[1] = -Math.abs(Math.sqrt(Math.pow(this.max_speed, 2) - Math.pow(this.speed[0], 2)));
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
            game.bricks.splice(game.bricks.indexOf(collidingBrick), 1);
            this.speed[1] = -this.speed[1];
        }
    };
    Ball.prototype.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
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
        //return (
        //  midX >= element.x &&
        //  midX <= element.x + element.width &&
        //  midY <= element.y + element.height &&
        //  midY >= element.y
        //);
    };
    return Ball;
}(MoveableCanvasElement));
var Game = /** @class */ (function () {
    function Game() {
        this.rows = 10;
        this.columns = 10;
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
    Game.prototype.start = function () {
        var _this = this;
        // Initializing the canvas
        this.canvas = new Canvas(canvasEl.width, canvasEl.height);
        // Drawing bricks
        var brickSize = [canvasEl.width / this.columns, 20];
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                var color = this.brickColors[(i + j) % this.brickColors.length];
                var brick = new Brick(brickSize[0] * j, brickSize[1] * i, brickSize[0], brickSize[1], color);
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
        // Drawing the ball
        var ballSize = [10, 10];
        var ballCords = [
            playerCords[0] + playerSize[0] / 2 - ballSize[0] / 2,
            playerCords[1] - ballSize[1],
        ];
        this.ball = new Ball(ballCords[0], ballCords[1], ballSize[0], ballSize[1], "black");
        this.ball.speed[0] = (0.5 - Math.random()) * this.ball.max_speed;
        this.ball.speed[1] = -Math.abs(Math.sqrt(Math.pow(this.ball.max_speed, 2) - Math.pow(this.ball.speed[0], 2)));
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
        setInterval(function () {
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
    };
    return Game;
}());
var canvasEl = document.getElementById("gameCanvas");
var context = canvasEl.getContext("2d");
var game = new Game();
game.start();
