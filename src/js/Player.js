import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;

        this.setTexture('player');
        this.setPosition(x, y);
        this.setDepth(6);
        this.startTime = Date.now();

        this.speed = 4;

        this.invincibleTime = 750000;
        this.flash = true;
        this.flashTimer = 0;

        this.key = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        };

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setCircle(22.8, 3.4, 3.6);

    }

    preUpdate() {
        if (this.scene.getGameOver()) return;
        this.invincibleTime -= (Date.now() - this.startTime);

        if (this.key.up.isDown) this.y -= this.speed;
        if (this.key.down.isDown) this.y += this.speed;
        if (this.key.left.isDown) this.x -= this.speed;
        if (this.key.right.isDown) this.x += this.speed;

        // 무적 상태이면 깜빡깜빡
        if (this.invincibleTime < 0) {
            this.setTint(0xffffff);
            this.speed = 4;
            return;
        }
        this.flashTimer++;
        if (this.flashTimer > 3.3) {
            this.speed = 6;
            this.flash = !this.flash;
            this.flashTimer = 0;
        }
        if (this.flash) {
            this.setTint(0xff0000);
        } else {
            this.setTint(0x00ff00);
        }
    }

    damaged() {
        if (this.invincibleTime > -5000 || this.scene.getGameOver()) return; //무적일 경우 대미지를 입지 않음
        // eslint-disable-next-line no-import-assign
        this.scene.setGameOver(true);

        this.scene.tweens.add({
            targets: this,
            duration: 3000,
            ease: 'Linear',
            tint: 0xff0000
        });
    }

    dodged() {
        if (this.scene.getGameOver()) return;
        this.startTime = Date.now();
        this.invincibleTime = 500000;
    }
}