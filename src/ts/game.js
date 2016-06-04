/**
 * Created by roma on 5/22/16.
 */
// Add Array includes polyfill if needed
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        }
        else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement) {
                return true;
            }
            k++;
        }
        return false;
    };
}
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
function arraysEqualHack(arr1, arr2) {
    return JSON.stringify(arr1) == JSON.stringify(arr2);
}
function is_truthy(val) {
    if (val) {
        return true;
    }
    else {
        return false;
    }
}
function sum(array) {
    return array.reduce(function (acc, x) {
        if (x) {
            return x + acc;
        }
        else {
            return acc;
        }
    }, 0);
}
//CC 3.0 Attribution http://jaketrent.com/post/addremove-classes-raw-javascript/ by Jake Trent
function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else if (!hasClass(el, className))
        el.className += " " + className;
}
function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var colors = ["White", "Yellow", "LightSalmon", "Orangered", "Gold", "Red", "LightCoral", "RoyalBlue", "Blue", "LimeGreen", "MistyRose", "Purple", "deepskyblue", "Plum", "Pink", "rebeccapurple"];
var Board = (function () {
    function Board(x_size, y_size) {
        this.array = [];
        this.x_size = x_size;
        this.y_size = y_size;
        this.score = 0;
        for (var i = 0; i < this.x_size * this.y_size; i++) {
            this.array[i] = null;
        }
    }
    Board.prototype.get_index = function (x, y) {
        return (y * this.x_size) + x;
    };
    Board.prototype.add_new_number = function () {
        if (this.array.filter(function (x) { return !!x; }).length === this.x_size * this.y_size) {
            console.warn("board is full");
            return;
        }
        var index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        while (this.array[index]) {
            index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        }
        this.array[index] = { id: get_psuedo_uuid(), value: 2 };
    };
    Board.prototype.try_move = function (direction, x, y, id_arr) {
        var old_location_index = 0;
        var new_location_index = 0;
        if (direction === Direction.Left) {
            if (x === 0) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x - 1, y);
        }
        else if (direction === Direction.Right) {
            if (x === this.x_size - 1) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x + 1, y);
        }
        else if (direction === Direction.Up) {
            if (y === 0) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x, y - 1);
        }
        else if (direction === Direction.Down) {
            if (y === this.y_size - 1) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x, y + 1);
        }
        var object_at_old_location = this.array[old_location_index];
        var object_at_new_location = this.array[new_location_index];
        var value_at_old_location = object_at_old_location && object_at_old_location.value;
        var value_at_new_location = object_at_new_location && object_at_new_location.value;
        if (object_at_old_location && object_at_new_location && value_at_old_location && value_at_new_location &&
            value_at_old_location === value_at_new_location &&
            !id_arr.includes(object_at_old_location.id) &&
            !id_arr.includes(object_at_new_location.id)) {
            console.log("old_v::" + value_at_old_location + " new_v:" + value_at_new_location);
            this.array[new_location_index] = {
                id: get_psuedo_uuid(),
                value: value_at_old_location + value_at_new_location
            };
            this.array[old_location_index] = null;
            this.score += this.array[new_location_index].value;
            id_arr.push(this.array[new_location_index].id);
        }
        else if (!object_at_new_location) {
            this.array[old_location_index] = null;
            this.array[new_location_index] = object_at_old_location;
        }
    };
    Board.prototype.game_is_won = function () {
        return this.array.filter(Boolean).some(function (x) { return x.value >= 2048; });
    };
    Board.prototype.can_make_move = function () {
        var old_array = this.array.slice();
        var old_score = this.score;
        this.shift_board(Direction.Up);
        this.shift_board(Direction.Down);
        this.shift_board(Direction.Left);
        this.shift_board(Direction.Right);
        this.score = old_score;
        if (arraysEqualHack(this.array, old_array)) {
            return false;
        }
        this.array = old_array;
        return true;
    };
    Board.prototype.shift_board = function (direction) {
        var id_array = [];
        if (direction === Direction.Left) {
            for (var y = 0; y < this.y_size; y++) {
                for (var x = this.x_size - 1; x > 0; x--) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        }
        else if (direction === Direction.Right) {
            for (var y = 0; y < this.y_size; y++) {
                for (var x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        }
        else if (direction === Direction.Up) {
            for (var y = this.y_size - 1; y > 0; y--) {
                for (var x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        }
        else if (direction === Direction.Down) {
            for (var y = 0; y < this.y_size; y++) {
                for (var x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        }
    };
    Board.prototype.draw = function () {
        var game = document.getElementById("game");
        // delete old nodes
        while (game.firstChild) {
            game.removeChild(game.firstChild);
        }
        var x_size = 4;
        var y_size = 4;
        var i = 0;
        var rows = [];
        var actual_width = 0;
        for (var y = 0; y < y_size; y++) {
            var row = document.createElement("div");
            row.className = "game-row";
            // row.style.height = `${(100 / y_size).toString()}%`;
            rows.push(row);
            for (var x = 0; x < x_size; x++) {
                var cell = document.createElement("div");
                cell.className = "game-cell";
                if (this.array[this.get_index(x, y)]) {
                    cell.innerHTML = (this.array[this.get_index(x, y)].value || "").toString();
                }
                if (this.array[this.get_index(x, y)]) {
                    removeClass(cell, "transparent");
                }
                else {
                    addClass(cell, "transparent");
                }
                if (this.array[this.get_index(x, y)]) {
                    if (colors[this.array[this.get_index(x, y)].value] == "White") {
                        console.log("x:" + x + "y:" + y + " value:" + this.array[this.get_index(x, y)].value);
                    }
                    cell.style.backgroundColor = colors[this.array[this.get_index(x, y)].value];
                }
                row.appendChild(cell);
                i++;
            }
            game.appendChild(row);
        }
        document.getElementById("game-score").innerHTML = this.score.toString();
        if (this.game_is_won()) {
            if (this.can_make_move()) {
                document.getElementById("game-status").innerHTML = "Game Won!";
            }
            else {
                document.getElementById("game-status").innerHTML = "Game Won! No more moves can be made";
            }
        }
        else if (!this.can_make_move()) {
            document.getElementById("game-status").innerHTML = "No More moves can be made. Game Lost!";
        }
        else {
            document.getElementById("game-status").innerHTML = "";
        }
    };
    return Board;
}());
function input_handling(event) {
    if (!window.board.game_won) {
        switch (event.keyCode) {
            case 72: // h
            case 65: // a
            case 37:
                window.board.shift_board(Direction.Left);
                console.log("Left key is pressed");
                window.board.add_new_number();
                break;
            case 75: // k
            case 87: // w
            case 38:
                window.board.shift_board(Direction.Up);
                console.log("Up key is pressed");
                window.board.add_new_number();
                break;
            case 76: // l
            case 68: // d
            case 39:
                window.board.shift_board(Direction.Right);
                console.log("Right key is pressed");
                window.board.add_new_number();
                break;
            case 74: // j
            case 83: // s
            case 40:
                window.board.shift_board(Direction.Down);
                console.log("Down key is pressed");
                window.board.add_new_number();
                break;
        }
    }
    window.board.draw();
}
function get_psuedo_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function new_game() {
    var x_size = 4;
    var y_size = 4;
    window.board = new Board(x_size, y_size) || {};
    window.board.add_new_number();
    window.board.add_new_number();
    window.board.draw();
}
function main() {
    document.onkeydown = input_handling;
    new_game();
}
main();
//# sourceMappingURL=game.js.map