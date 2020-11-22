import { ScenaP } from '/ScenaP.js';
import { Main } from '/Main.js';
import { ServerCreator } from '/ServerCreator.js';
import { MPtest } from '/MPtest.js'
import { PauseMenu } from '/PauseMenu.js';
import { PlayersInfo } from '/PlayersInfo.js';
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Main, ScenaP, ServerCreator, MPtest, PauseMenu, PlayersInfo],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
};

var game = new Phaser.Game(config);