export class Cat {
    constructor(scena, name, type) {
        this.scene = scena;
        this.type = type;
        this.name = name;
        switch (this.type) {
            case 'GREEN':
                this.color = '#23FF00';
                break;
            case 'YELLOW':
                this.color = '#FFFB00';
                break;
            default:
                this.color = '#FF2D00';
                break;
        }
        var s = '/resources/game/Entities/Cats/' + type + '/' + name + '.png';
        this.scene.load.image(name, s);
        this.state = 'NORMAL';
        if (this.scene.socket != undefined) {
            this.scene.socket.emit("newCat", {
                password: this.scene.socket.id,
                name: this.name,
                type: this.type,
                state: 'NORMAL',
                x: 100,
                y: 600
            });
        }
        this.mindlessCat = false;
        if (this.scene.socket != undefined) {
            this.scene.socket.on("mindlessCat", () => {
                this.mindlessCat = true;
            });
        }
    }

    setXY(posX, posY) {
        this.cat.x = posX;
        this.cat.y = posY;
    }

    create(bg) {
        var x = Phaser.Math.Between(100, bg.displayWidth - 150);
        var y = Phaser.Math.Between(bg.displayHeight - 300, bg.displayHeight - 200);
        if (this.scene.socket != undefined) {
            this.scene.socket.emit("catPos", {
                password: this.scene.socket.id,
                name: this.name,
                x: x,
                y: y
            });
        }
        this.cat = this.scene.physics.add.image(x, y, this.name);
        if (this.type != 'GREEN') {
            this.zone = this.scene.physics.add.image(x, y - 25, (this.type == 'RED') ? 'zoneRed' : 'zoneYellow')
            this.zone.body.allowGravity = false;
            this.action = false;
        }
        this.textName = this.scene.add.text(this.cat.x, this.cat.y - 25, this.name, {
            fontSize: '40px',
            fill: '#111',
            fontFamily: 'pixel'
        });
        if (!this.mindlessCat) {
            this.stateTimer = this.scene.time.addEvent(
                {
                    delay: Phaser.Math.Between(3000, 10000),
                    callback: this.stateChange,
                    callbackScope: this,
                    loop: true
                });
            this.moveTimer = this.scene.time.addEvent(
                {
                    delay: Phaser.Math.Between(3000, 6000),
                    callback: this.move,
                    callbackScope: this,
                    loop: true
                });
        }

        this.plateCoord = {}
        this.scene.plates.forEach(plato => {
            this.plateCoord[plato.type] = {
                x: plato.plate.x,
                y: plato.plate.y
            }
        });

        this.scene.physics.add.collider(this.cat, this.scene.plataforms.plat);
        if (this.zone != undefined)
            this.scene.physics.add.overlap(this.zone, this.scene.player.player, this.approach, null, this);
        this.scene.physics.add.overlap(this.cat, this.scene.player.player, this.toolAndCat, () => { return this.scene.player.eKey.isDown }, this);

        this.scene.plates.forEach(plate => {
            var plato = plate.plate;
            this.scene.physics.add.overlap(this.cat, plato, (cat, plato) => {
                var p = this.plateByCoord(plato.x)
                if (p.full &
                    ((this.state == 'HUNGRY' & p.type == 'FOOD') |
                        (this.state == 'THIRSTY' & p.type == 'WATER'))) {
                    p.use();
                    cat.setVelocityX(0);
                    this.state = 'NORMAL';
                }
            }, null, this);
        });
        this.cat.setCollideWorldBounds(true);
    }

    update() {
        if (!this.mindlessCat & this.scene.socket != undefined) {
            this.scene.socket.emit("catUpdate", {
                name: this.name,
                x: this.cat.x,
                y: this.cat.y,
                state: this.state
            });
        }
        if (this.zone != undefined) {
            this.zone.x = this.cat.x;
            this.zone.y = this.cat.y - 25
        }

        if (this.textName.x != this.cat.x - 20)
            this.textName.x = this.cat.x - 20;
        if (this.textName.y != this.cat.y - this.cat.displayHeight / 2 - 21)
            this.textName.y = this.cat.y - this.cat.displayHeight / 2 - 21;


    }

