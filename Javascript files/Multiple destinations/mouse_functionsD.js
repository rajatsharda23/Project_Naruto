//************************************ 
//Mouse functions
//************************************ 

var createHill = false;
var createCrater = false;
var createIce = false;
var createStorm = false;

function hill_true() {
	createHill = document.getElementById("hillCheck").checked;
	document.getElementById("iceCheck").checked = false;
	document.getElementById("stormCheck").checked = false;
	document.getElementById("craterCheck").checked = false;
	createCrater = false;
    createIce = false;
	createStorm = false;
}

function crater_true() {
	createCrater = document.getElementById("craterCheck").checked;
	document.getElementById("iceCheck").checked = false;
	document.getElementById("stormCheck").checked = false;
	document.getElementById("hillCheck").checked = false;
	createHill = false;
    createIce = false;
	createStorm = false;
}

function ice_true() {
	createIce = document.getElementById("iceCheck").checked;
	document.getElementById("hillCheck").checked = false;
	document.getElementById("stormCheck").checked = false;
	document.getElementById("craterCheck").checked = false;
	createCrater = false;
    createHill = false;
	createStorm = false;
}

function storm_true() {
	createStorm = document.getElementById("stormCheck").checked;
	document.getElementById("iceCheck").checked = false;
	document.getElementById("hillCheck").checked = false;
	document.getElementById("craterCheck").checked = false;
	createCrater = false;
    createIce = false;
	createHill = false;
}



$("td").mousedown(function() {
    var index = $("td").index(this);
    var startCellIndex = (source[0] * (maxCols)) + source[1];
    var endCellIndex = (destination[0] * (maxCols)) + destination[1];
    var endCell1Index = (destination1[0] * (maxCols)) + destination1[1];
    if (!ongoing) {
        // Clear board if just finished
        if (justFinished && !ongoing) {
            clearBoard(keepWalls = true);
            justFinished = false;
        }
        if (index == startCellIndex) {
            movingSrc = true;
            //console.log("Now moving start!");
        } else if (index == endCellIndex) {
            movingDest = true;
            //console.log("Now moving end!");
        } else if (index == endCell1Index) {
            movingDest1 = true;
            //console.log("Now moving end!");
        } else {
            makeWalls = true;
        }
    }
});


$("td").mouseup(function() {
    makeWalls = false;
    movingSrc = false;
    movingDest = false;
    movingDest1 = false;
});


$("td").mouseenter(function() {
    if (!makeWalls && !movingSrc && !movingDest && !movingDest1) { return; }
    var index = $("td").index(this);
    var startCellIndex = (source[0] * (maxCols)) + source[1];
    var endCellIndex = (destination[0] * (maxCols)) + destination[1];
    var endCell1Index = (destination1[0] * (maxCols)) + destination1[1];
    if (!ongoing) {
        if (justFinished) {
            clearBoard(keepWalls = true);
            justFinished = false;
        }
        //console.log("Cell index = " + index);
        if (movingSrc && index != endCellIndex && index != endCell1Index) {
            moveStartOrEnd(startCellIndex, index, "start");
        } else if (movingDest && index != startCellIndex && index != endCell1Index) {
            moveStartOrEnd(endCellIndex, index, "end");
        } else if (movingDest1 && index != startCellIndex && index != endCellIndex) {
            moveStartOrEnd(endCell1Index, index, "end1");
        } else if (index != startCellIndex && index != endCellIndex && index != endCell1Index) {
            // $(this).toggleClass("wall");
            if(createHill){
				$(this).toggleClass("hill");
			}
			else if(createCrater){
				$(this).toggleClass("crater");
			}
			else if(createIce){
				$(this).toggleClass("ice");
			}
			else if(createStorm){
				$(this).toggleClass("storm");
			}
			else{
				$(this).toggleClass("wall");
			}
        } 

    }
});


$("td").click(function() {
    var index = $("td").index(this);
    var startCellIndex = (source[0] * (maxCols)) + source[1];
    var endCellIndex = (destination[0] * (maxCols)) + destination[1];
    var endCell1Index = (destination1[0] * (maxCols)) + destination1[1];
    if ((ongoing == false) && !(index == startCellIndex) && !(index == endCellIndex) && !(index == endCell1Index)) {
        if (justFinished) {
            clearBoard(keepWalls = true);
            justFinished = false;
            $(this).toggleClass("wall");
        }
        
        if(createHill){
            $(this).toggleClass("hill");
        }
        else if(createCrater){
            $(this).toggleClass("crater");
        }
        else if(createIce){
            $(this).toggleClass("ice");
        }
        else if(createStorm){
            $(this).toggleClass("storm");
        }
        else{
            $(this).toggleClass("wall");
        }	
    }
    

});


$("body").mouseup(function() {
    makeWalls = false;
    movingSrc = false;
    movingDest = false;
    movingDest1 = false;
});


$("#start").click(function() {
    if (algo == null) { return; }
    if (ongoing) { update("wait"); return; }
    beginAlgo(algo);
});

$("#clear").click(function() {
    if (ongoing) { update("wait"); return; }
    clearBoard(keepWalls = false);
});


$("#algorithms .dropdown-item").click(function() {
    if (ongoing) { update("wait"); return; }
    algo = $(this).text();
    updateStart();
    console.log("Algorithm has been changd to: " + algo);
});

$( "#speed .dropdown-item").click(function(){
	speed = $(this).text();
	getDelay(speed);
});