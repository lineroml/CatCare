import { ScenaP } from '/ScenaP.js';
import {Main} from '/Main.js';
import { ServerCreator } from '/ServerCreator.js';
import { MPtest } from '/MPtest.js'
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Main,ScenaP,ServerCreator,MPtest],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);