    move() {
        if (this.state != 'HUNGRY' & this.state != 'THIRSTY') {
            var choose = Phaser.Math.Between(0, 1);
            switch (this.type) {
                case 'GREEN':
                    this.cat.setVelocityX((choose == 1) ? 200 : -200);
                    if (this.cat.body.onWall() | this.cat.body.checkWorldBounds()) {
                        this.cat.setVelocityY(250);
                        this.scene.time.delayedCall(100, () => {
                            if (this.cat.body.checkWorldBounds()) {
                                this.cat.setVelocityX((choose == 1) ? -200 : 200);
                            }
                        }, [], this);
                    }

                    this.scene.time.delayedCall(1200, () => {
                        this.cat.setVelocity(0);
                    }, [], this);
                    break;
                case 'YELLOW':
                    this.cat.setVelocityX((choose == 1) ? 200 : -200);
                    if (this.cat.body.onWall() | this.cat.body.checkWorldBounds()) {
                        this.cat.setVelocityY(250);
                        this.scene.time.delayedCall(100, () => {
                            if (this.cat.body.checkWorldBounds()) {
                                this.cat.setVelocityX((choose == 1) ? -200 : 200);
                            }
                        }, [], this);
                    }

                    this.scene.time.delayedCall(1200, () => {
                        if (!this.action) this.cat.setVelocity(0);
                    }, [], this);
                    break;
                case 'RED':
                    this.cat.setVelocityX((choose == 1) ? 200 : -200);
                    if (this.cat.body.onWall() | this.cat.body.checkWorldBounds()) {
                        this.cat.setVelocityY(250);
                        this.scene.time.delayedCall(100, () => {
                            if (this.cat.body.checkWorldBounds()) {
                                this.cat.setVelocityX((choose == 1) ? -200 : 200);
                            }
                        }, [], this);
                    }

                    this.scene.time.delayedCall(1200, () => {
                        if (!this.action) this.cat.setVelocity(0);
                    }, [], this);
                    break;
            }

            this.moveTimer.delay = Phaser.Math.Between(3000, 6000);
        } else {
            var t = (this.state == 'HUNGRY') ? 'FOOD' : 'WATER';
            this.cat.setVelocityX((this.plateCoord[t].x > this.cat.x) ? 200 : -200);
            this.moveTimer.delay = Phaser.Math.Between(3000, 6000);
        }
    }

    stateChange() {
        this.stateTimer
        var p = Phaser.Math.Between(0, 4);
        if (this.state == 'NORMAL') {
            switch (p) {
                case 0:
                    this.state = 'HUNGRY';
                    break;
                case 1:
                    this.state = 'THIRSTY';
                    break;
                case 2:
                    this.state = 'SICK';
                    break;
                case 3:
                    this.state = 'BORED';
                    break;
                default:
                    if (this.state == 'NORMAL') this.state = 'NORMAL';
                    break;
            }
        }
        this.stateTimer.delay = Phaser.Math.Between(6000, 20000);
    }

    approach(zone, player) {
        var xVel = player.body.velocity.x;
        if (xVel > 80 | xVel < -80) {
            if (this.type == 'YELLOW' & this.state != 'HUNGRY' & this.state != 'THIRSTY') {
                this.action = true;
                if (this.scene.socket != undefined)
                    this.scene.socket.emit("playerApproachCat", { name: this.name, playerX: player.x, zoneX: zone.x });
                if (!this.mindlessCat)
                    this.cat.setVelocity((player.x < zone.x) ? 300 : -300, -300);
                this.scene.time.delayedCall(1000, () => {
                    this.action = false;
                }, [], this);
            } else if (this.type == 'RED') {
                this.scene.judge.restPoints(1);
            }
        }
    }

    toolAndCat() {
        var stateChanged = false;
        var player = this.scene.player;
        switch (this.state) {
            case 'SICK':
                if (player.getTool() == 'MED') {
                    this.state = 'NORMAL';
                    player.dropTool();
                    stateChanged = true;
                }
                break;
            case 'BORED':
                if (player.getTool() == 'FUN') {
                    this.state = 'NORMAL';
                    player.dropTool();
                    stateChanged = true;
                }
                break;
        }
        if (stateChanged) {
            if (this.type == 'GREEN') this.scene.judge.addPoints(10);
            if (this.type == 'YELLOW') this.scene.judge.addPoints(15);
            if (this.type == 'RED') this.scene.judge.addPoints(30);
            if (!this.mindlessCat) {
                this.stateTimer.paused = true;
                this.scene.time.delayedCall(1000, () => {
                    this.stateTimer.paused = false;
                }, [], this);
            }
        }

    }

    plateByCoord(coord) {
        var a = null;
        this.scene.plates.forEach(plate => {
            if (plate.plate.x == coord) {
                a = plate;
            }
        });
        return a;
    }
}