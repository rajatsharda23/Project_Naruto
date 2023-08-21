var maxRows = 15; //It denotes the total number of rows
var maxCols = 35; //It denotes the total number of columns
var source = [7, 10]; //It points to the source cell
var destination = [4, 30]; //It points to the destination cell
var destination1 = [4, 60]; //It points to the second destination1 cell
var movingSrc = false; //whether the source is moving or not
var movingDest = false; ////whether the destination is moving or not
var movingDest1 = false; ////whether the destination1 is moving or not
var algo = null;
var ongoing = false; //It check if the algo is in process ot not
var makeWalls = false;
var cellsToAnimate = [];
var justFinished = false;
var delay = 5;
var animationState = null;

//************************************ 
//Function to generate a grid
//************************************ 

function createGrid(maxRows, maxCols) {
    var grid = "<table>"; //access table tag
    for (row = 1; row <= maxRows; row++) {
        grid += "<tr>"; //add the table row
        for (col = 1; col <= maxCols; col++) {
            grid += "<td></td>"; //add a data cell in the table row
        }
        grid += "</tr>"; //close the row tag
    }
    grid += "</table>" //close the table tag
    return grid;
}

var matrix = createGrid(maxRows, maxCols); //calls the function to create the grid
$("#tableHolder").append(matrix); //It appends the grid generated in javaScript into Html tableHolder id


//************************************ 
//Functions to move the start and end node
//************************************ 

function moveStartOrEnd(prevIndex, newIndex, startOrEnd) {
    var updatedY = newIndex % maxCols;
    var updatedX = Math.floor((newIndex - updatedY) / maxCols);
    if (startOrEnd == "start") {
        source = [updatedX, updatedY];
        console.log("Updated source is at [" + updatedX + ", " + updatedY + "]")
    } else if (startOrEnd == "end") {
        destination = [updatedX, updatedY];
        console.log("Updated destination is at [" + updatedX + ", " + updatedY + "]")
    } else if (startOrEnd == "end1") {
        destination1 = [updatedX, updatedY];
        console.log("Updated destination1 is at [" + updatedX + ", " + updatedY + "]")
    }


    clearBoard(keepWalls = true); //if we move the nodes after running the algos then it clears the board and move the nodes
    return;
}


//************************************ 
//Function to update the start button name based on the algo chosen
//************************************ 

function updateStart() {
    if (algo == "Dijkstra") {
        $("#start").html("Search using Dijkstra");
    } else if (algo == "Breadth-First Search (BFS) with diagonals" || algo == "Breadth-First Search (BFS) without diagonals") {
        $("#start").html("Search using BFS");
    } else if (algo == "A*") {
        $("#start").html("Seach using A*");
    }
    
    return;
}

//************************************ 
//async function is used to operate asyncronously i.e independently of other functions
//This function comes into play i.e Algo starts when start button is pressed
//************************************ 

async function beginAlgo(algo) {
    ongoing = true; //Algorithm is in progress
    var pathFound = executeAlgo(); //calls the function to execute algorithm
    await animateCells(); //The await operator is used to wait for a Promise. It is used inside an async function.
    ongoing = false; //Algorith is finished
    justFinished = true;
}

//************************************ 
//Function to execute the algo
//************************************ 

function executeAlgo() {
    if (algo == "Dijkstra") {
        var pathFound = dijkstra();
    } else if (algo == "Breadth-First Search (BFS) with diagonals") {
        var pathFound = bfs(true);
    }else if(algo == "Breadth-First Search (BFS) without diagonals"){
        var pathFound = bfs(false);
    }else if(algo=="A*"){
        var pathFound = a_star(true,destination1);
        // var pathFound = a_star(true,destination);
    }
    return pathFound;
}

//************************************ 
//Function to make the wall
//************************************ 

function makeWall(cell) {
    if (!makeWalls) {
        return;
    }
    var index = $("td").index(cell);
    var row = Math.floor((index) / maxRows) + 1;
    var col = (index % maxCols) + 1;
    if ((ongoing == false) && !(row == 1 && col == 1) && !(row == maxRows && col == maxCols)) {
        $(cell).toggleClass("wall");
    }
}

