import Phaser from 'phaser';
import ScrollingBackground from '../Entities/scrollingBackground';
import { getLocalScores } from '../localStorage';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  preload() {
    this.load.image('sprBg0', 'content/sprBg0.png');
    this.load.image('sprBg1', 'content/sprBg1.png');
    this.load.image('sprBtnPlay', 'content/sprBtnPlay.png');
    this.load.image('sprBtnPlayHover', 'content/sprBtnPlayHover.png');
    this.load.image('sprBtnPlayDown', 'content/sprBtnPlayDown.png');
    this.load.image('sprBtnRestart', 'content/sprBtnRestart.png');
    this.load.image('sprBtnRestartHover', 'content/sprBtnRestartHover.png');
    this.load.image('sprBtnRestartDown', 'content/sprBtnRestartDown.png');
    this.load.image('gameTitle', 'content/game_title.png');

    this.load.audio('sndBtnOver', 'content/sndBtnOver.wav');
    this.load.audio('sndBtnDown', 'content/sndBtnDown.wav');
    this.load.audio('ready', 'content/starWarsReady.ogg');
  }

  create() {
    this.sfx = {
      btnOver: this.sound.add('sndBtnOver', { volume: 0.1 }),
      btnDown: this.sound.add('sndBtnDown', { volume: 0.1 }),
    };

    this.gameTitle = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.3,
      'gameTitle',
    );

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.25,
      this.game.config.height * 0.65,
      'sprBtnPlay',
    );

    this.btnPlay.setInteractive();
    this.createButton(this.btnPlay, 'sprBtnPlay', 'sprBtnPlayHover', 'sprBtnPlayDown');
    this.btnPlay.on('pointerup', () => {
      this.btnPlay.setTexture('sprBtnPlay');
      this.song.stop();
      this.scene.start('SceneMain');
    }, this);

    this.scores = getLocalScores();

    this.scoreTextConfig = {
      color: '#d0c600',
      fontFamily: 'sans-serif',
      fontSize: '2vw',
      lineHeight: 1.3,
      textAlign: 'center',
    };

    this.sceneScore = this.add.text(
      this.game.config.width * 0.05,
      this.game.config.height * 0.85,
      `Last Score: ${this.scores[0]}`,
      this.scoreTextConfig,
    );

    this.sceneScore = this.add.text(
      this.game.config.width * 0.05,
      this.game.config.height * 0.9,
      `High Score: ${this.scores[1]}`,
      this.scoreTextConfig,
    );

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    this.song = this.sound.add('ready', { volume: 0.1 });
    this.song.play();
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }

    if (this.keySpace.isDown) {
      this.song.stop();
      this.scene.start('SceneMain');
    }
  }

  createButton(btn, spr, sprHover, sprDown) {
    btn.on('pointerover', () => {
      btn.setTexture(sprHover);
      this.sfx.btnOver.play();
    }, this);

    btn.on('pointerout', () => {
      btn.setTexture(spr);
    });

    btn.on('pointerdown', () => {
      btn.setTexture(sprDown);
      this.sfx.btnDown.play();
    }, this);
  }
}

export default SceneMainMenu;
