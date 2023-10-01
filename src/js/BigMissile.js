import Phaser from 'phaser';

export default class BigMissile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, speed, target, count) {
        super(scene, x, y, 'glow1');
        this.scene = scene;
        this.type = type; // 미사일의 타입 (1, 2, 3)
        this.speed = speed; // 미사일의 속도
        this.target = target;
        this.count = count;

        this.setDepth(1);
        this.setTexture('glow1');
        this.setPosition(x, y);
        this.setScale(getRandomNumber());


        this.group = scene.physics.add.group({
            defaultKey: 'glow1',
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
        }, 14000);
    }

    move() {
        const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);

        const minAngle = angleToTarget - Phaser.Math.DegToRad(-25); // 최소 각도
        const maxAngle = angleToTarget + Phaser.Math.DegToRad(25); // 최대 각도

        const adjustedAngle = Phaser.Math.FloatBetween(minAngle, maxAngle);

        const dx = Math.cos(adjustedAngle) * this.speed + this.count * 15 + getRandomInt(25, 300);
        const dy = Math.sin(adjustedAngle) * this.speed + this.count * 15 + getRandomInt(25, 300);

        this.setVelocity(dx, dy);
    }

    handleCollision(_, player) {
        this.destroy();
        player.damaged();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber() {
    return 0.35 + Math.random() * 1.5;
}
