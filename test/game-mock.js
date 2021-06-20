import Phaser from 'phaser';
import SceneMainMenu from '../src/scenes/SceneMainMenu.js';
import SceneMain from '../src/scenes/SceneMain.js';
import SceneIntro from '../src/scenes/SceneIntro.js';
import SceneAbout from '../src/scenes/SceneAbout.js';
import SceneGameOver from '../src/scenes/SceneGameOver.js';
import SceneLeaderBoard from '../src/scenes/SceneLeaderBoard.js';

function gameRun() {
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
      SceneIntro,
      SceneMainMenu,
      SceneMain,
      SceneAbout,
      SceneGameOver,
      SceneLeaderBoard,
    ],
    pixelArt: true,
    roundPixels: true,
  };

  const game = new Phaser.Game(config);

  return game;
}

export default gameRun;
