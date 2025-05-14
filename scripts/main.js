import {mora_jai_data} from "./mora_jai_boxes.js"
const GRIDSIZE = 3;
const colors = [
"black", "blue", "green", "grey", "orange", "pink", "violet", "red", "white", "yellow"
]

var cur_pattern;

var board;
var corners;

function fromFlatArray(flatArray, size) {
  const board = [];
  for (let i = 0; i < flatArray.length; i += size) {
    board.push(flatArray.slice(i, i + size));
  }
  return board;
}

function renderGrid(board) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  board.forEach((row, r) => {
    row.forEach((cell_color, c) => {
      const cell = document.createElement('div');

      const number = document.createElement('span');
      number.className = 'number';
      number.textContent =  7 - r * 3 + c;

      cell.className = 'cell' + " " + cell_color;
      cell.onclick = () => handleClick(r, c);
      cell.appendChild(number)
      grid.appendChild(cell);
    });
  });

  if ((getColor(0,0) == corners[0]) & (getColor(0,2) == corners[1]) & (getColor(2,2) == corners[2]) & (getColor(2,0) == corners[3])){
    alert('Congratulations! You did it!');
  }

}

function renderCorners(corners) {
  const grid = document.getElementById('grid-container');
  document.getElementById("corner-tl").style.backgroundColor = corners[0].replace("violet", "purple");
  document.getElementById("corner-tr").style.backgroundColor = corners[1].replace("violet", "purple");
  document.getElementById("corner-br").style.backgroundColor = corners[2].replace("violet", "purple");
  document.getElementById("corner-bl").style.backgroundColor = corners[3].replace("violet", "purple");
}

function getColor(r, c) {
    if (r >= 0 && r < GRIDSIZE && c >= 0 && c < GRIDSIZE) {
        return board[r][c]
    }
}

function setColor(r, c, color) {
    if (r >= 0 && r < GRIDSIZE && c >= 0 && c < GRIDSIZE) {
        board[r][c] = color
    }
}

function setColorList(coord_list, color_list){
    coord_list.map((row_col, i) => setColor(row_col[0], row_col[1], color_list[i]));
}

function handleClick(r, c) {
    console.log(7-r*3+c)
    var cur_color = getColor(r, c);
    colorLogic(r, c, cur_color, cur_color);
    renderGrid(board)
}

function colorLogic(r, c, cur_color, logic_color){
    switch (logic_color) {
    case "black":
        var c1 = getColor(r, 0);
        var c2 = getColor(r, 1);
        var c3 = getColor(r, 2);
        setColor(r, 0, c3);
        setColor(r, 1, c1);
        setColor(r, 2, c2);
        break;
    case "blue":
        var mid_color = getColor(1, 1);
        if (mid_color !== 'blue'){
            colorLogic(r, c, cur_color, mid_color);
        }
        break;
    case "green":
        var new_r = 1;
        if (r == 0){new_r = 2;}
        else if (r == 2){new_r = 0;}

        var new_c = 1;
        if (c == 0){new_c = 2;}
        else if (c == 2){new_c = 0;}

        var swapped_color = getColor(new_r, new_c)
        setColor(new_r, new_c, cur_color)
        setColor(r, c, swapped_color)
        break;
    case "grey":
        break;
    case "orange":
        var adjacents = get_adjacents(r, c)
        var update_color = mostCommon(adjacents, cur_color)
        setColor(r, c, update_color)
        break;
    case "pink":
        var neighbors = get_neighbors(r, c)
        var neighbor_colors = neighbors.map(row_col => getColor(row_col[0], row_col[1]))
        neighbors.push(neighbors.shift());
        setColorList(neighbors, neighbor_colors)
        break;
    case "violet":
        if (r == 2){break;}
        var color = getColor(r+1, c)
        setColor(r+1, c, cur_color)
        setColor(r, c, color)
        break;
    case "red":
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] == 'white'){board[row][col] = "black"}
                else if (board[row][col] == 'black'){board[row][col] = cur_color}
            }
        }
        break;
    case "white":
        var adjacents = get_adjacents(r, c)
        for (const adj of adjacents){
            if ("grey" == getColor(adj[0], adj[1])){
                setColor(adj[0], adj[1], cur_color)
            }
            else if (cur_color == getColor(adj[0], adj[1])){
                setColor(adj[0], adj[1], "grey")
            }
        }
        setColor(r, c, "grey")
        break;
    case "yellow":
        if (r == 0){break;}
        var color = getColor(r-1, c)
        setColor(r-1, c, cur_color)
        setColor(r, c, color)
        break;
    }
}

