export class Judge {
    constructor(scena, time, maxScore) {
        this.time = time;//[0] = min  [1]= seg
        this.score = 0;
        this.maxScore = maxScore;
        this.scene = scena;
        this.finish = false;
        this.timer = this.scene.time.addEvent({ delay: 1000, callback: this.second, callbackScope: this, loop: true});
    }

    create() {
        this.timeText = this.scene.add.text(400, 50, this.time[0] + ':' + this.time[1]).setScrollFactor(0, 0);
        this.timeText.setStyle({
            fontSize: '50px',
            fontFamily: 'Arial',
            color: '#FF0000',
            align: 'center'
        });
    }

    second() {
        this.time[1]--;
        if (this.time[1] < 0) {
            this.time[1] = 59;
            this.time[0]--;
        }
        if (this.time[0] == 0 & this.time[1] == 0) {
            this.timer.paused = true;
        }
        this.timeText.setText(this.time[0] + ':' + this.time[1]);
    }

    addPoints(points) {
        this.score += points;
        if (this.score >= this.maxScore) {
            this.timer.paused = true;
        }
    }
}