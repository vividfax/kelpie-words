class NPC {

    constructor(x, y, h, vocabSize) {

        this.x = x * cellSize;
        this.y = y * cellSize;
        this.height = h;
        this.vocabSize = vocabSize;
        this.symbol = random(symbols.people);
        this.fog = true;
        this.subject;
        this.question;
        this.asked = false;
        this.answered = false;
        this.eaten = false;

        this.generateQuestion();
    }

    generateQuestion() {

        let n = nouns;
        let v = verbs;
        let a = adjectives;

        if (this.vocabSize != -1) {
            n = nouns.slice(0, this.vocabSize);
            v = verbs.slice(0, this.vocabSize);
            a = adjectives.slice(0, this.vocabSize);
        }

        let randomInt = int(random(3));

        if (randomInt == 0) {
            this.subject = random(n);
            this.question = '"What of my ' + this.subject + '?"';
        } else if (randomInt == 1) {
            this.subject = random(v);
            this.question = '"Did I ' + this.subject + '?"';
        } else if (randomInt == 2) {
            this.subject = random(a);
            this.question = '"Was I ' + this.subject + '?"';
        }
    }

    silence() {

        this.subject = "";
        this.question = "";
        this.symbol = symbols.wall;
    }

    getTooltip() {

        player.lastNPCtalkedTo = this;

        if (!this.asked && this.subject != "") {
            return this.question + ' they ask\n press R to reply';
        } else if (this.answered) {
            return 'you say "' + player.memory + '"\nand you gain 2 ' + symbols.coin;
        } else if (this.subject != "") {
            if (player.memory == "nothing") {
                return 'you say nothing\nand they stare at you blankly';
            } else {
                return 'you say "' + player.memory + '"\nand they stare at you blankly';
            }
        }
    }

    display() {

        if (this.height == -1 && !this.eaten) {
            fill(palette.wall);
        } else if (this.height == -1 && this.eaten) {
            fill(palette.black);
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

        if (this.subject == "" || (this.eaten && this.subject == "")) return;

        if (this.height == 1 || this.height == 2 || this.height >= 5 || this.symbol == symbols.wall) {
            fill(palette.black);
        } else {
            fill(palette.white);
        }

        textSize(cellSize*0.8);

        text(this.symbol, this.x + cellSize / 2, this.y + cellSize / 2);
    }
}