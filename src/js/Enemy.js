import Phaser from "phaser";
import Missile from "@/js/Missile";
import HealingBall from "@/js/HealingBall";
import BigMissile from "@/js/BigMissile";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, target, type, count) {
        super(scene, 100, -100, 'enemy');
        this.scene = scene;
        this.type = type; // 타입 지정
        this.setDepth(1);
        this.target = target;
        this.count = count;

        // 미사일 발사 설정
        this.shootTimer = scene.time.addEvent({
            delay: 210 - count * 10,
            callback: this.shootMissile,
            callbackScope: this,
            loop: true,
        });

        scene.add.existing(this);

        switch (type) {
            case "1":
                this.setClockwiseMovement();
                break;
            case "2":
                this.setCounterclockwiseMovement();
                break;
            default:
                this.setClockwiseMovement();
                break;
        }
    }

    setClockwiseMovement() {
        const dx = this.scene.cameras.main.width * 2;
        const dy = this.scene.cameras.main.height * 2;
        this.scene.tweens.timeline({
            targets: this,
            ease: Phaser.Math.Easing.Bounce.InOut,
            loop: -1, // 무한 반복
            tweens: [
                { x: this.x - 200 + dx, y: this.y - 400, delay: 0 }, // 90도 회전
                { x: this.x - 400 + dx, y: this.y + dy, delay: 0 }, // 180도 회전
                { x: this.x - 100, y: this.y + dy, delay: 0 }, // 270도 회전
                { x: this.x - 200, y: this.y + 100, delay: 0 },
            ],
        });
    }

    setCounterclockwiseMovement() {
        const dx = this.scene.cameras.main.width * 2;
        const dy = this.scene.cameras.main.height * 2;
        this.scene.tweens.timeline({
            targets: this,
            ease: Phaser.Math.Easing.Bounce.InOut,
            loop: -1, // 무한 반복
            tweens: [
                { x: this.x - 200, y: this.y - 400, delay: 0 },
                { x: this.x - 100, y: this.y + dy, delay: 0 },
                { x: this.x - 400 + dx, y: this.y + dy, delay: 0 },
                { x: this.x - 200 + dx, y: this.y + 100, delay: 0 },
            ],
        });
    }

    shootMissile() {
        if (this.scene.getGameOver()) return;
        if (Math.random() < 0.025 - this.count * 0.00165) {
            new HealingBall(this.scene, this.x, this.y, 1, 200, this.target, 2);
        }
        else if (Math.random() < 0.01 + this.count * 0.00125) {
            new BigMissile(this.scene, this.x, this.y, 1, 200, this.target, 2);
        } else {
            new Missile(this.scene, this.x, this.y, 1, 100, this.target, this.count + 1);
        }
        this.addRandomScore();
    }

    addRandomScore() {
        if (Math.random() < 0.025 - this.count * 0.001) {
            this.scene.addScore(this.count)
        }
    }
}
