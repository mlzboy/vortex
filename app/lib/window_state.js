'use stricts'
const app = require('electron').app
const fs = require('fs')
const locale = require('./locale.js')

module.exports = (filename, defaults) => {
  let isSaved = false
  let userDataDir = app.getPath('userData')
  const stateStoreFile = userDataDir + '/window-state.json'
  let state = {
    width: defaults.width,
    height: defaults.height,
    x: defaults.x,
    y: defaults.y,
    isSlideMode: true,
    visibility: true
  }

  try {
    state = JSON.parse(fs.readFileSync(stateStoreFile, 'utf8'))
  } catch (e) {
    console.log('create ' + stateStoreFile)
  }

  if (filename && filename !== locale.Untitled) {
    state.lastItem = filename
  }

  const saveState = (win) => {
    isSaved = true
    if (!win.isMaximized() && !win.isMinimized()) {
      const position = win.getPosition()
      const size = win.getSize()
      state.x = position[0]
      state.y = position[1]
      state.width = size[0]
      state.height = size[1]
    }
    state.isMaximized = win.isMaximized()
    fs.writeFileSync(stateStoreFile, JSON.stringify(state))
  }

  return {
    get x () { return state.x },
    get y () { return state.y },
    get width () { return state.width },
    get height () { return state.height },
    get isMaximized () { return state.isMaximized },
    get isSlideMode () { return state.isSlideMode },
    set isSlideMode (val) { state.isSlideMode = val },
    get visibility () { return state.visibility },
    set visibility (val) { state.visibility = val },
    get isSaved () { return isSaved },
    get lastItem () { return state.lastItem },
    set lastItem (val) { state.lastItem = val },
    saveState: saveState
  }
}
