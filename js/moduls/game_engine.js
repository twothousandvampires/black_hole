import { MapParser } from '../utility/map_parser.js'
import  { Render} from "./render_module.js";
import { Player } from './player_module.js'
let map_parser = new MapParser()

export class GameEngine{


    constructor(plan, input) {
        this.player = new Player()
        this.input = input
        this.map = map_parser.createMap(plan);
        this.render = new Render(this.map)
    }


    renderFrame(){
        this.render.drawWorld()
    }
}