import Phaser from 'phaser';

import background from '@/images/background.jpeg';
import logo from '@/images/logo.png';

export default class Loading extends Phaser.Scene {

    constructor() {
        super('loading');
    }

    preload() {
        this.load.image('logo', logo);
        this.load.image('background', background);
    }

    create() {
        const {x, y, width, height} = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, 'background')
            .setOrigin(0).setScrollFactor(0, 1);

        const center = {
            x: x + width / 2,
            y: y + height / 2
        };
        const mainLogo = this.logo = this.add.image(center.x, center.y, 'logo')
            .setOrigin();
        mainLogo.scale = 0.5;

        const titleFontSize = Math.max(50, 120 * width / 1920);
        const clickToStartFontSize = Math.max(35, 75 * width / 1920);

        this.title = this.add.text(
            center.x,
            height / 5,
            'Dodging Docker'
        )
            .setFontFamily('Orbitron')
            .setFill("#fff")
            .setFontSize(titleFontSize*1.25)
            .setOrigin(0.5)
            .setDepth(999)
            .setAlign('center');

        this.clickToStart = this.add.text(
            center.x,
            height * 4 / 5,
            'Press any key to start'
        )
            .setFill("#fff")
            .setFontFamily('Orbitron')
            .setFontSize(clickToStartFontSize)
            .setOrigin(0.5)
            .setDepth(999)
            .setAlign('center');

        this.tweens.add({
            targets: this.clickToStart,
            alpha: 0,
            duration: 1000,
            repeat: -1,
            yoyo: true,
            ease: 'EaseInOut',
        });

        this.input.on('pointerdown', () => {
            this.scene.transition({ target: 'round', duration: 500 });
        });
    }

}