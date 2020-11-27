/**
 * Escena que representa la ventana donde se indica la lista de jugadores en la partida
 */
export class PlayersInfo extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayersInfo' });
    }

    init(data) {
        this.playerList = data.playerList;
        this.NAME = data.NAME;
    }

    preload() {
        this.load.image('pauseMenu', '/resources/game/menu.png');
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.pKey.isUp = false;
    }
    
    create() {
        this.background = this.add.image(400, 300, 'pauseMenu').setScrollFactor(0, 0).setVisible(true);
        this.add.text(130, 50, this.NAME, {
            fontSize: '30px',
            fill: '#FF0000',
            fontFamily: 'pixel'
        });
        var i = 1, j = 0;
        this.playerList.forEach(player => {
            var text = this.add.text(130 + 270 * j, 50 + 30 * i, player, {
                fontSize: '30px',
                fill: '#FFFFFF',
                fontFamily: 'pixel'
            });
            i++;
            if (i == 14) {
                j = 1;
                i = 0;
            }
        });
    }

    update() {
        if (this.pKey.isUp) {
            this.scene.stop();
        }
    }
}