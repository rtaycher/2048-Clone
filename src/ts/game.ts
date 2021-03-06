/**
 * Created by roma on 5/22/16.
 */

/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../../typings/globals/js-cookie/index.d.ts"/>
/// <reference path="../ts.d/global.d.ts"/>
import * as Cookies from "js-cookie";


// Add Array includes polyfill if needed
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype.includes) {
    Array.prototype.includes = function<T>(searchElement: T /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k:number;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement: T;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}


function includes<T>(arr:Array<T>, searchElement:T /*, fromIndex*/ ) {
    'use strict';
    var O = Object(arr);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
        return false;
    }
    var n :number = parseInt(arguments[1], 10) || 0;
    var k: number;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {k = 0;}
    }
    var currentElement:T;
    while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement) { // NaN !== NaN
            return true;
        }
        k++;
    }
    return false;
}
enum Direction {
    Left,
    Right,
    Up,
    Down
}

function arraysEqualHack<T>(arr1: Array<T>, arr2: Array<T>) {
    return JSON.stringify(arr1) == JSON.stringify(arr2);
}

function is_truthy(val: any) {
    if (val) {
        return true;
    } else {
        return false;
    }
}

function sum<T>(array: Array<T>) {
    return array.reduce((acc, x) => {
        if (x) {
            return x + acc
        } else {
            return acc;
        }
    }, 0);
}

//CC 3.0 Attribution http://jaketrent.com/post/addremove-classes-raw-javascript/ by Jake Trent
function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className)
    else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className = el.className.replace(reg, ' ')
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const colors = ["White", "Yellow", "LightSalmon", "Orangered", "Gold", "Red", "LightCoral", "RoyalBlue", "Blue", "LimeGreen", "MistyRose", "Purple", "deepskyblue", "Plum", "Pink", "rebeccapurple"];
class Board {
    points:number;
    array:ValueWithId[];
    x_size:number;
    y_size:number;
    score:number;
    max_score:number;

    constructor(x_size, y_size) {
        this.array = [];
        this.x_size = x_size;
        this.y_size = y_size;
        this.score = 0;
        this.max_score = parseInt(Cookies.get('max_score'), 10) || 0;

        for (let i = 0; i < this.x_size * this.y_size; i++) {
            this.array[i] = null;
        }
    }

    get_index(x:number, y:number) {
        return (y * this.x_size) + x;
    }

    add_new_number() {
        if (this.array.filter(x => !!x).length === this.x_size * this.y_size) {
            return;
        }

        let index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        while (this.array[index]) {
            index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        }
        this.array[index] = {id: get_psuedo_uuid(), value: 2};

    }

