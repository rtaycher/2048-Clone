/**
 * Created by roma on 5/22/16.
 */

enum Direction {
    Left,
    Right,
    Up,
    Down
}

function arraysEqualHack(arr1, arr2) {
    return JSON.stringify(arr1)==JSON.stringify(arr2);
}

function is_truthy(val) {
    if (val) {
        return true;
    } else {
        return false;
    }
}

function sum(array) {
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
        el.className=el.className.replace(reg, ' ')
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const colors = ["White", "LightGrey","DarkGrey", "Yellow", "LightSalmon","Orangered", "Gold", "Red", "LightCoral", "RoyalBlue", "Black", "Blue", "Black", "LimeGreen", "MistyRose","Brown","Purple"];
class Board {

    constructor(x_size, y_size) {
        this.array = [];
        this.x_size = x_size;
        this.y_size = y_size;
    }

    get_score(): number {
        return sum(this.array);
    }

    get_index(x:number, y:number) {
        return (y * this.x_size) + x;
    }

    add_new_number() {
        if (this.array.filter(x => !!x).length === this.x_size * this.y_size) {
            console.warn("board is full");
            return;
        }

        let index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        while (this.array[index].value) {
            index = getRandomIntInclusive(0, this.x_size * this.y_size - 1);
        }
        this.array[index] = {value:2, combined_this_turn:false};

    }

    try_move(direction, x, y) {
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
        let value_at_old_location = this.array[old_location_index].value;
        let value_at_new_location = this.array[new_location_index].value;
        if (value_at_old_location === value_at_new_location) {
            this.array[old_location_index].value = null;
            this.array[new_location_index].value = value_at_old_location + value_at_new_location;
            this.array[old_location_index]
        } else if (!value_at_new_location) {
            this.array[old_location_index].value = null;
            this.array[new_location_index].value = value_at_old_location;
        }
    }
    game_is_won() {
        return this.array.some(x => x >= 2048);
    }
    can_make_move() {
        let old_array = this.array.slice();

        this.shift_board(Direction.Up)
        this.shift_board(Direction.Down)
        this.shift_board(Direction.Left)
        this.shift_board(Direction.Right)
        if (arraysEqualHack(this.array, old_array))
        {
            return false;
        }
        this.array = old_array;

        return true;
    }
    shift_board(direction) {

        if (direction === Direction.Left) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = this.x_size - 1; x > 0; x--) {
                    console.info(`Left x,y: ${x} ${y}`);
                    this.try_move(direction, x, y);
                }
            }
        } else if (direction === Direction.Right) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = 0; x < this.x_size; x++) {
                    console.info(`Right x,y: ${x} ${y}`);
                    this.try_move(direction, x, y);
                }
            }
        } else if (direction === Direction.Up) {
            for (let y = this.y_size-1; y > 0; y--) {
                for (let x = 0; x < this.x_size; x++) {
                    console.info(`Up x,y: ${x} ${y}`);
                    this.try_move(direction, x, y);
                }
            }
        } else if (direction === Direction.Down) {
            for (let y = 0; y < this.y_size; y++) {
                for (let x = 0; x < this.x_size; x++) {
                    console.info(`Down x,y: ${x} ${y}`);
                    this.try_move(direction, x, y);
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
                cell.innerHTML = (this.array[this.get_index(x, y)].value || "").toString();
                if(this.array[this.get_index(x, y)].value) {
                    removeClass(cell, "transparent");
                } else {
                    addClass(cell, "transparent");
                }
                if (this.get_index(x, y)) {
                    cell.style.backgroundColor = colors[this.array[this.get_index(x, y)].value];
                }
                row.appendChild(cell);
                i++;
            }
            game.appendChild(row);
        }
        document.getElementById("game-score").innerHTML = this.get_score().toString();
        if (this.game_is_won() ) {
            if (this.can_make_move()) {
                document.getElementById("game-status").innerHTML = "Game Won!";
            } else {
                document.getElementById("game-status").innerHTML = "Game Won! No more moves can be made";
            }
        } else if (!this.can_make_move()) {
            document.getElementById("game-status").innerHTML = "No More moves can be made. Game Lost!";
        }
        else{
            document.getElementById("game-status").innerHTML = "";
        }
    }

    points: number;
    array: number[];
    x_size: number;
    y_size: number;
}

function input_handling(event) {
    if (!window.board.game_won) {
        switch (event.keyCode) {
            case 72: // h
            case 65: // a
            case 37: // Left Arrow
                window.board.shift_board(Direction.Left);
                console.log("Left key is pressed");
                window.board.add_new_number();
                break;
            case 75: // k
            case 87: // w
            case 38: // Up Arrow
                window.board.shift_board(Direction.Up);
                console.log("Up key is pressed");
                window.board.add_new_number();
                break;
            case 76: // l
            case 68: // d
            case 39:  // Right Arrow
                window.board.shift_board(Direction.Right);
                console.log("Right key is pressed");
                window.board.add_new_number();
                break;
            case 74: // j
            case 83: // s
            case 40: // Down Arrow
                window.board.shift_board(Direction.Down);
                console.log("Down key is pressed");
                window.board.add_new_number();
                break;
        }
    }
    window.board.draw();
}

interface Window { board:any;
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
