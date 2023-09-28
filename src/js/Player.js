import Phaser from 'phaser';
import Missile from './Missile';

export default class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;

        this.setTexture('player');
        this.setPosition(x, y);
        this.setDepth(6);

        this.speed = 5;

        this.invincible = false;
        this.flash = true;
        this.flashTimer = 0;

        const [cameraX, cameraY] = [scene.cameras.main.x, scene.cameras.main.y];

        this.key = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        };

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setCircle(23, 2.5, 3);
    }

    preUpdate() {
        if (this.key.up.isDown) this.y -= this.speed;
        if (this.key.down.isDown) this.y += this.speed;
        if (this.key.left.isDown) this.x -= this.speed;
        if (this.key.right.isDown) this.x += this.speed;

        // 무적 상태이면 깜빡깜빡
        if (!this.invincible) {
            this.setTint(0xffffff);
            return;
        }
        this.flashTimer++;
        if (this.flashTimer > 10) {
            this.flash = !this.flash;
            this.flashTimer = 0;
        }
        if (this.flash) {
            this.setTint(0xffffff);
        } else {
            this.setTint(0x00ff00);
        }
    }

    update() {

    }


    damaged(missile) {
        console.log('damaged');
        this.scene.destroyUnit(missile);
        if (this.invincible) return; //무적일 경우 대미지를 입지 않음

        console.log('game over');
        this.scene.gameOver();
        this.scene.destroyUnit(this);
    }

    dodged(missile) {
        console.log('dodged');
        this.invincible = true;
        setTimeout(() => {
            this.invincible = false;
        }, 2000);
    }
}