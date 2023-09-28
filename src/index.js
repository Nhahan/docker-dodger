import '@/styles/index.css';

import Phaser from 'phaser';

import Round from '@/js/Round';

import WebFont from 'webfontloader';

WebFont.load({
    custom: {
        families: [
            'Orbitron'
        ],
        urls: [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap'
        ]
    },
    active: function () {
        new Phaser.Game(config);
    }
});

const width = 720;
const height = 720;
export const config = {
    type: Phaser.WEBGL,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: height,
    },
    // scene: [Loading, Round]
    scene: [Round]
}