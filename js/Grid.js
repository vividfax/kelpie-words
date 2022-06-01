class Grid {

    constructor(w, h) {

        this.width = w;
        this.height = h;
        this.grid = this.new2dArray();
        this.mineDensity = 0.2;

        this.startingLevelWidth = 24;
        this.startingLevelHeight = 18;

        this.currentNumberOfNPCs = 0;

        this.createGrid();

        this.originalNumberOfNPCs = this.currentNumberOfNPCs;
    }

    new2dArray() {

        let arr = [...Array(this.width)].map(e => Array(this.height));

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                arr[i][j] = false;
            }
        }

        return arr;
    }

    createGrid() {

        let rocksGrid = this.generateRocks();

        rocksGrid = this.growRocks(rocksGrid);
        rocksGrid = this.growRocks(rocksGrid);
        rocksGrid = this.growRocks(rocksGrid);
        this.placeRocks(rocksGrid);


        this.generateMines();
        this.generateDeserts();
        this.generateLakes();
        this.placeLandmarks();

        this.placeEmptyCells();
        this.clearAreaAroundWalls();
        this.clearAreaAroundPoint(this.width/2, this.height/2, 2);
        this.clearAreaAroundPoint(this.width/2 - this.startingLevelWidth/2 + 1, this.height/2 - this.startingLevelHeight/2 + 1, 1);
        //this.clearAreaAroundPoint(this.width/2 - this.startingLevelWidth/2, this.height/2 - this.startingLevelHeight/2 - 14, 1);
        this.calculateHeight();

        this.placeShops();
        this.placeRuins();
        this.placeNotes();
        this.placeNPCs();
        this.clearAreaAroundPoint(this.width/2, this.height/2, 1);
        this.placeHouse();
        this.placeWalls();
        this.arrangeStartingLevel();
    }

    generateRocks() {

        let rocksGrid = this.new2dArray();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (int(random(8)) == 1) {
                    rocksGrid[i][j] = true
                } else {
                    rocksGrid[i][j] = false;
                }

                if (i > worldWidth/2 - this.startingLevelWidth && i < worldWidth/2 + this.startingLevelWidth && j > worldHeight/2 - this.startingLevelHeight && j < worldHeight/2 + this.startingLevelHeight) rocksGrid[i][j] = false;
            }
        }

        return rocksGrid;
    }

    growRocks(rocksGrid) {

        let cache = this.new2dArray();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                cache[i][j] = rocksGrid[i][j];
            }
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let numberOfNeighbours = 0;

                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {

                        if (k == 0 && l == 0) continue;

                        let x = i + k;
                        let y = j + l;

                        if (x < 0) {
                            x = this.width - 1;
                        } else if (x >= this.width) {
                            x = 0;
                        }

                        if (y < 0) {
                            y = this.height - 1;
                        } else if (y >= this.height) {
                            y = 0;
                        }

                        numberOfNeighbours += cache[x][y];
                    }
                }

                let isAlive = cache[i][j];

                if (isAlive && numberOfNeighbours <= 1) {
                    rocksGrid[i][j] = false;
                } else if (!isAlive && numberOfNeighbours > 2) {
                    rocksGrid[i][j] = true;
                }
            }
        }

        return rocksGrid;
    }

    placeRocks(rocksGrid) {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (rocksGrid[i][j]) {
                    this.grid[i][j] = new Rock(i, j);
                }
            }
        }
    }

    generateMines() {

        let mineArray = [];
        let numberOfMines = this.width*this.height * this.mineDensity;

        for (let i = 0; i < this.width * this.height; i++) {

            if (i < numberOfMines) {
                mineArray.push(true);
            } else {
                mineArray.push(false);
            }
        }

        mineArray = shuffle(mineArray);

        let place = 0;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i > this.width/2 - this.startingLevelWidth*0.28 && i < this.width/2 + this.startingLevelWidth*0.28 && j > this.height/2 - this.startingLevelHeight*0.35 && j < this.height/2 + this.startingLevelHeight*0.35) {
                    if (int(random(2.5)) == 0) {
                        this.grid[i][j] = new Mine(i, j);
                    }
                    continue;
                }

                if (i > this.width/2 - this.startingLevelWidth && i < this.width/2 + this.startingLevelWidth && j > this.height/2 - this.startingLevelHeight && j < this.height/2 + this.startingLevelHeight) {
                    if (int(random(4)) == 0) {
                        this.grid[i][j] = new Mine(i, j);
                    }
                    continue;
                }

                if (mineArray[place] == true && this.grid[i][j] instanceof Rock == false && this.grid[i][j] instanceof Shop == false) {
                    this.grid[i][j] = new Mine(i, j);
                }

                place++;
            }
        }
    }

    generateDeserts() {

        for (let i = 0; i < 400; i++) {

            let randomX = int(random(worldWidth));
            let randomY = int(random(worldHeight));
            let randomWidth = int(random(10, 60));
            let randomHeight = int(random(10, 60));

            for (let j = randomX; j < randomX + randomWidth; j++) {
                for (let k = randomY; k < randomY + randomHeight; k++) {

                    let targetX = j;
                    let targetY = k;

                    if (targetX >= worldWidth) targetX -= worldWidth;
                    if (targetY >= worldHeight) targetY -= worldHeight;

                    if (targetX > worldWidth/2 - 30 && targetX < worldWidth/2 + 30 && targetY > worldHeight/2 - 30 && targetY < worldHeight/2 + 30) continue;

                    let cell = this.grid[targetX][targetY];

                    if (cell instanceof Mine && random(2) > 1) this.grid[targetX][targetY] = false;
                }
            }
        }
    }

    generateLakes() {

        for (let i = 0; i < 400; i++) {

            let randomX = int(random(worldWidth));
            let randomY = int(random(worldHeight));
            let randomWidth = int(random(10, 30));
            let randomHeight = int(random(10, 30));

            for (let j = randomX; j < randomX + randomWidth; j++) {
                for (let k = randomY; k < randomY + randomHeight; k++) {

                    let targetX = j;
                    let targetY = k;

                    if (targetX >= worldWidth) targetX -= worldWidth;
                    if (targetY >= worldHeight) targetY -= worldHeight;

                    if (targetX > worldWidth/2 - 100 && targetX < worldWidth/2 + 100 && targetY > worldHeight/2 - 100 && targetY < worldHeight/2 + 100) continue;

                    let cell = this.grid[targetX][targetY];

                    if (cell instanceof Mine) this.grid[targetX][targetY] = false;
                }
            }
        }
    }

    placeLandmarks() {

        for (let i = 0; i < 500; i++) {

            let landmark = random(landmarks.landmarks);
            let xPositon = int(random(worldWidth));
            let yPosition = int(random(worldHeight));

            if (xPositon > worldWidth/2 - 60 && xPositon < worldWidth/2 + 60 && yPosition > worldHeight/2 - 60 && yPosition < worldHeight/2 + 60) continue;

            this.placeLandmark(landmark, xPositon, yPosition);
        }
    }

    placeLandmark(arr, x, y) {

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {

                let targetX = x+j;
                let targetY = y+i;

                if (targetX >= worldWidth) targetX -= worldWidth;
                if (targetY >= worldHeight) targetY -= worldHeight;

                if (arr[i][j] == 0) {
                    this.grid[targetX][targetY] = false;
                } else if (arr[i][j] == 1 && this.grid[targetX][targetY] instanceof Rock == false) {
                    this.grid[targetX][targetY] = new Rock(targetX, targetY);
                }
            }
        }
    }

    placeEmptyCells() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (this.grid[i][j] == false) this.grid[i][j] = new EmptyCell(i, j);
            }
        }
    }

    clearAreaAroundWalls() {

        let levelWidth = this.startingLevelWidth;
        let levelHeight = this.startingLevelHeight;
        let wallWidth = 1;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i < this.width/2 - levelWidth/2 - wallWidth || i > this.width/2 + levelWidth/2 + wallWidth) continue;
                if (j < this.height/2 - levelHeight/2 - wallWidth || j > this.height/2 + levelHeight/2 + wallWidth) continue;

                if (i < this.width/2 - levelWidth/2 || i > this.width/2 + levelWidth/2 || j < this.height/2 - levelHeight/2 || j > this.height/2 + levelHeight/2) {
                    this.clearAreaAroundPoint(i, j, 1);
                }
            }
        }
    }

    clearAreaAroundPoint(x, y, radius) {

        let notePosition = int(random(6));
        let index = 0;

        for (let i = -radius; i < radius+1; i++) {
            for (let j = -radius; j < radius+1; j++) {

                this.grid[int(x)+i][int(y)+j] = new EmptyCell(int(x)+i, int(y)+j);

                if (i == j) continue;
                if (index == notePosition && radius == 1 && x == this.width/2 && y == this.height/2) this.grid[int(x)+i][int(y)+j] = new Note(int(x)+i, int(y)+j, 0, 3);
                index++;
            }
        }
    }

    calculateHeight() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                let numberOfNeighbours = this.getNumberOfNeighbours(i , j);

                if (numberOfNeighbours != 0) {

                    if (this.grid[i][j] instanceof Rock) {
                        this.grid[i][j] = new EmptyCell(i, j);
                    }

                    this.grid[i][j].height = numberOfNeighbours;
                }
            }
        }
    }

    getNumberOfNeighbours(x, y) {

        let numberOfNeighbours = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if (i == 0 && j == 0) continue;

                let targetX = x + i;
                let targetY = y + j;

                if (targetX < 0) targetX = this.width-1;
                else if (targetX >= this.width) targetX = 0;
                if (targetY < 0) targetY = this.height-1;
                else if (targetY >= this.height) targetY = 0;

                if (this.grid[targetX][targetY] instanceof Mine) numberOfNeighbours++;
            }
        }

        if (this.grid[x][y] instanceof Mine) numberOfNeighbours++;

        return numberOfNeighbours;
    }

    clearFog(x, y) {

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                if (i == 0 && j == 0) continue;

                let targetX = x + i;
                let targetY = y + j;

                if (targetX < 0) targetX = this.width-1;
                else if (targetX >= this.width) targetX = 0;
                if (targetY < 0) targetY = this.height-1;
                else if (targetY >= this.height) targetY = 0;

                let cell = this.grid[targetX][targetY];

                if (this.grid[targetX][targetY].fog) {
                    this.grid[targetX][targetY].fog = false;

                    if (cell.height <= 0 && this.grid[targetX][targetY] instanceof Rock == false) this.clearFog(targetX, targetY);
                }
            }
        }
    }

    placeShops() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i > worldWidth/2 - 40 && i < worldWidth/2 + 40 && j > worldHeight/2 - 40 && j < worldHeight/2 + 40) continue;

                let cell = this.grid[i][j];

                if (int(random(100)) == 1 && (cell instanceof EmptyCell && cell.height == 0)) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new Shop(i, j, h, false);
                }
            }
        }
    }

    placeRuins() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i > worldWidth/2 - 40 && i < worldWidth/2 + 40 && j > worldHeight/2 - 40 && j < worldHeight/2 + 40) continue;

                let cell = this.grid[i][j];

                if (int(random(300)) == 1 && (cell instanceof EmptyCell && cell.height == 0)) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new Ruin(i, j, h);
                }
            }
        }
    }

    placeNotes() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i > worldWidth/2 - 6 && i < worldWidth/2 + 6 && j > worldHeight/2 - 6 && j < worldHeight/2 + 6) continue;

                let cell = this.grid[i][j];

                if (i > worldWidth/2 - this.startingLevelWidth/2-1 && i < worldWidth/2 + this.startingLevelWidth/2+1 && j > worldHeight/2 - this.startingLevelHeight/2-1 && j < worldHeight/2 + this.startingLevelHeight/2+1) {
                    if (int(random(4)) == 0 && cell instanceof EmptyCell && cell.height == 0) {
                        this.grid[i][j] = new Note(i, j, 0, 3);
                    }
                }

                if ((int(random(30)) == 1 && cell instanceof Rock) || ((int(random(30)) == 1 && cell instanceof EmptyCell && cell.height == 0))) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new Note(i, j, h, -1);
                }
            }
        }
    }

    placeNPCs() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (i > worldWidth/2 - 6 && i < worldWidth/2 + 6 && j > worldHeight/2 - 6 && j < worldHeight/2 + 6) continue;

                let cell = this.grid[i][j];

                if (i > worldWidth/2 - this.startingLevelWidth/2-1 && i < worldWidth/2 + this.startingLevelWidth/2+1 && j > worldHeight/2 - this.startingLevelHeight/2-1 && j < worldHeight/2 + this.startingLevelHeight/2+1) {
                    if (int(random(4)) == 0 && (cell instanceof EmptyCell && cell.height == 0)) {
                        this.grid[i][j] = new NPC(i, j, 0, 3);
                        this.currentNumberOfNPCs++;
                    }
                    continue;
                }
                if ((int(random(40)) == 1 && (cell instanceof EmptyCell && cell.height == 0)) || (cell instanceof Rock && int(random(40)) == 1)) {

                    let h = cell.height;
                    if (cell instanceof Rock) h = -1;

                    this.grid[i][j] = new NPC(i, j, h, -1);
                    this.currentNumberOfNPCs++;
                }
            }
        }
    }

    placeHouse() {

        let house = new House(int(this.width/2), int(this.height/2));
        this.grid[int(this.width/2)][int(this.height/2)] = house;
        houses.push(house);
    }

    placeWalls() {

        let levelWidth = this.startingLevelWidth;
        let levelHeight = this.startingLevelHeight;
        let wallWidth = 1;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                if (this.grid[i][j] instanceof Rock) continue;
                if (i < this.width/2 - levelWidth/2 - wallWidth || i > this.width/2 + levelWidth/2 + wallWidth) continue;
                if (j < this.height/2 - levelHeight/2 - wallWidth || j > this.height/2 + levelHeight/2 + wallWidth) continue;

                if (i < this.width/2 - levelWidth/2 || i > this.width/2 + levelWidth/2 || j < this.height/2 - levelHeight/2 || j > this.height/2 + levelHeight/2) {
                    this.grid[i][j] = new Rock(i, j);
                }
            }
        }
    }

    arrangeStartingLevel() {

        let targetX = this.width/2 - this.startingLevelWidth/2 + 1;
        let targetY = this.height/2 - this.startingLevelHeight/2 + 1;

        this.grid[targetX][targetY] = new Shop(targetX, targetY, 0, true);
        //this.grid[targetX-1][targetY-3] = new Ruin(targetX-1, targetY-3);

        // targetX = this.width/2 - this.startingLevelWidth/2;
        // targetY = this.height/2 - this.startingLevelHeight/2 - 14;

        // this.grid[targetX][targetY] = new Ruin(targetX, targetY);
    }

    reset() {

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {

                this.grid[i][j].fog = true;

                if (this.grid[i][j].eaten && this.grid[i][j] instanceof Rock == false) this.grid[i][j].eaten = false;
            }
        }

        for (let i = 0; i < houses.length; i++) {

            this.clearFog(houses[i].x/cellSize, houses[i].y/cellSize);
        }
    }

    display() {

        push();
	    translate(-cellSize/2, -cellSize/2);
        translate(-player.x * cellSize + width/2, -player.y * cellSize + height/2);

        let visibleGridWidth = int(width/cellSize/2) * 1/renderScale;
        let visibleGridHeight = int(height/cellSize/2) * 1/renderScale;

        for (let i = player.x+player.cameraX - visibleGridWidth; i < player.x+player.cameraX + visibleGridWidth+1; i++) {
            for (let j = player.y+player.cameraY - visibleGridHeight; j < player.y+player.cameraY + visibleGridHeight+1; j++) {

                let targetX = i;
                let targetY = j;

                if (targetX >= worldWidth || targetX < 0) targetX = mod(targetX, worldWidth);
                if (targetY >= worldHeight || targetY < 0)  targetY = mod(targetY, worldHeight);

                push();
                if (targetX > i) translate(-worldWidth*cellSize, 0);
                else if (targetX < i) translate(worldWidth*cellSize, 0);
                if (targetY > j) translate(0, -worldHeight*cellSize);
                else if (targetY < j) translate(0, worldHeight*cellSize);

                if (!this.grid[targetX][targetY].fog) this.grid[targetX][targetY].display();
                pop();
            }
        }

        pop();
    }
}
