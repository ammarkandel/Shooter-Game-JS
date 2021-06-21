import Phaser from 'phaser';
import Player from '../Entities/player';
import ScrollingBackground from '../Entities/scrollingBackground';
import ImperialShutle from '../Entities/ImperialShutle';
import GunShip from '../Entities/gunShip';
import Bomb from '../Entities/Bomb';

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }

  preload() {
    this.load.image('sprBg0', 'content/sprBg0.png');
    this.load.image('sprBg1', 'content/sprBg1.png');
    this.load.spritesheet('sprExplosion', 'content/sprExplosion.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('tieFighter', 'content/tieFighterp.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('bomb', 'content/sprEnemy1.png');

    this.load.spritesheet('imperialShutle', 'content/imperialShutle.png', {
      frameWidth: 32,
      frameHeight: 26,
    });

    this.load.image('sprLaserEnemy0', 'content/sprLaserEnemy0.png');
    this.load.image('sprLaserPlayer', 'content/sprLaserPlayer.png');
    this.load.spritesheet('sprPlayer', 'content/xWing.png', {
      frameWidth: 32,
      frameHeight: 37,
    });

    this.load.audio('sndExplode0', 'content/sndExplode0.wav');
    this.load.audio('sndExplode1', 'content/sndExplode1.wav');
    this.load.audio('sndLaser', 'content/blaster-firing.wav');
    this.load.audio('battleSound', 'content/battle_in_space.ogg');
    this.load.audio('useForce', 'content/swUseForce.wav');
    this.load.audio('vaderBreath', 'content/swVader.wav');

    this.load.image('health0', 'content/healthEmpty.png');
    this.load.image('health1', 'content/healthOne.png');
    this.load.image('health2', 'content/healthTwo.png');
    this.load.image('health3', 'content/healthThree.png');
    this.load.image('health4', 'content/healthFour.png');
    this.load.image('health5', 'content/healthComplete.png');
  }

  create() {
    this.anims.create({
      key: 'tieFighter',
      frames: this.anims.generateFrameNumbers('tieFighter'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'tieAdvanced',
      frames: this.anims.generateFrameNumbers('tieAdvanced'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'imperialShutle',
      frames: this.anims.generateFrameNumbers('imperialShutle'),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'sprExplosion',
      frames: this.anims.generateFrameNumbers('sprExplosion'),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'sprPlayer',
      frames: this.anims.generateFrameNumbers('sprPlayer'),
      frameRate: 20,
      repeat: -1,
    });

    this.sfx = {
      explosions: [
        this.sound.add('sndExplode0', { volume: 0.1 }),
        this.sound.add('sndExplode1', { volume: 0.1 }),
      ],
      laser: this.sound.add('sndLaser', { volume: 0.1 }),
      useForce: this.sound.add('useForce', { volume: 0.3 }),
      vaderBreath: this.sound.add('vaderBreath', { volume: 0.1 }),
    };

    this.song = this.sound.add('battleSound', { volume: 0.1 });
    this.song.play();

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const bg = new ScrollingBackground(this, 'sprBg0', i * 10);
      this.backgrounds.push(bg);
    }

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprPlayer',
    );

    this.hpBar = [
      'health0', 'health1', 'health2', 'health3', 'health4', 'health5',
    ];

    this.sceneScore = this.add.text(
      this.game.config.width * 0.025,
      this.game.config.height * 0.925,
      `Score: ${this.player.getData('score')}`, {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '3vw',
        lineHeight: 1.3,
      },
    );

    this.updateHPBar(this.player);

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy) => {
      if (enemy && !this.player.getData('isDead')) {
        if (enemy.updateHealth()) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          this.player.setScore(enemy.getData('score'));
          enemy.explode(true);
        }
        playerLaser.destroy();
      }
    });

    this.physics.add.collider(this.player, this.enemyLasers, (player, laser) => {
      if (!player.getData('isDead')
          && !laser.getData('isDead')) {
        if (player.updateHealth()) {
          player.explode(false);
          laser.destroy();
          this.song.stop();
          player.onDestroy();
        } else {
          laser.destroy();
          this.updateHPBar(this.player);
        }
      }
    });

    this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
      if (!player.getData('isDead')
          && !enemy.getData('isDead')) {
        if (player.updateHealth()) {
          player.explode(false);

          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          player.setScore(enemy.getData('score'));
          enemy.destroy();

          this.song.stop();
          player.onDestroy();
        } else {
          if (enemy.onDestroy !== undefined) {
            player.setScore(enemy.getData('score'));
            enemy.onDestroy();
          }
          enemy.destroy();
          this.updateHPBar(this.player);
        }
      }
    });

    this.time.addEvent({
      delay: 1000,
      callback() {
        let enemy = null;

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0,
          );
        } else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType('Bomb').length < 5) {
            enemy = new Bomb(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0,
            );
          }
        } else {
          enemy = new ImperialShutle(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0,
          );
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
      },

      callbackScope: this,
      loop: true,
    });
  }

  update() {
    this.player.update();

    this.sceneScore.text = `Score: ${this.player.getData('score')}`;

    if (!this.player.getData('isDead')) {
      if (this.keyW.isDown) {
        this.player.moveUp();
      } else if (this.keyS.isDown) {
        this.player.moveDown();
      } else if (this.keyA.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown) {
        this.player.moveRight();
      }

      if (this.keySpace.isDown) {
        this.player.setData('isShooting', true);
      } else {
        this.player.setData('timerShootTick', this.player.getData('timerShootDelay') - 1);
        this.player.setData('isShooting', false);
      }
    }

    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];
      enemy.update();

      if (enemy.x < -enemy.displayWidth
          || enemy.x > this.game.config.width + enemy.displayWidth
          || enemy.y < -enemy.displayHeight * 4
          || enemy.y > this.game.config.height + enemy.displayHeight) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          enemy.destroy();
        }
      }
    }

    for (let i = 0; i < this.enemyLasers.getChildren().length; i += 1) {
      const laser = this.enemyLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth
          || laser.x > this.game.config.width + laser.displayWidth
          || laser.y < -laser.displayHeight * 4
          || laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i += 1) {
      const laser = this.playerLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth
          || laser.x > this.game.config.width + laser.displayWidth
          || laser.y < -laser.displayHeight * 4
          || laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }
  }

  getEnemiesByType(type) {
    const arr = [];
    for (let i = 0; i < this.enemies.getChildren().length; i += 1) {
      const enemy = this.enemies.getChildren()[i];
      if (enemy.getData('type') === type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

  updateHPBar(player) {
    this.sceneHPBar = this.add.image(
      this.game.config.width * 0.3,
      this.game.config.height * 0.05,
      this.hpBar[player.getData('health')],
    );
  }
}

export default SceneMain;
