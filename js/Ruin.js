class Ruin {

    constructor(x, y) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = 0;
        this.symbol = symbols.emptyHouse;
        this.fog = true;
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
            fill(palette.white);
        }

        textSize(cellSize * 0.7);
        text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
    }
}