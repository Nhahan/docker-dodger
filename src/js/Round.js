import Phaser from 'phaser';

import player from '@/images/player.png';

export default class Round extends Phaser.Scene {

    constructor() {
        super('round');
    }

    preload() {
        this.load.image('player', player);
    }

    create() {
        this.player = this.add.image(400, 300, 'player');
    }

    update() {
    }

    ending(text) {
    }

    //게임오버
    gameOver() {
    }

    //게임클리어
    gameClear() {
    }

    destroyUnit(target) {
    }

    addScore(value) {
    }

}