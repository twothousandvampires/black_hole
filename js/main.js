import { GameEngine } from "./moduls/game_engine.js"

let start = document.getElementById('start')

start.addEventListener('click', e =>{
    let game = new GameEngine();
    game.start();
})



