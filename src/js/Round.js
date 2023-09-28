import Phaser from 'phaser';

import player from '@/images/player.png';

import shader from '@/shaders/glow.glsl';

export default class Round extends Phaser.Scene {

    constructor() {
        super('round');
    }

    preload() {
        this.load.image('player', player);

        this.load.glsl('customShader', shader);
    }

    create() {
        this.playerImage = this.add.image(400, 300, 'player');
        this.shader = this.add.shader('customShader', this.playerImage.x, this.playerImage.y, 50, 50);
        this.playerImage.mask = new Phaser.Display.Masks.BitmapMask(this, this.shader);

    }

    update() {
        this.shader.setPosition(this.playerImage.x, this.playerImage.y);
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