export class Cat {
    constructor(scena, name, type) {
        this.scene = scena;
        this.type = type;
        this.name = name;
        var s = '/resources/game/Entities/Cats/' + type + '/' + name + '.png';
        this.scene.load.image(name, s);
        this.state = 'NORMAL';
    }

    create(bg) {
        var x = Phaser.Math.Between(100, bg.displayWidth - 150);
        var y = Phaser.Math.Between(bg.displayHeight - 300, bg.displayHeight - 200);
        this.cat = this.scene.physics.add.image(x, y, this.name);
        this.textName = this.scene.add.text(this.cat.x, this.cat.y - 25, this.name, {
            fontSize: '20px',
            fill: '#111',
            fontFamily: 'verdana, arial, sans-serif'
        });
        if (this.type != 'GREEN') {
            this.zone = this.scene.physics.add.image(x, y - 25, (this.type == 'RED') ? 'zoneRed' : 'zoneYellow')
            this.zone.body.allowGravity = false;
            this.action = false;
        }
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
        this.scene.physics.add.collider(this.cat, this.scene.plataforms.plat);
        if (this.zone != undefined)
            this.scene.physics.add.overlap(this.zone, this.scene.player.player, this.approach, null, this);
        this.cat.setCollideWorldBounds(true);
    }

    update() {
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
                    if(!this.action) this.cat.setVelocity(0);
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
                    if(!this.action) this.cat.setVelocity(0);
                }, [], this);
                break;
        }

        this.moveTimer.delay = Phaser.Math.Between(3000, 6000);
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
        this.stateTimer.delay = Phaser.Math.Between(3000, 10000);
    }

    approach(zone, player) {
        var xVel = player.body.velocity.x;
        if (xVel > 80 | xVel < -80) {
            if (this.type == 'YELLOW') {
                this.action = true;
                this.cat.setVelocity((player.x < zone.x)?300:-300,-300);
                this.scene.time.delayedCall(1000, () => {
                    this.action = false;
                }, [], this);
            }else{
                this.scene.judge.restPoints(10)
            }
        }
    }
}