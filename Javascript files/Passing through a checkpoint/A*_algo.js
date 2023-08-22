function a_star(diagonal,sourceArray,destinationArray) {
    console.log("Starting A*");
    let flag = false; // To check if destinationArray is found
    var openList = [];  //Array of FNode that are "Open" for eval
    var closedList = []; //Array of FNode that are "Closded" for eval

    function destinationFound(x,y){
        if(x==destinationArray[0] && y==destinationArray[1] ){   //destinationArray Found
            pathfound = true;

            var i = destinationArray[0];
            var j = destinationArray[1];
            vis.push(mapping1D(i,j,maxCols));
            cellsToAnimate.push( [destinationArray, "success"] );
            while (prevArr[i][j] != null){
                var prevCell = prevArr[i][j];
                i = prevCell[0];
                j = prevCell[1];
                cellsToAnimate.push( [[i, j], "success"] );
		    }
            flag = true;
        }
    }

    function heuristic(position0, position1) {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);
    
        return d1 + d2;
    }

    function FNode(x,y){
        this.x = x;
        this.y = y;
        this.f = 0; //total cost function
        this.g = 0; // wt or cost function from start to the current grid point
        this.h = 0; //heuristic estimated cost function from current grid point to the goal
    }

    function isContains(List,x_idx, y_idx){
        return List.some((point) => point.x === x_idx && point.y === y_idx);
    }

    function isContainsArray(List,x_idx, y_idx){
        return List.some((point) => point[0] == x_idx && point[1] == y_idx);
    }

    let dir = setDirection(diagonal);   //direction array for 8 direcrions(including diagonals)

    var vis = createVisited();   
	vis = addWalls(vis, true);  //mark walls as visited
	
	let pathfound = false;
	
	let prevArr = prevCellArray();

    let end = new FNode(destinationArray[0], destinationArray[1], 0, 0, 0);
    openList.push(new FNode(sourceArray[0], sourceArray[1], 0, 0, 0)); 
    console.log("animation starting");
    cellsToAnimate.push( [sourceArray, "searching"] );


    while(openList.length>0){
        let lowestIdx = 0;

        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIdx].f) {
              lowestIdx = i;
            }
        }
        
        let currNode = openList[lowestIdx];
        
        destinationFound(currNode.x, currNode.y);
        if(flag) break;

        openList.splice(lowestIdx, 1);
        //Adding animation
        let idx = mapping1D(currNode.x,currNode.y,maxCols);
        if(!$($("#tableHolder").find("td")[idx]).hasClass("hill") && !$($("#tableHolder").find("td")[idx]).hasClass("crater")
         && !$($("#tableHolder").find("td")[idx]).hasClass("ice") && !$($("#tableHolder").find("td")[idx]).hasClass("storm"))
        if(!vis[idx])cellsToAnimate.push( [[currNode.x,currNode.y], "visited"] );
        
        closedList.push(currNode);
        let temp = mapping1D(currNode.x,currNode.y,maxCols);
        vis.push(temp);

        for(let i=0; i<dir.length; i++){    
            let x = currNode.x + dir[i][0];
			let y = currNode.y + dir[i][1]; 

            // if(isContainsArray(isWallArr,x,y)){
            //     destinationFound(currNode.x, currNode.y);
            //     if(flag) break;
            //     if(!($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("wall")))cellsToAnimate.push( [[x,y], "visited"] );
            //     continue;
            // }

			if(x<0 || y<0 || x>=maxRows || y>=maxCols || ($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("wall"))) 
            continue;   //if x||y out of bounds or we encounter a wall


            let nbr = new FNode(x,y,0,0,0);
            let wt = 1;
            let typeOfCell = "NoWall";

            if($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("hill")){
                wt = 10;
                typeOfCell = "hill"
            }
            if($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("crater")){
                wt = 7;
                typeOfCell = "crater"
            }
            if($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("ice")){
                wt = 4;
                typeOfCell = "ice"
            }
            if($($("#tableHolder").find("td")[mapping1D(x,y,maxCols)]).hasClass("storm")){
                wt = 15;
                typeOfCell = "storm"
            }

            if(!isContains(closedList,nbr.x,nbr.y)){
                let smallestG = currNode.g + wt;
            
            
                if(!isContains(openList,nbr.x,nbr.y)){
                    openList.push(nbr);
                    if(typeOfCell=="NoWall"){
                        cellsToAnimate.push( [[nbr.x,nbr.y], "searching"]);
                    }
                    prevArr[nbr.x][nbr.y] = [currNode.x,currNode.y];
                    
                    //******************************* */
                }else if(smallestG>=nbr.g){
                    continue;
                }

                nbr.g = smallestG;
                nbr.h = heuristic(nbr,end); //****************************** */
                nbr.f = nbr.g + nbr.h;
            }    
        }
    }
    isWallArr = [];
    return pathfound;
}

