import { Asteroid } from "../moduls/asteroid_module.js";
import  { Blackhole } from "../moduls/black_hole.js";
import  { Player } from "../moduls/player_module.js";
import { Render } from '../moduls/render_module.js'
import { Skill } from '../moduls/skill_module.js'

export class GameEngine{

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
            if(this.timer%30 === 0 ){
                this.createAsteroid(true)
            }
        } , 1000)
        this.astr_create_timer = 5
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
    playerAct(){
        
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
    start(){
        setInterval(()=>{
            this.render.drawFrame(this.black_hole, this.asteroinds_mass, this.player, this.power_up_array)
            this.black_hole.act()
            this.asteroidAct()
            this.player.act(this.black_hole , this.asteroinds_mass)
        },30)
    }
}
