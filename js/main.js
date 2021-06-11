import { GameEngine } from "./moduls/game_engine.js"
import { Render } from "./moduls/render.js";
window.document.hasFocus = function() {return true;}

let start = document.getElementById('start')
let game = new GameEngine();


start.addEventListener('click', e =>{  
    start.parentNode.removeChild(start)  
    game.start();
})



