import Phaser from 'phaser';

export default class HealingBall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, speed, target, count) {
        super(scene, x, y, 'glow2');
        this.scene = scene;
        this.type = type; // 미사일의 타입 (1, 2, 3)
        this.speed = speed; // 미사일의 속도
        this.target = target;
        this.count = count;

        this.setDepth(1);
        this.setTexture('glow2');
        this.setPosition(x, y);
        this.setScale(0.2);


        this.group = scene.physics.add.group({
            defaultKey: 'glow2',
            collideWorldBounds: setTimeout(() => {
                return true
            }, 3000),
        });

        scene.physics.world.on('worldbounds', (body) => {
            body.gameObject.destroy();
        });
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCircle(30, 100, 100);
        this.move();

        scene.physics.add.collider(this, target, this.handleCollision, null, this);
        setTimeout(() => {
            this.destroy();
        }, 15000);
    }

    move() {
        const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);

        // 각도를 +- 60도로 조절
        const minAngle = angleToTarget - Phaser.Math.DegToRad(75); // 최소 각도
        const maxAngle = angleToTarget + Phaser.Math.DegToRad(75); // 최대 각도

        // 조절된 각도를 랜덤하게 선택
        const adjustedAngle = Phaser.Math.FloatBetween(minAngle, maxAngle);

        // 선택된 각도로 이동
        const dx = Math.cos(adjustedAngle) * this.speed + getRandomInt(0, 250);
        const dy = Math.sin(adjustedAngle) * this.speed + getRandomInt(0, 250);

        this.setVelocity(dx, dy);
    }

    handleCollision(_, player) {
        this.destroy();
        player.dodged();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}