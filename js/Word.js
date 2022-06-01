class Word {

    constructor(word) {

        this.word = word;
        this.x = width - width/10;
        this.y = random(30, 50);
        this.bold = false;
        this.drag = false;
    }

    display() {

        push();

        if (this.bold) {
            fill(palette.white);
            textStyle(BOLD);
        } else {
            fill(palette.river);
            textStyle(NORMAL);
        }

        textSize((windowWidth/110));
        text(this.word, this.x, this.y);

        pop();
    }

    highlight() {

        this.bold = true;
        player.memory = this.word;
    }

    lowlight() {

        this.bold = false;
    }

    intersect(x, y) {
        let radius = 3;

        let xIntersect = x > this.x - textWidth(this.word)/2 - radius && x < this.x + textWidth(this.word)/2 + radius;
        let yIntersect = y > this.y - textSize(this.word)/2 - radius && y < this.y + textSize(this.word)/2 + radius;

        if (xIntersect && yIntersect) {
            return true;
        }
    }
}