//Function to make container for Glacier, Storm etc hiden iff BFS
function hideWeightedOptions(){
    $(document).ready(function(){
        $("#BFS").click(function(){
          $(".container").hide();
        });
        $("#BFSD").click(function(){
            $(".container").hide();
        })
        console.log("hidded Weighted Options");
      });
}

//Function to show the hidden Weighted Options
function showWeightedOptions(){
    $(document).ready(function(){
        // $("#Astar").click(function(){
        //   $(".container").show();
        // });
        $("#Djikstra").click(function(){
            $(".container").show();
        });
        console.log("showed Weighted options");
      });
}

hideWeightedOptions();
showWeightedOptions();


//************************************ 
function createVisited() {
    var visited = [];
    var cells = $("#tableHolder").find("td");
    for (var i = 0; i < maxRows; i++) {
        var row = [];
        for (var j = 0; j < maxCols; j++) {
            if (cellIsAWall(i, j, cells)) {
                row.push(true);
            } else {
                row.push(false);
            }
        }
        visited.push(row);
    }
    return visited;
}
//************************************ 

function cellIsAWall(i, j, cells) {
    var cellNum = (i * (maxCols)) + j;
    return $(cells[cellNum]).hasClass("wall");
}


function makeWalls() {
    var walls = [];
    for (var i = 0; i < maxRows; i++) {
        var row = [];
        for (var j = 0; j < maxCols; j++) {
            row.push(true);
        }
        walls.push(row);
    }
    return walls;
}

function neighborsThatAreWalls(neighbors, walls) {
    var neighboringWalls = 0;
    for (var k = 0; k < neighbors.length; k++) {
        var i = neighbors[k][0];
        var j = neighbors[k][1];
        if (walls[i][j]) { neighboringWalls++; }
    }
    return neighboringWalls;
}

function createDistances() {
    var distances = [];
    for (var i = 0; i < maxRows; i++) {
        var row = [];
        for (var j = 0; j < maxCols; j++) {
            row.push(Number.POSITIVE_INFINITY);
        }
        distances.push(row);
    }
    return distances;
}

function createPrev() {
    var prev = [];
    for (var i = 0; i < maxRows; i++) {
        var row = [];
        for (var j = 0; j < maxCols; j++) {
            row.push(null);
        }
        prev.push(row);
    }
    return prev;
}

function getNeighbors(i, j) {
    var neighbors = [];
    if (i > 0) { neighbors.push([i - 1, j]); }
    if (j > 0) { neighbors.push([i, j - 1]); }
    if (i < (maxRows - 1)) { neighbors.push([i + 1, j]); }
    if (j < (maxCols - 1)) { neighbors.push([i, j + 1]); }
    return neighbors;
}

async function animateCells() {
    animationState = null;
    var cells = $("#tableHolder").find("td");
    var startCellIndex = (source[0] * (maxCols)) + source[1];
    var endCellIndex = (destination[0] * (maxCols)) + destination[1];
    var endCell1Index = (destination1[0] * (maxCols)) + destination1[1];

    delay = getDelay(speed);
    for (var i = 0; i < cellsToAnimate.length; i++) {
        var cellCoordinates = cellsToAnimate[i][0];
        var x = cellCoordinates[0];
        var y = cellCoordinates[1];
        var num = (x * (maxCols)) + y;

        if (num == startCellIndex || num == endCellIndex || num == endCell1Index) { continue; }
        var cell = cells[num];
        var colorClass = cellsToAnimate[i][1];

        // Wait until its time to animate
        await new Promise(resolve => setTimeout(resolve, delay));

        $(cell).removeClass();
        $(cell).addClass(colorClass);
    }
    cellsToAnimate = [];
    //console.log("End of animation has been reached!");
    return new Promise(resolve => resolve(true));
}


function getDelay(speed){
	if(speed=="Fast")
		delay=3;
	if(speed=="Medium")
		delay=9;
	if(speed=="Slow")
		delay=20;
	console.log("Delay = " + delay);
	return delay;
}

function page_load()
{
    console.log("Move the destination nodes and the source node about the grid, before you start the algorithm visualizer!")
}

