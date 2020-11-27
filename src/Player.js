import { Tool } from '/Tool.js';

export class Player {
    constructor(scena) {
        this.scene = scena;
        this.scene.load.spritesheet('player', '/resources/game/Entities/spriteSheetPJ.png', {
            frameWidth: 80,
            frameHeight: 150
        });
        this.cursors = scena.input.keyboard.createCursorKeys();
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.tabKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
        this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.pKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.tool = new Tool(this.scene);
        this.anime = false;
        this.animeR = false;
        this.animeL = false;
        this.jumping = false;
        this.walking = false;
    }

    create(plat, bg) {
        this.scene.anims.create({
            key: "playerRunR",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: "playerRunL",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 16, end: 19 }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jumpfallR",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 9, end: 11 }),
            frameRate: 1,
            repeat: 0
        });
        this.scene.anims.create({
            key: "jumpfallL",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 21, end: 23 }),
            frameRate: 1,
            repeat: 0
        });
        this.scene.anims.create({
            key: "playerWalkR",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "playerWalkL",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 24, end: 27 }),
            frameRate: 5,
            repeat: -1
        });


        this.paused = false;
        this.player = this.scene.physics.add.sprite(bg.displayWidth / 2, bg.displayHeight / 2, 'player', 0);
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

        this.tool.create();
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

        if (this.anime & this.jumping) {
            this.jumping = false;
            if (this.player.body.velocity.x != 0)
                this.player.play((this.player.body.velocity.x < 0) ? 'jumpfallL' : 'jumpfallR');
            else
                this.player.play('idle');
        }

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
            this.scene.scene.launch('PlayersInfo', { playerList: this.scene.playerList, NAME: this.scene.PNAME })
        }

    }

    jump() {
        if (this.anime) {
            this.anime = false;
            this.jumping = true;
            this.animeR = false;
            this.animeL = false;
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-250);//puede saltar 100px
            this.anime = true;
            this, this.jumping = true;
        }
    }


    move() {
        if (this.cursors.down.isUp) {
            if (this.cursors.left.isDown) {
                this.animeR = false;
                this.player.setVelocityX(-180);
                if (!this.animeL & !this.anime) {
                    this.player.play("playerRunL");
                    this.animeL = true;
                }
            } else if (this.cursors.right.isDown) {
                this.animeL = false;
                this.player.setVelocityX(180);
                if (!this.animeR & !this.anime) {
                    this.player.play("playerRunR");
                    this.animeR = true;
                }
            } else {
                this.player.setVelocityX(0);
                if (!this.anime) {
                    this.player.play("idle");
                    this.animeL = false;
                    this.animeR = false;
                }
            }
        } else {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-75);
                if (!this.animeL & !this.anime) {
                    this.player.play("playerWalkL");
                    this.animeL = true;
                }
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(75);
                if (!this.animeR & !this.anime) {
                    this.player.play("playerWalkR");
                    this.animeR = true;
                }
            } else {
                this.player.setVelocityX(0);
                if (!this.anime) {
                    this.player.play("idle");
                    this.animeL = false;
                    this.animeR = false;
                }
            }
        }
    }

    toolAndPlate(plate, _) {
        var tempPlate = this.selectedPlate(plate);
        if (this.tool.selectedTool == tempPlate.type) {
            if (tempPlate.fill()) this.dropTool();
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