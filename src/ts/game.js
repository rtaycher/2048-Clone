/**
 * Created by roma on 5/22/16.
 */
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
var Board = (function () {
    function Board(x_size, y_size) {
        this.points = 0;
        this.array = [];
        this.x_size = x_size;
        this.y_size = y_size;
    }
    Board.prototype.get_index = function (x, y) {
        return (y * this.x_size) + x - 1;
    };
    Board.prototype.get_points = function (index) {
        var x = index % this.x_size;
        var y = (index - x) / this.x_size;
        return [x, y];
    };
    return Board;
}());
function shift_board(board, direction) {
}
function input_handling(event) {
    switch (event.keyCode) {
        case 13:
            console.log("Up key is pressed");
            break;
        case 38:
            console.log("Down key is pressed");
            break;
        case 40:
            console.log("Right key is pressed");
            break;
        case 39:
            console.log("left key is pressed");
            break;
    }
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function main() {
    var game = document.getElementById("game");
    var x_size = 4;
    var y_size = 4;
    var i = 0;
    var rows = [];
    var actual_width = 0;
    window.board = new Board(x_size, y_size) || {};
    for (var y = 0; y < y_size; y++) {
        var row = document.createElement("div");
        row.className = "game-row";
        // row.style.height = `${(100 / y_size).toString()}%`;
        rows.push(row);
        for (var x = 0; x < x_size; x++) {
            var cell = document.createElement("div");
            cell.className = "game-cell";
            // cell.style.width = "16%"; // `${((100 / x_size) - 1).toString()}%`;
            cell.innerHTML += i.toString();
            row.appendChild(cell);
            i++;
            actual_width = cell.getBoundingClientRect().width;
        }
        game.appendChild(row);
        console.log("actual_width: " + actual_width);
    }
    document.onkeydown = input_handling;
    console.log("by bye");
}
main();
//# sourceMappingURL=game.js.map