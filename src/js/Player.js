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
        this.dodgedStack = 0;

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

        const pointer = this.scene.input.activePointer;
        if (pointer.isDown) { // 마우스
            const distance = Phaser.Math.Distance.Between(
                pointer.x, pointer.y,
                this.x, this.y,
            );
            // 떨림 보정
            if (distance > this.speed) {
                const angle = Phaser.Math.Angle.Between(
                    pointer.x, pointer.y, this.x, this.y
                );
                const dx = Math.cos(angle) * this.speed;
                const dy = Math.sin(angle) * this.speed;
                this.x -= dx;
                this.y -= dy;
            }
        } else { // 키보드
            if (this.key.up.isDown) this.y -= this.speed;
            if (this.key.down.isDown) this.y += this.speed;
            if (this.key.left.isDown) this.x -= this.speed;
            if (this.key.right.isDown) this.x += this.speed;
        }

        // 무적 상태이면 깜빡깜빡
        if (this.invincibleTime < 0) {
            this.setTint(0xffffff);
            this.setScale(1);
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
        // 무적 상태
        if (this.invincibleTime > -50000 || this.scene.getGameOver()) {
            this.scene.playImpactEffect(this.x, this.y);
            this.scene.addScore(Math.floor(Math.random() * (200 - 100 + 1)) + 100);
            return;
        }

        this.scene.playExplosionEffect(this.x, this.y);
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

        this.dodgedStack++;
        // fever
        if (this.dodgedStack >= 3) {
            this.scene.playFeverEffect(this.x, this.y);
            this.setScale(3);
            this.dodgedStack = 0;

            this.invincibleTime = 900000;
            this.scene.addScore(Math.floor(Math.random() * (200 - 100 + 1)) + 100);
            this.startTime = Date.now();
            return;
        }

        // normal
        this.scene.playDodgeEffect(this.x, this.y);

        if (this.invincibleTime > 0) {
            this.invincibleTime += 600000;
        } else {
            this.invincibleTime = 600000;
        }
        this.scene.addScore(Math.floor(Math.random() * (200 - 100 + 1)) + 100);
        this.startTime = Date.now();
    }
}