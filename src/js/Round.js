import Phaser from 'phaser';

import player from '@/images/player.png';
import background from "@/images/background.jpeg";
import Player from "@/js/Player";

export default class Round extends Phaser.Scene {

    constructor() {
        super('round');
    }

    preload() {
        this.load.image('background', background);
        this.load.image('player', player);
    }

    create() {
        const {x, y, width, height} = this.cameras.main;
        //배경
        this.background = this.add.tileSprite(0, 0, width, height, 'background')
            .setOrigin(0)
            .setScrollFactor(0, 1);

        this.titleFontSize = Math.max(50, 120 * width / 1920);
        this.clickToStartFontSize = Math.max(35, 75 * width / 1920);

        const center = {
            x: x + width / 2, y: y + height / 2
        };

        this.player = new Player(
            this,
            center.x,
            height * 4 / 5
        );
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