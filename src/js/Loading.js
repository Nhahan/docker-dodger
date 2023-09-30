import Phaser from 'phaser';

import background from '@/images/background.jpeg';
import logo from '@/images/logo.png';
import description from '@/images/description.png'

export default class Loading extends Phaser.Scene {

    constructor() {
        super('loading');
    }

    preload() {
        this.load.image('logo', logo);
        this.load.image('background', background);
        this.load.image('description', description);
    }

    create() {
        const {x, y, width, height} = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, 'background')
            .setOrigin(0).setScrollFactor(0, 1);

        const center = {
            x: x + width / 2,
            y: y + height / 2
        };
        const mainLogo = this.add.image(center.x, center.y -70, 'logo').setOrigin();
        mainLogo.scale = 0.5;

        const mainDescription = this.add.image(center.x, center.y + 125, 'description').setOrigin()
        mainDescription.scale = 0.65;

        const titleFontSize = Math.max(50, 120 * width / 1920);
        const clickToStartFontSize = Math.max(35, 75 * width / 1920);

        this.title = this.add.text(
            center.x,
            height / 6,
            'Docker Dodger'
        )
            .setFontFamily('Orbitron')
            .setFill("#fff")
            .setFontSize(titleFontSize * 1.25)
            .setOrigin(0.5)
            .setDepth(999)
            .setAlign('center');

        this.clickToStart = this.add.text(
            center.x,
            height * 5 / 6,
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

        this.input.keyboard.once('keydown', () => {
            this.scene.transition({target: 'round', duration: 500});
        });
        this.input.once('pointerdown', () => {
            this.scene.transition({target: 'round', duration: 500});
        });
    }

}