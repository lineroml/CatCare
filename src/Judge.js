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
        this.scoreText = this.scene.add.text(400, 90, this.score + '/' + this.maxScore).setScrollFactor(0, 0);
        this.timeText.setStyle({
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#FF0000',
            align: 'center'
        });
        this.scoreText.setStyle({
            fontSize: '20px',
            fill: '#111',
            fontFamily: 'verdana, arial, sans-serif'
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
        this.scoreText.setText(this.score + '/' + this.maxScore);
        if (this.score >= this.maxScore) {
            this.timer.paused = true;
        }
    }

    restPoints(points){
        this.score -= points;
        this.scoreText.setText(this.score + '/' + this.maxScore);
    }
}