/**
 * Clase que administra la visualización y contante actualización de los otros jugadores en el modo
 * multijugador
 */
export class OtherP {
    /**
     * Crea un objeto OtherP que administra las imagened de los demás jugadores en escena indicada
     * @param {Phaser.Scene} scena 
     */
    constructor(scena) {
        this.scene = scena;
        this.infoPlayers = {};
        this.players = {};
        this.textPlayers = {};
        this.anims = {};
    }

    /**
     * Actualiza la lista de jugadores por la indicada
     * @param {*} players 
     */
    updateInfo(players) {
        this.infoPlayers = players;
    }

    init() {
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id];
            this.players[player.ID] = this.scene.add.sprite(player.x, player.y, player.skin, 9);
            this.textPlayers[player.ID] = this.scene.add.text(player.x, player.y / 4, player.name, {
                fontSize: '30px',
                fill: '#111',
                fontFamily: 'pixel'
            });
            this.anims[player.ID] = 'idle';
        });
    }

    update() {
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id]
            var text = this.textPlayers[id];
            if (text.x != player.x - 20)
                text.x = player.x - 20;
            if (text.y != player.y - 150 / 2 - 21)
                text.y = player.y - 150 / 2 - 21;
            this.players[id].x = player.x;
            this.players[id].y = player.y;
            if (this.anims[id] != player.animation) {
                this.anims[id] = player.animation;
                this.players[id].play(player.animation);
            }
        });
    }

    /**
     * Elimina al jugador de la escena
     * @param {String} ID 
     */
    delete(ID) {
        delete this.infoPlayers[ID];
        this.players[ID].destroy();
        delete this.players[ID];
        this.textPlayers[ID].destroy();
        delete this.textPlayers[ID];
    }
}
