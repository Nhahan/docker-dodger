import '@/styles/index.css';

import Phaser from 'phaser';

import Loading from '@/js/Loading';
import Round from '@/js/Round';

import WebFont from 'webfontloader';

WebFont.load({
    custom: {
        families: [
            'Orbitron'
        ],
        urls: [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap'
        ]
    },
    active: function () {
        //게임 설정 - 웹 폰트 로딩 후 생성
        // const width = window.innerWidth || 720;
        // const height = window.innerHeight || 1080;
        const width = 720;
        const height = 1080;
        const config = {
            type: Phaser.AUTO,//WebGL or Canvas
            width: width,
            height: height,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true,
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: width,
                height: height,
            },
            scene: [Loading, Round]
        }
        new Phaser.Game(config);
    }
});
