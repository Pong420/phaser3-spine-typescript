import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
// import 'phaser/plugins/spine/dist/SpinePlugin'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

// Phaser.Textures.TextureManager.prototype.destroy = function () {}
// Phaser.Cache.CacheManager.prototype.destroy = function () {}

window.phaserMemory = window.phaserMemory || {}

if (!window.hacked) {
  window.hacked = true
  // debugger;
  // const phaserMemory = (window.phaserMemory = {});
  const files: (keyof typeof Phaser.Loader.FileTypes)[] = ['ImageFile']

  for (const fileType of files as any) {
    // for (const fileType in Phaser.Loader.FileTypes) {
    const file = Phaser.Loader.FileTypes[fileType]

    if (file.prototype && file.prototype.addToCache && file.prototype.load) {
      const addToCache = file.prototype.addToCache
      file.prototype.addToCache = function () {
        if (this.data) {
          window.phaserMemory[this.src] = this.data
        }
        addToCache.call(this)
      }

      const load = file.prototype.load
      file.prototype.load = function (this: Phaser.Loader.File) {
        const src = Phaser.Loader.GetURL(this, this.loader.baseURL)
        const data = window.phaserMemory[src]
        if (data) {
          this.src = src
          this.data = data
          this.onProcessComplete()
          this.loader.loadComplete()
        } else {
          load.call(this)
        }
      }

      file.prototype.destroy = function () {
        //
      }
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}

window.game = new Phaser.Game(config)

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => window.game.destroy(true))
}
