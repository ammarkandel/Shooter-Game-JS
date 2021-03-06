import Phaser from 'phaser';
import SceneMainMenu from '../src/Scenes/SceneMainMenu';
import SceneMain from '../src/Scenes/SceneMain';
import SceneGameOver from '../src/Scenes/SceneGameOver';
import SceneLeaderBoard from '../src/Scenes/SceneLeaderBoard';

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
      SceneMainMenu,
      SceneMain,
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
