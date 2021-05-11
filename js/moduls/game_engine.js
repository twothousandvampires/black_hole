import  { Config } from "./config.js";
import { Asteroid } from "./asteroid.js";
import  { Blackhole } from "../moduls/black_hole.js";
import  { Player } from "./player.js";
import { Render } from './render.js'
import { Skill } from './skill.js'
import {Effect} from "./effect.js";
import {GameFunctions} from "./game_functions.js";


export class GameEngine{
    static self
    constructor(){
        this.black_hole = new Blackhole({x:450, y: 450})
        this.timer = 0
        this.game_tame = setInterval( ()=> {
            this.timer ++
            if(this.timer%10 === 0){
                if(this.astr_create_timer > 0.3){
                    clearInterval(this.asteroid_creator)
                    this.astr_create_timer = (this.astr_create_timer - 0.1).toFixed(1)
                    this.black_hole.grow(15)
                    this.asteroid_creator = setInterval( () =>{
                        this.createAsteroid()                       
                    },this.astr_create_timer * 1000 )
                }
                
            }
            if(this.timer%40 === 0 ){
                this.createAsteroid(true)
            }
            if(this.timer%10 === 0 ){
                this.createPowerUp()
            }
        } , 1000)
        this.astr_create_timer = 1
        this.render = new Render(this)
        this.player = new Player(this.render)
        this.power_up_array = []
        this.asteroinds_mass = []
        this.asteroid_creator = setInterval( () =>{
            this.createAsteroid()
        },this.astr_create_timer * 1000 )
    }
    
    createAsteroid(comet){
        let x, y, angle
        let side = Math.floor(Math.random() * (5 - 1) +1)
    
        switch (side){
            case 1:
                x = Math.random() * 900
                angle = Math.random() < 0.5 ? Math.random() * 1.57 : Math.random() * (6.28 - 4.71) + 4.71
                y = -60
                break
            case 2:
                y = Math.random() * 900
                angle = Math.random() * (6.28 - 3.14) + 3.14
                x = 960
                break
            case 3:
                y = 960
                x = Math.random() * 900
                angle = Math.random() * (4.71 - 1.57)  + 1.57
                break
            case 4:
                y = Math.random() * 900
                x = -60
                angle = Math.random() * 3.14
                break
        }
        this.asteroinds_mass.push(new Asteroid(this, {x:x, y:y}, angle,Math.random() * ( 50 - 10) + 10, comet ? true : false))
    
    }
    deleteAsteroid(item){
        this.asteroinds_mass = this.asteroinds_mass.filter( elem => {
            return elem != item
        })
    }
    asteroidAct(){
        for (let i = 0; i < this.asteroinds_mass.length;i ++){
            this.asteroinds_mass[i].move(this.black_hole, this.asteroinds_mass , this.player)
            if(this.asteroinds_mass[i].pos.x > 960 || this.asteroinds_mass[i].pos.y > 960 || this.asteroinds_mass[i].pos.x < -60 || this.asteroinds_mass[i].pos.y < -60 ){
                console.log('-')
                this.deleteAsteroid(this.asteroinds_mass[i])
            }
        }
    }
    power_up_act(player, engine){
        for( let i = 0 ; i < this.power_up_array.length; i ++){
            let item = this.power_up_array[i];
            item.act(player, engine)
        }
    }
    deletePowerUp(item){
        this.power_up_array = this.power_up_array.filter( elem => {
            return elem != item
        })
    }
    gameStep(){
        this.render.drawFrame(this.black_hole, this.asteroinds_mass, this.player, this.power_up_array)
        this.black_hole.act()
        this.asteroidAct()
        this.player.act(this.black_hole , this.asteroinds_mass)
        this.power_up_act(this.player, this);
        requestAnimationFrame(() => this.gameStep())
    }
    start(){
        requestAnimationFrame(() => this.gameStep())
    }
    createPowerUp(){
        let x = Math.floor( Math.random() * 900)
        let y = Math.floor( Math.random()  * 900)
        while (GameFunctions.distanceBetweenPoints({ pos : { 'x' : x, 'y' : y}}, this.black_hole) < this.black_hole.getTotalRadius()) {
            x = Math.floor( Math.random() * 900)
            y = Math.floor( Math.random()  * 900)
        }
        this.render.effects.push(new Effect('power up', this.render, { "x" : x, "y": y}, 0))
        this.power_up_array = []
        setTimeout( () =>{
            this.power_up_array.push(new Skill(this.player, Config.list_of_power_ups[Math.floor(Math.random() * Config.list_of_power_ups.length)],this.render, { "x" : x, "y" : y}))
        },1000)

    }
}
