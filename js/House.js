class House {

    constructor(x, y) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.w = 9;
        this.h = 6;
        this.height = 0;
        this.symbol = symbols.house;
        this.fog = false;
    }

    generateRoom() {

        this.generatedRoom = true;

        this.grid = [...Array(this.w)].map(e => Array(this.h));

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (i == 0 || i == this.w-1 || j == 0 || j == this.h-1 ) {
                    this.grid[i][j] = new Rock(i, j);
                } else {
                    this.grid[i][j] = new EmptyCell(i, j);
                    this.grid[i][j].height = this.height;
                }
            }
        }

        this.grid[4][1].symbol = symbols.bed;
        this.grid[4][3].symbol = symbols.map;
        this.grid[4][4].symbol = symbols.door;
    }

    display() {

        if (this.height == -1) {
            fill(palette.wall);
        } else if (this.height == 0) {
            fill(palette.water);
        } else if (this.height == 1) {
            fill(palette.sand);
        } else if (this.height == 2) {
            fill(palette.grass);
        } else if (this.height == 3) {
            fill(palette.trees);
        } else if (this.height == 4) {
            fill(palette.mountain);
        } else if (this.height >= 5) {
            fill(palette.snow);
        }

        rect(this.x, this.y, cellSize+1);

        if (this.height == 1 || this.height == 2 || this.height >= 5) {
            fill(palette.black);
        } else {
            fill(palette.trueBlack);
        }

        textSize(cellSize * 0.7);
        text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
    }

    displayRoom() {

        if (!this.generatedRoom) this.generateRoom();

        push();
        translate(-this.w/2 * cellSize + width/2, -this.h/2 * cellSize + height/2);

        background(palette.black);
        textSize(cellSize * 0.7);

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {

                if (this.grid[i][j] instanceof Rock) continue;

                this.grid[i][j].display();
            }
        }
        pop();
    }
}