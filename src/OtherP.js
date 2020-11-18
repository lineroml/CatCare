export class OtherP {
    constructor(scena) {
        this.scene = scena;
        this.infoPlayers = {};
        this.players = {};
    }

    updateInfo(players) {
        this.infoPlayers = players;
    }

    init(){
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id];
            this.players[player.ID] = this.scene.add.image(player.x,player.y,player.skin);
        });
    }

    update() {
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id]
            this.player.setX(player.x);
            this.player.setY(player.y);
        });
    }
}
