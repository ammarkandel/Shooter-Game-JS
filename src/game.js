import Phaser from 'phaser';
import SceneMainMenu from './Scenes/SceneMainMenu';
import SceneMain from './Scenes/SceneMain';
import SceneGameOver from './Scenes/SceneGameOver';

const config = {
  type: Phaser.WEBGL,
  parent: 'divld',
  width: 480,
  height: 640,
  backgroundColor: 'black',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [
    SceneMainMenu,
    SceneMain,
    SceneGameOver
  ],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
