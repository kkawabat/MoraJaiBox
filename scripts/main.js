
const GRIDSIZE = 3;
const colors = [
"black", "blue", "green", "grey", "orange", "pink", "purple", "red", "white", "yellow"
]


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
      const div = document.createElement('div');
      div.className = 'cell' + " " + cell_color;
      div.onclick = () => handleClick(r, c);
      grid.appendChild(div);
    });
  });
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
    case "purple":
        if (r == 2){break;}
        color = getColor(r+1, c)
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
        var had_grey = false;
        for (const adj of adjacents){
            if ("grey" == getColor(adj[0], adj[1])){
                setColor(adj[0], adj[1], cur_color)
                had_grey = true;
            }
        }
        setColor(r, c, "grey")
        break;
    case "yellow":
        if (r == 0){break;}
        color = getColor(r-1, c)
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



var board = fromFlatArray([ "red", "orange", "green", "blue", "pink", "black", "grey", "white", "pink"], GRIDSIZE)

renderGrid(board);
