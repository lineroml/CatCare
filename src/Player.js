import { Tool } from '/Tool.js';

export class Player {
    constructor(scena) {
        this.scene = scena;
        this.scene.load.image('player', '/resources/game/Entities/player.png');
        this.cursors = scena.input.keyboard.createCursorKeys();
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.tabKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
        this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.pKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.tool = new Tool(this.scene);
    }

    create(plat) {
        this.paused = false;
        this.player = this.scene.physics.add.image(26, Phaser.Math.Between(300, 600), 'player');
        this.player.setCollideWorldBounds(true);


        this.scene.physics.add.collider(plat, this.player, () => this.jump(), null, this);


        if (this.scene.shelter != undefined) {
            this.scene.physics.add.overlap(this.scene.shelter.food, this.player, this.pickUpFood, () => this.eKey.isDown, this);
            this.scene.physics.add.overlap(this.scene.shelter.water, this.player, this.pickUpWater, () => this.eKey.isDown, this);
            this.scene.physics.add.overlap(this.scene.shelter.med, this.player, this.pickUpMed, () => this.eKey.isDown, this);
            this.scene.physics.add.overlap(this.scene.shelter.fun, this.player, this.pickUpFun, () => this.eKey.isDown, this);
        }
        if (this.scene.plates != undefined) {
            for (let i = 0; i < this.scene.plates.length; i++) {
                var pla = this.scene.plates[i].plate;
                this.scene.physics.add.overlap(pla, this.player, this.toolAndPlate, () => this.eKey.isDown, this);
            }
        }


        this.text = this.scene.add.text(this.player.x, this.player.y / 4, this.tool.selectedTool, {
            fontSize: '30px',
            fill: '#111',
            fontFamily: 'pixel'
        });

    }

    getTool() {
        return this.tool.selectedTool
    }

    getX() {
        return this.player.x;
    }

    getY() {
        return this.player.y;
    }

    getVelocityX() {
        return this.player.body.velocity.x;
    }

    getVelocityY() {
        return this.player.body.velocity.y
    }
    
    update() {
        this.move();

        if (this.dKey.isDown) {
            this.tool.dropTool();
        }
        if (this.paused) {
            this.paused = false;
            this.escKey.isDown = false;
            this.pKey.isDown = false;
        }
        if (this.escKey.isDown & !this.paused & this.scene.scene.key != 'main') {
            this.paused = true;
            this.scene.scene.pause();
            this.scene.scene.launch('PauseMenu', { key: this.scene.scene.key });
        }

        if (this.pKey.isDown & !this.paused & this.scene.socket != null) {
            this.paused = true;
            this.scene.scene.launch('PlayersInfo', { playerList: this.scene.playerList, ID: this.scene.socket.id })
        }


        this.text.setText(this.tool.selectedTool);
        this.text.x = this.player.x - 20;
        this.text.y = this.player.y - this.player.displayHeight / 2 - 21;
    }

    jump() {
        if (this.cursors.down.isUp & this.cursors.up.isDown) {
            this.player.setVelocityY(-250);//puede saltar 100px
        }
    }


    move() {
        if (this.cursors.down.isUp) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-180);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(180);
            } else {
                this.player.setVelocityX(0);
            }
        } else {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-75);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(75);
            } else {
                this.player.setVelocityX(0);
            }
        }
    }

    toolAndPlate(plate, _) {
        var tempPlate = this.selectedPlate(plate);
        if (this.tool.selectedTool == tempPlate.type) {
            if (tempPlate.fill()) this.tool.selectedTool = undefined;
            if (this.scene.socket != undefined) this.scene.socket.emit('changePlate');
        }

    }

    pickUpFood() {
        this.tool.selectFood();
    }

    pickUpWater() {
        this.tool.selectWater();
    }

    pickUpMed() {
        this.tool.selectMed();
    }

    pickUpFun() {
        this.tool.selectFun();
    }

    selectedPlate(plate) {
        for (let i = 0; i < this.scene.plates.length; i++) {
            if (this.scene.plates[i].plate == plate) return this.scene.plates[i];
        }
    }

    dropTool() {
        this.tool.dropTool();
    }

}