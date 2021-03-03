declare interface Window {
  game: any
  cache?: any
  textures?: any
  phaserMemory?: any
  hacked?: any
}

declare namespace NodeJS {
  interface Module {
    hot?: {
      accept: (path?: string | string[], callback?: () => void) => void
      dispose: (data: any) => void
    }
  }
}
