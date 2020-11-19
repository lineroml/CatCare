export class OtherP {
    constructor(scena) {
        this.scene = scena;
        this.infoPlayers = {};
        this.players = {};
        this.textPlayers = {};
    }

    updateInfo(players) {
        this.infoPlayers = players;
    }

    init() {
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id];
            this.players[player.ID] = this.scene.add.image(player.x, player.y, player.skin);
            this.textPlayers[player.ID] = this.scene.add.text(player.x, player.y / 4, player.tool, {
                fontSize: '20px',
                fill: '#111',
                fontFamily: 'verdana, arial, sans-serif'
            });
        });
    }

    update() {
        Object.keys(this.infoPlayers).forEach(id => {
            var player = this.infoPlayers[id]
            var text = this.textPlayers[id];
            text.setText(player.tool);
            if (text.x != player.x - 20)
                text.x = player.x - 20;
            if (text.y != player.y - 150 / 2 - 21)
                text.y = player.y - 150 / 2 - 21;
            this.players[id].x = player.x;
            this.players[id].y = player.y;
            this.players[id].tool = player.tool;
        });
    }

    delete(ID){
        delete this.infoPlayers[ID];
        this.players[ID].destroy();
        delete this.players[ID];
        this.textPlayers[ID].destroy();
        delete this.textPlayers[ID];
    }
}