function get_adjacents(r, c){
    var adjacents = [[r - 1, c],
                    [r, c + 1],
                    [r + 1, c],
                    [r, c - 1]];
    adjacents = adjacents.filter(value =>  (value[0] >= 0 && value[0] < GRIDSIZE && value[1] >= 0 && value[1] < GRIDSIZE));
    return adjacents
}

function mostCommon(adjacents, default_color) {
  const adjacent_colors = adjacents.map(row_col => getColor(row_col[0], row_col[1]))
  const counts = adjacent_colors.reduce((acc, val) => (acc[val] = (acc[val] || 0) + 1, acc), {});
  const entries = Object.entries(counts);
  const max = Math.max(...entries.map(([_, count]) => count));
  const top = entries.filter(([_, count]) => count === max);

  return top.length === 1 ? top[0][0] : default_color;
}

function get_neighbors(r, c){
    var neighbors = [[r - 1, c - 1],
                    [r - 1, c],
                    [r - 1, c + 1],
                    [r, c + 1],
                    [r + 1, c + 1],
                    [r + 1, c],
                    [r + 1, c - 1],
                    [r, c - 1]];
    neighbors = neighbors.filter(value =>  (value[0] >= 0 && value[0] < GRIDSIZE && value[1] >= 0 && value[1] < GRIDSIZE));
    return neighbors
}

function random_pattern(){
    var new_pattern = mora_jai_data[Math.floor(Math.random() * mora_jai_data.length)].pattern;
    document.getElementById('pattern-input').value = new_pattern;
    cur_pattern = new_pattern;
    reset_pattern()
}

function apply_pattern(){
    const pattern_str = document.getElementById('pattern-input').value.toLowerCase();
    const pattern_list = pattern_str.split(" ")
    if (pattern_list.length !== 13){
        alert("Invalid Pattern: you need 13 colors, see pattern rules below.")
        return;
    }

    for (const pattern of pattern_list){
        if (!colors.includes(pattern)){
            alert("Invalid Pattern: " + pattern + " is not a recognized color please use the color shown under game rules")
            return;
        }
    }

    cur_pattern = pattern_str;
    reset_pattern()
}

function reset_pattern(){
    const pattern_list = cur_pattern.split(" ")
    board = fromFlatArray(pattern_list.slice(0, 9), GRIDSIZE)
    corners = pattern_list.slice(9, 13);
    renderCorners(corners)
    renderGrid(board);
}


function init_pattern_div(){
    const kp_div = document.getElementById('known-patterns-div')
    kp_div.innerHTML = '';
    mora_jai_data.forEach(box => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.textContent = box.location;
      div.onclick = () => load_pattern(box);
      kp_div.appendChild(div);
    });
}
function load_pattern(box){
    document.getElementById('pattern-input').value = box.pattern

    const solution_div = document.getElementById('solution-div');
    solution_div.innerHTML = '';

    if (box.solution.length !== 0){
        const p = document.createElement('p');
        p.textContent = 'solution: ';

        const span = document.createElement('span');
        span.className = 'censored solution';
        span.textContent = box.solution;
        span.onclick = () => span.classList.remove("censored");

        p.appendChild(span);
        solution_div.appendChild(p)
    }

    apply_pattern()
}

document.addEventListener("DOMContentLoaded", () => {
    init_pattern_div();
    load_pattern(mora_jai_data[0]);

    document.getElementById('apply-pattern-btn').addEventListener('click', () => {
        console.log("Start clicked");
        apply_pattern()
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        console.log("Reset clicked");
        reset_pattern()
    });

    document.getElementById('random-btn').addEventListener('click', () => {
        console.log("Reset clicked");
        random_pattern()
    });

    document.getElementById('blur-btn').addEventListener('click', () => {
        document.getElementById('known-patterns-div').classList.toggle("censored");
    });

    document.getElementById('blur-game-rule-btn').addEventListener('click', () => {
        document.getElementById('rule-ul').classList.toggle("censored");
    });



});