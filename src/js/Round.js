import Phaser from 'phaser';

import player from '@/images/player.png';
import background from "@/images/background.jpeg";
import Player from '@/js/Player';
import glow1 from '@/images/glow1.gif';
import glow2 from '@/images/glow2.gif';
import Enemy from "@/js/Enemy";
import dodgeEffect from '@/images/dodgeEffect.png';
import explosionEffect from '@/images/explosionEffect.png';
import feverEffect from '@/images/feverEffect.png';
import impactEffect from '@/images/impactEffect.png';

export default class Round extends Phaser.Scene {

    constructor() {
        super('round');
    }

    preload() {
        this.load.image('background', background);
        this.load.image('player', player);
        this.load.image('glow1', glow1);
        this.load.image('glow2', glow2);
        this.load.spritesheet('dodgeEffect', dodgeEffect, {frameWidth: 120, frameHeight: 109});
        this.load.spritesheet('explosionEffect', explosionEffect, {frameWidth: 517, frameHeight: 517});
        this.load.spritesheet('feverEffect', feverEffect, {frameWidth: 427, frameHeight: 431});
        this.load.spritesheet('impactEffect', impactEffect, {frameWidth: 305, frameHeight: 383});
    }

    create() {
        this.add.image(0, 0, 'gameOverBg').setOrigin(0);

        const {x, y, width, height} = this.cameras.main;
        this.background = this.add.tileSprite(0, 0, width, height, 'background')
            .setOrigin(0)
            .setScrollFactor(0, 1);

        const center = {
            x: x + width / 2, y: y + height / 2
        };

        this.gameOver = false;
        this.restart = false;
        this.clickToRestart = this.add.text(center.x, height * 4 / 5, 'Press any key to restart')
            .setFill("#fff")
            .setFontFamily('Orbitron')
            .setFontSize(24)
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(999)
            .setAlign('center');
        this.input.keyboard.on('keydown', () => {
            if (!this.restart) return;
            this.scene.restart();
        });
        this.input.on('pointerdown', () => {
            if (!this.restart) return;
            this.scene.restart();
        });

        this.score = 0;
        this.scoreShow = this.add.text(this.cameras.main.width / 18, this.cameras.main.height / 18, this.score, {
            fontFamily: 'Orbitron', fontSize: '24px', color: '#ffffff',
        }).setOrigin(0, 0.5).setDepth(1000);

        this.player = new Player(this, center.x, height / 2);
        this.startTime = Date.now();
        this.timers = 0;

        this.enimies = [new Enemy(this, this.player, '2', 2)];
        const enemy = new Enemy(this, this.player, '1', 1);
        const enemy2 = new Enemy(this, this.player, '1', 2);
        this.enimies.push(enemy);
        this.enimies.push(enemy2);

        this.timers = 0;

        this.add.image(0, 0, 'background').setOrigin(0);

        /*
           게임 오버
         */
        this.youDiedText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5 * 2, 'You Died', {
            fontFamily: 'Orbitron', fontSize: '92px', color: '#ffffff',
        }).setOrigin(0.5).setDepth(990).setAlpha(0);

        this.youDiedText2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5 * 2, 'You Died', {
            fontFamily: 'Orbitron', fontSize: '91px', color: '#4f0111',
        }).setOrigin(0.5).setDepth(999).setAlpha(0);

        this.scoreResult = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5 * 3, this.score, {
            fontFamily: 'Orbitron', fontSize: '36px', color: '#ffffff',
        }).setOrigin(0.5).setDepth(990).setAlpha(0);

        this.add.image(0, 0, 'background').setOrigin(0);

        this.overlay = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000 // 검은색
        ).setOrigin(0.5).setAlpha(0);
    }

    update() {
        if (this.enimies.length > 13) return;
        this.timers += Date.now() - this.startTime;
        if (this.timers > 100000 + this.enimies.length * 5000000) {
            this.timers = 0;
            this.enimies.push(new Enemy(this, this.player, Math.random() < 0.5 ? '1' : '2', this.enimies.length));
        }

        this.scoreShow.setText(this.score);

    }

    getGameOver() {
        return this.gameOver;
    }

    addScore(point) {
        this.score += point;
    }

    setGameOver(b) {
        this.gameOver = b;
        if (this.gameOver) {
            this.tweens.add({
                targets: this.scoreShow, alpha: 0, duration: 500, ease: 'Linear',
            });
            this.scoreResult.setText(this.score);
            this.tweens.add({
                targets: this.scoreResult, alpha: 1, duration: 6000, ease: 'Linear',
            });
            this.tweens.add({
                targets: this.youDiedText, alpha: 1, duration: 3000, ease: 'Linear',
            });
            this.tweens.add({
                targets: this.overlay, alpha: 0.7, duration: 2000, // 애니메이션 지속 시간 (2초)
                ease: 'Linear', onComplete: () => {
                    this.restart = true;
                    this.tweens.add({
                        targets: this.clickToRestart, alpha: 1, duration: 1000, ease: 'Linear', onComplete: () => {
                            this.tweens.add({
                                targets: this.clickToRestart,
                                alpha: 0,
                                duration: 1000,
                                repeat: -1,
                                yoyo: true,
                                ease: 'EaseInOut',
                            });
                        }
                    });

                    this.tweens.add({
                        targets: this.youDiedText2, alpha: 1, duration: 2000, ease: 'Linear',
                    });
                },
            });
        }
    }

    playDodgeEffect(x, y) {
        const dodgeEffect = this.add.sprite(x, y, 'dodgeEffect').setScale(1).setAlpha(0.75).setDepth(1000);
        dodgeEffect.anims.create({
            key: 'playDodgeEffect', frames: 'dodgeEffect', frameRate: 60,
        });
        dodgeEffect.on('animationcomplete', () => {
            dodgeEffect.destroy();
        });

        dodgeEffect.anims.play('playDodgeEffect');
    }

    playExplosionEffect(x, y) {
        const explosionEffect = this.add.sprite(x, y, 'explosionEffect').setScale(0.5).setAlpha(0.6).setDepth(1000);
        explosionEffect.anims.create({
            key: 'playExplosionEffect', frames: 'explosionEffect', frameRate: 24,
        });
        explosionEffect.on('animationcomplete', () => {
            explosionEffect.destroy();
        });

        explosionEffect.anims.play('playExplosionEffect');
    }

    playFeverEffect(x, y) {
        const feverEffect = this.add.sprite(x, y, 'feverEffect').setScale(1).setAlpha(0.8).setDepth(1000);
        feverEffect.anims.create({
            key: 'playFeverEffect', frames: 'feverEffect', frameRate: 24,
        });
        feverEffect.on('animationcomplete', () => {
            feverEffect.destroy();
        });

        feverEffect.anims.play('playFeverEffect');
    }

    playImpactEffect(x, y) {
        const impactEffect = this.add.sprite(x, y, 'impactEffect').setScale(0.5).setAlpha(0.6).setDepth(1000);
        impactEffect.anims.create({
            key: 'playImpactEffect', frames: 'impactEffect', frameRate: 90,
        });
        impactEffect.on('animationcomplete', () => {
            impactEffect.destroy();
        });

        impactEffect.anims.play('playImpactEffect');
    }
}