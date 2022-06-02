class Rock {

    constructor(x, y) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = 0;
        this.symbol = symbols.wall;
        this.fog = true;
        this.eaten = false;
    }

    display() {

        if (this.eaten) {
            fill(palette.black);
            rect(this.x, this.y, cellSize+1);
            return;
        }
        fill(palette.wall);
        rect(this.x, this.y, cellSize+1);

        fill(palette.black);

        textSize(cellSize * 0.7);
        text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2 + 2);
    }
}