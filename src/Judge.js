/**
 * Clase encargada de administrar el sistema de puntos y tiempo del juego
 */
export class Judge {
    /**
     * Crea un objeto Judge con un maximo en la escena indicada con un contador y un máximo puntaje
     * @param {Phaser.Scene} scena 
     * @param {integer[]} time 
     * @param {integer} maxScore 
     */
    constructor(scena, time, maxScore) {
        this.time = time;//[0] = min  [1]= seg
        this.score = 0;
        this.maxScore = maxScore;
        this.scene = scena;
        this.finish = false;
        if(this.scene.socket==undefined)
            this.timer = this.scene.time.addEvent({ delay: 1000, callback: this.second, callbackScope: this, loop: true });

    }

    create() {
        if(this.scene.socket==undefined)
            this.timeText = this.scene.add.text(400, 30, this.time[0] + ':' + this.time[1]).setScrollFactor(0, 0);
        this.scoreText = this.scene.add.text(400, 90, this.score + '/' + this.maxScore).setScrollFactor(0, 0);
        if(this.scene.socket==undefined)
            this.timeText.setStyle({
            fontSize: '80px',
            fontFamily: 'pixel',
            color: '#FF0000',
            align: 'center'
        });
        this.scoreText.setStyle({
            fontSize: '40px',
            fill: '#111',
            fontFamily: 'pixel'
        });
    }

    update() {
        if (this.finish) {
            if (this.scene.socket != undefined)
                this.scene.socket.emit("ItEnded");
        }
    }

    /**
     * Función callback que ejecuta la logica detrás del funcionamiento del reloj
     */
    second() {
        this.time[1]--;
        if (this.time[1] < 0) {
            this.time[1] = 59;
            this.time[0]--;
            if (this.scene.socket != undefined)
                this.scene.socket.emit("minutePass", { time: this.time, password: this.scene.socket.id });
        }
        if (this.time[0] == 0 & this.time[1] == 0) {
            this.timer.paused = true;
        }
        this.timeText.setText(this.time[0] + ':' + this.time[1]);
    }

    /**
     * Metodo que añade la cantidad de puntos inndicados al jugador
     * @param {integer} points 
     */
    addPoints(points) {
        this.score += points;
        this.scoreText.setText(this.score + '/' + this.maxScore);
        if (this.score >= this.maxScore) {
            if(this.scene.socket==undefined)
                this.timer.paused = true;
            this.finish = true;
        }
        if (this.scene.socket != undefined)
            this.scene.socket.emit("updatePoints", { ID: this.scene.socket.id, score: this.score });
    }

    /**
     * Metodo que resta la cantidad de puntos indicados al jugador
     * @param {integer} points 
     */
    restPoints(points) {
        this.score -= points;
        this.scoreText.setText(this.score + '/' + this.maxScore);
        if (this.scene.socket != undefined)
            this.scene.socket.emit("updatePoints", { ID: this.scene.socket.id, score: this.score });
    }
}