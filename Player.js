import { Tool } from './Tool.js';

export class Player {
    constructor(scena) {
        this.scene = scena;
        this.scene.load.image('player', './resources/game/player.png');
        this.cursors = scena.input.keyboard.createCursorKeys();
        this.cKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.tool = new Tool(this.scene);
    }

    create(plat) {

        this.player = this.scene.physics.add.image(26, 600, 'player');
        this.player.setCollideWorldBounds(true);


        this.scene.physics.add.collider(plat, this.player, () => this.jump(), null, this);


        this.scene.physics.add.overlap(this.scene.shelter.food, this.player, this.pickUpFood, () => this.eKey.isDown, this);
        this.scene.physics.add.overlap(this.scene.shelter.water, this.player, this.pickUpWater, () => this.eKey.isDown, this);
        this.scene.physics.add.overlap(this.scene.shelter.med, this.player, this.pickUpMed, () => this.eKey.isDown, this);
        this.scene.physics.add.overlap(this.scene.shelter.fun, this.player, this.pickUpFun, () => this.eKey.isDown, this);

        for (let i = 0; i < this.scene.plates.length; i++) {
            var pla = this.scene.plates[i].plate;
            this.scene.physics.add.overlap(pla, this.player, this.toolAndPlate, ()=>this.eKey.isDown, this);
        }



        this.text = this.scene.add.text(this.player.x, this.player.y - this.player.displayHeight / 2, this.tool.selectedTool, {
            fontSize: '20px',
            fill: '#111',
            fontFamily: 'verdana, arial, sans-serif'
        });

    }

    update() {
        this.move()

        if (this.dKey.isDown)
            this.tool.dropTool();

        this.text.setText(this.tool.selectedTool);
        if (this.text.x != this.player.x - 20)
            this.text.x = this.player.x - 20;
        if (this.text.y != this.player.y - this.player.displayHeight)
            this.text.y = this.player.y - this.player.displayHeight;
    }

    jump() {
        if (this.cKey.isUp & this.cursors.up.isDown) {
            this.player.setVelocityY(-250);//puede saltar 100px
        }
    }


    move() {
        if (this.cKey.isUp) {
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

    toolAndPlate(plate, player) {
        var tempPlate = this.selectedPlate(plate);
        if ( this.tool.selectedTool == tempPlate.type) {
            tempPlate.fill();;
            this.tool.selectedTool = undefined;
        }

    }

    pickUpFood(player, group) {
        this.tool.selectFood();
    }

    pickUpWater(player, group) {
        this.tool.selectWater();
    }

    pickUpMed(player, group) {
        this.tool.selectMed();
    }

    pickUpFun(player, group) {
        this.tool.selectFun();
    }

    selectedPlate(plate) {
        for (let i = 0; i < this.scene.plates.length; i++) {
            if (this.scene.plates[i].plate == plate) return this.scene.plates[i];
        }
    }

}