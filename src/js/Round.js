import Phaser from 'phaser';

import player from '@/images/player.png';
import background from "@/images/background.jpeg";
import Player from '@/js/Player';
import glow1 from '@/images/glow1.gif';
import glow2 from '@/images/glow2.gif';
import Enemy from "@/js/Enemy";

export default class Round extends Phaser.Scene {

    constructor() {
        super('round');
    }

    preload() {
        this.load.image('background', background);
        this.load.image('player', player);
        this.load.image('glow1', glow1);
        this.load.image('glow2', glow2);
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
        this.player = new Player(this, center.x, height / 2);
        this.startTime = Date.now();
        this.timers = 0;

        this.enimies = [new Enemy(this, this.player, '2', 2)];
        const enemy = new Enemy(this, this.player, '1', 1);
        this.enimies.push(enemy);

        this.timers = 0;

        this.add.image(0, 0, 'background').setOrigin(0);

        /*
           게임 오버
         */
        this.youDiedText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'You Died',
            {
                fontFamily: 'Orbitron',
                fontSize: '92px',
                color: '#ffffff',
            }
        ).setOrigin(0.5).setDepth(990).setAlpha(0);

        this.youDiedText2 = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'You Died',
            {
                fontFamily: 'Orbitron',
                fontSize: '91px',
                color: '#4f0111',
            }
        ).setOrigin(0.5).setDepth(999).setAlpha(0);

        this.add.image(0, 0, 'background').setOrigin(0);

        this.overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000 // 검은색
        ).setOrigin(0.5).setAlpha(0);
    }

    update() {
        if (this.enimies.length > 12) return;
        this.timers += Date.now() - this.startTime;
        if (this.timers > 3500000 + this.enimies.length * 5000000) {
            this.timers = 0;
            this.enimies.push(new Enemy(this, this.player, Math.random() < 0.5 ? '1' : '2', this.enimies.length));
        }
    }

    getGameOver() {
        return this.gameOver;
    }

    setGameOver(b) {
        this.gameOver = b;
        if (this.gameOver) {
            this.tweens.add({
                targets: this.youDiedText,
                alpha: 1, // 최종적으로 텍스트가 완전히 불투명해집니다.
                duration: 3000, // 애니메이션 지속 시간 (2초)
                ease: 'Linear',
                onComplete: () => {
                    // 애니메이션이 끝나면 추가 작업 수행
                    // 예를 들어 게임 재시작 버튼 표시 등을 할 수 있습니다.
                },
            });
            this.tweens.add({
                targets: this.overlay,
                alpha: 0.7, // 최종적으로 투명도가 0.7이 됩니다. (0에서 1 사이)
                duration: 2000, // 애니메이션 지속 시간 (2초)
                ease: 'Linear',
                onComplete: () => {
                    this.tweens.add({
                        targets: this.youDiedText2,
                        alpha: 1, // 최종적으로 텍스트가 완전히 불투명해집니다.
                        duration: 2000, // 애니메이션 지속 시간 (2초)
                        ease: 'Linear',
                        onComplete: () => {

                        },
                    });
                },
            });
        }
    }

}