function clearBoard(keepWalls) {
    var cells = $("#tableHolder").find("td");
    var startCellIndex = (source[0] * (maxCols)) + source[1];
    var endCellIndex = (destination[0] * (maxCols)) + destination[1];
    var endCell1Index = (destination1[0] * (maxCols)) + destination1[1];
    for (var i = 0; i < cells.length; i++) {
        isWall = $(cells[i]).hasClass("wall");
        $(cells[i]).removeClass();
        if (i == startCellIndex) {
            $(cells[i]).addClass("start");
        } else if (i == endCellIndex) {
            $(cells[i]).addClass("end");
        } else if (i == endCell1Index) {
            $(cells[i]).addClass("end1");
        } else if (keepWalls && isWall) {
            $(cells[i]).addClass("wall");
        }
    }
}

function checkDiagonalWalls(i, vis, algo) {
    let cell = mapping2D(i, maxCols);
    let r = cell[0]
    let c = cell[1]
        // checks row column value will be within range
        //if down and right are walls, then we cant go to down-right
    if (r + 1 < maxRows && c + 1 < maxCols && $($("#tableHolder").find("td")[mapping1D(r + 1, c, maxCols)]).hasClass("wall") &&
        $($("#tableHolder").find("td")[mapping1D(r, c + 1, maxCols)]).hasClass("wall")){
            console.log("walls detected -> " + r+1 + " , " + c+1);
            isWallArr.push([r+1,c+1]);
            vis[mapping1D(r + 1, c + 1, maxCols)] = true;
    }
        

    //if up and right are walls, then we cant pass through it to reach up-right cell
    if (r - 1 > 0 && c + 1 < maxCols && $($("#tableHolder").find("td")[mapping1D(r - 1, c, maxCols)]).hasClass("wall") &&
        $($("#tableHolder").find("td")[mapping1D(r, c + 1, maxCols)]).hasClass("wall")){
            console.log("walls detected -> " + r-1 + " , " + c+1);
            vis[mapping1D(r - 1, c + 1, maxCols)] = true;
            isWallArr.push([r-1,c+1]);
    }
        
    
    if (r + 1 < maxRows && c - 1 > 0 && $($("#tableHolder").find("td")[mapping1D(r + 1, c, maxCols)]).hasClass("wall") &&
        $($("#tableHolder").find("td")[mapping1D(r, c - 1, maxCols)]).hasClass("wall")){
            console.log("walls detected -> " + r+1 + " , " + c-1);
            vis[mapping1D(r + 1, c - 1, maxCols)] = true;
            isWallArr.push([r+1,c-1]);
    }
        

    if (r - 1 > 0 && c - 1 > 0 && $($("#tableHolder").find("td")[mapping1D(r - 1, c, maxCols)]).hasClass("wall") &&
        $($("#tableHolder").find("td")[mapping1D(r, c - 1, maxCols)]).hasClass("wall")){
        console.log("walls detected -> " + r-1 + " , " + c-1);
        vis[mapping1D(r - 1, c - 1, maxCols)] = true;
        isWallArr.push([r-1,c-1]);
    }
}


// Ending statements
clearBoard();


document.getElementById("single").addEventListener("click", singleDestination);
document.getElementById("checkpoint").addEventListener("click", checkpoint);

function singleDestination() {
    // alert("Hello World!");
    window.location.replace("singleDestination.html");
}
function checkpoint() {
    // alert("Hello World!");
    window.location.replace("Checkpoint.html");
}


//Javascript file to include mouse functions
document.write('<script type="text/javascript" src="Javascript files/Multiple destinations/mouse_functionsD.js" ></script>');

//Javascript file to include Dijkstra algo
document.write('<script type="text/javascript" src="Javascript files/Multiple destinations/dijkstra_algoD.js" ></script>');

//Javascript file to include Dijkstra algo
document.write('<script type="text/javascript" src="Javascript files/Multiple destinations/bfs_newD.js" ></script>');

//Javascript file to include A* algo
document.write('<script type="text/javascript" src="Javascript files/Multiple destinations/A*_algo.js" ></script>');
