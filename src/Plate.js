export class Plate {
    constructor(scena, tipe, id) {
        this.scene = scena;
        this.type = tipe;
        this.ID = id;
        this.scene.load.image('plate', '/resources/game/Entities/plate.png');
        this.scene.load.image('wPlate', '/resources/game/Entities/wPlate.png');
        this.scene.load.image('fPlate', '/resources/game/Entities/fPlate.png');
        this.full = false;
        if (scena.socket != undefined)
            this.scene.socket.emit("plateCreated", { password: scena.socket.id, ID: id, x: 100, y: 500, type: tipe, full: false })
    }

    put(x, y) {

        this.plate = this.scene.physics.add.image(x, y, 'plate');
        this.scene.physics.add.collider(this.plate, this.scene.plataforms.plat);
        if (this.scene.socket != undefined) {
            this.scene.socket.emit("platePut", { password: this.scene.socket.id, ID: this.ID, x: x, y: y });
        }
        console.log(this.scene.plates);
    }

    fill() {
        if (!this.full) {
            var t = (this.type == 'FOOD') ? 'fPlate' : 'wPlate';
            this.full = true;
            this.plate.setTexture(t);
            if (this.scene.socket != undefined) {
                this.scene.socket.emit("plateStateC", { ID: this.ID, full: true });
            }
        }
    }

    use() {
        this.full = false;
        this.plate.setTexture('plate');
        if (this.scene.socket != undefined) {
            this.scene.socket.emit("plateStateC", { ID: this.ID, full: false });
        }
    }
}