    score_update(add_to_score:number) {
        this.max_score = parseInt(Cookies.get('max_score'), 10) || 0;

        this.score += add_to_score;
        if (this.score > this.max_score) {
            Cookies.set('max_score', this.max_score);
        }
    }
    try_move(direction:Direction, x:number , y:number, id_arr:string[]) {
        let old_location_index = 0;
        let new_location_index = 0;
        if (direction === Direction.Left) {
            if (x === 0) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x - 1, y);
        } else if (direction === Direction.Right) {
            if (x === this.x_size - 1) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x + 1, y);
        } else if (direction === Direction.Up) {
            if (y === 0) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x, y - 1);
        } else if (direction === Direction.Down) {
            if (y === this.y_size - 1) {
                return;
            }
            old_location_index = this.get_index(x, y);
            new_location_index = this.get_index(x, y + 1);
        }
        let object_at_old_location = this.array[old_location_index];
        let object_at_new_location = this.array[new_location_index];
        let value_at_old_location = object_at_old_location && object_at_old_location.value;
        let value_at_new_location = object_at_new_location && object_at_new_location.value;
        if (object_at_old_location && object_at_new_location && value_at_old_location && value_at_new_location &&
            value_at_old_location === value_at_new_location &&
            !includes(id_arr, object_at_old_location.id) &&
            !includes(id_arr, object_at_new_location.id)) {

            this.array[new_location_index] = {
                id: get_psuedo_uuid(),
                value: value_at_old_location + value_at_new_location
            };
            this.array[old_location_index] = null;
            this.score_update(this.array[new_location_index].value);
            id_arr.push(this.array[new_location_index].id);
        } else if (!object_at_new_location) {
            this.array[old_location_index] = null;
            this.array[new_location_index] = object_at_old_location;
        }
    }

    game_is_won() {
        return this.array.filter(Boolean).some(x => x.value >= 2048);
    }

    can_make_move() {
        let old_array = this.array.slice();
        let old_score = this.score;
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
    }

    shift_board(direction) {
        let id_array = [];
        if (direction === Direction.Left) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = this.x_size - 1; x > 0; x--) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        } else if (direction === Direction.Right) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        } else if (direction === Direction.Up) {
            for (let y = this.y_size - 1; y > 0; y--) {
                for (let x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        } else if (direction === Direction.Down) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = 0; x < this.x_size; x++) {
                    this.try_move(direction, x, y, id_array);
                }
            }
        }
    }

    draw() {
        let game = document.getElementById("game");
        // delete old nodes
        while (game.firstChild) {
            game.removeChild(game.firstChild);
        }

        const x_size = 4;
        const y_size = 4;
        let i = 0;
        let rows = [];
        let actual_width = 0;

        for (let y = 0; y < y_size; y++) {
            let row = document.createElement("div");
            row.className = "game-row";
            // row.style.height = `${(100 / y_size).toString()}%`;
            rows.push(row);

            for (let x = 0; x < x_size; x++) {
                let cell = document.createElement("div");
                cell.className = "game-cell";
                if (this.array[this.get_index(x, y)]) {
                    cell.innerHTML = (this.array[this.get_index(x, y)].value || "").toString();
                }
                if (this.array[this.get_index(x, y)]) {
                    removeClass(cell, "transparent");
                } else {
                    addClass(cell, "transparent");
                }
                if (this.array[this.get_index(x, y)]) {
                    cell.style.backgroundColor = colors[this.array[this.get_index(x, y)].value];
                }
                row.appendChild(cell);
                i++;
            }
            game.appendChild(row);
        }
        document.getElementById("game-score").innerHTML = this.score.toString();
        document.getElementById("game-top-score").innerHTML = this.max_score.toString();
        if (this.game_is_won()) {
            if (this.can_make_move()) {
                document.getElementById("game-status").innerHTML = "Game Won!";
            } else {
                document.getElementById("game-status").innerHTML = "Game Won! No more moves can be made";
            }
        } else if (!this.can_make_move()) {
            document.getElementById("game-status").innerHTML = "No More moves can be made. Game Lost!";
        }
        else {
            document.getElementById("game-status").innerHTML = "";
        }
    }
}

function input_handling(event) {
    if (!board.can_make_move()) {
        switch (event.keyCode) {
            case 72: // h
            case 65: // a
            case 37: // Left Arrow
                board.shift_board(Direction.Left);
                console.debug("Left key is pressed");
                board.add_new_number();
                break;
            case 75: // k
            case 87: // w
            case 38: // Up Arrow
                board.shift_board(Direction.Up);
                console.debug("Up key is pressed");
                board.add_new_number();
                break;
            case 76: // l
            case 68: // d
            case 39:  // Right Arrow
                board.shift_board(Direction.Right);
                console.debug("Right key is pressed");
                board.add_new_number();
                break;
            case 74: // j
            case 83: // s
            case 40: // Down Arrow
                board.shift_board(Direction.Down);
                console.debug("Down key is pressed");
                board.add_new_number();
                break;
        }
    }
    board.draw();
}

var board : Board;

interface ValueWithId {
    id:string;
    value:number;
}

function get_psuedo_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        c => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function new_game() {
    let x_size = 4;
    let y_size = 4;

    board = new Board(x_size, y_size);
    board.add_new_number();
    board.add_new_number();
    board.draw();
}
function main() {
    document.onkeydown = input_handling;
    new_game();
}


main();
