import { ScenaP } from './ScenaP.js';
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ScenaP],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);