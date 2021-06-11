import  { Input } from "./input.js";
import { GameFunctions } from "./game_functions.js"
import  { Skill } from "./skill.js";
import {Config} from "./config.js";
import { Effect } from "./effect.js";
import {Render} from './render.js'


export class Player{
    constructor(engine) {
        this.engine = engine
        this.pos = {
           "x" : 450,
           "y" : 100  
        }
        this.acceleration = {
            "x" : 0,
            "y" : 0
        }
        this.woble_angle = 0
        this.immunity = false
        this.cd_redaction = 0
        this.spell_power = 0
        this.speed = Config.player_speed
        this.mass = Config.player_mass
        this.width = 35
        this.height = 80
        this.input = new Input()
        this.acceleration_step = 0.015
        this.damaged = false
        this.casted = false
        this.fliped = false
        this.can_be_attracted = true
        this.projectiles = []
        this.l_click_item = new Skill(this, 'space crusher', this.render)
        this.r_click_item = new Skill(this, 'death comet', this.render)
        this.power = new Skill(this, 'massive wave', this.render)
        // player game images
        this.idle_image = new Image()
        this.idle_image.src = './resources/img/player_idle.png'

        this.damage_image = new Image()
        this.damage_image.src = './resources/img/player_damage.png'

        this.move_image = new Image()
        this.move_image.src = './resources/img/player_move.png'

        this.cast_image = new Image()
        this.cast_image.src = './resources/img/player_move_attack.png'
    
        this.state = 'idle'
        this.max_frame = 5
        this.frame = 0
        this.frame_timer = 0
        this.was_hit = false
        this.life = 3
        
    }
    // make the player immunity to asteroid collision
    getImmunity(time){
        this.immunity = true
        setTimeout(()=>{
            this.immunity = false
        } ,time * 1000)
    }
    act(bh , ast){
        
        this.woble_angle += 0.1
        if(this.woble_angle > 2 * Math.PI){
            this.woble_angle = 0
        }
        this.frame_timer += 0.2
        if(this.frame_timer >= 1){
            this.frame_timer = 0
            this.frame ++
            if(this.frame == this.max_frame){
                this.frame = 0
            }
        }
        if(this.state == 'lose'){
            return
        }
        // get the pressed buttons
        let input = this.input.getInput()
        this.projectiles.forEach( elem => {
            elem.act(ast, bh)
        })
        // if left mouse click
        if(input.m_left && !input.e){
            this.leftClick(input)
        }
        // if right mouse click
        else if(input.m_right){
            this.rightClick(input)
        }
        else if(input.e){
            this.powerAbility(input)
        }
        let x_move = 0;
        let y_move = 0;
        //etc
        
        if(input.w && !this.damaged) {   
            this.acceleration.y -= this.acceleration_step
            if(this.acceleration.y < -1) {
                this.acceleration.y = -1
            }
        }
        if(input.s && !this.damaged)  { 
            
            this.acceleration.y += this.acceleration_step
            if(this.acceleration.y > 1) {
                this.acceleration.y = 1
            }
        }
        if(input.d && !this.damaged)  {  
            if(this.fliped){
                this.fliped = false
            }
            this.acceleration.x +=  this.acceleration_step;
            if(this.acceleration.x > 1) {
                this.acceleration.x = 1
            }
        }
        if(input.a && !this.damaged) {
            if(!this.fliped){
                this.fliped = true
            }
            this.acceleration.x -= this.acceleration_step
            if (this.acceleration.x < -1) {
                this.acceleration.x = -1
            }
        }
        // if no buttons are pressed or player damaged
        if(!input || this.damaged){
            if(Math.abs(this.acceleration.x) < this.acceleration_step ){
                this.acceleration.x = 0
            }
            if(Math.abs(this.acceleration.y) < this.acceleration_step ){
                this.acceleration.y = 0
            }
            if(this.acceleration.x != 0){
                x_move = this.acceleration.x
                this.acceleration.x += this.acceleration.x > 0 ? -this.acceleration_step : this.acceleration_step
            }
            if(this.acceleration.y != 0){
                y_move = this.acceleration.y
                this.acceleration.y += this.acceleration.y > 0 ? -this.acceleration_step : this.acceleration_step
            }

        }
        // take the player state
        if(this.damaged){
            if(this.state != 'damage'){
                this.state = 'damage'
                this.frame_timer = 0
                this.frame = 0
                
            }
        }
        else if(this.casted){
            if(this.state != 'cast'){
                this.state = 'cast'
                this.frame_timer = 0
                this.frame = 0
                
            }
        }       
        else if(!input){
            if(this.state != 'idle'){
                this.state = 'idle'
                this.frame_timer = 0
                this.frame = 0
                this.woble_angle =  Math.PI / 2
            }
        }
        else{
            if(this.state != 'move'){
                this.state = 'move'
                this.frame_timer = 0
                this.frame = 0
            }
        }
        x_move = this.acceleration.x
        y_move = this.acceleration.y
        //if player is in black hole attracted zone
        if(bh.intersectEventPlayer(this)){
            this.engine.createGameOverWindow();
            this.state = 'lose'
            return
        }
        if(bh.intersectPlayer(this) && this.can_be_attracted){

            let distance = bh.distanceToEvent(this)
            let power = distance/bh.radius_of_influence
            power = power > 1 ? 1 : power
            // the x , y offsets
            let dx = 0;
            let dy = 0;

            if(this.pos.x < bh.pos.x && this.pos.y < bh.pos.y) { dx = Math.sin(bh.calcAngle(this)) ; dy =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y < bh.pos.y) { dx = Math.sin(bh.calcAngle(this)) ; dy =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x < bh.pos.x && this.pos.y > bh.pos.y) { dx = -Math.sin(bh.calcAngle(this)) ; dy =  -Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y > bh.pos.y) { dx = -Math.sin(bh.calcAngle(this)) ; dy =  -Math.cos(bh.calcAngle(this)) }

            // change them depending on the black hole power and distance to it
            dx = (dx * (1 - power)) * bh.power
            dy = (dy * (1 - power)) *  bh.power

            x_move += dx/(this.mass/(15 * (1 - power)))
            y_move += dy/(this.mass/(15 * (1 - power)))

            // set the new cords to the player
            this.pos.x += x_move * (this.speed + (bh.power * (1-power)))
            this.pos.y += y_move * (this.speed + (bh.power * (1-power)))
        }
        else {
            this.pos.x += x_move * this.speed
            this.pos.y += y_move * this.speed
        }
       // check the collisons with the asteroids
        ast.forEach(element => {
            let distance_x = Math.abs(element.pos.x - this.pos.x);
            let distance_y = Math.abs(element.pos.y - this.pos.y);
        
            if (distance_x > (this.width/2 + element.r)) { return false; }
            if (distance_y > (this.height/2 + element.r)) { return false; }
        
            let cornerDistance_sq = (distance_x - this.width/2)^2 +
            (distance_y - this.height/2)^2;
            // if true
            if(cornerDistance_sq <= (element.r^2) || distance_x <= (this.width/2) || distance_y <= (this.height/2)){
                if(!this.damaged && !this.immunity){
                    if(!this.was_hit){
                        this.was_hit = true
                        setTimeout(() => {
                            this.was_hit = false
                        },7000)
                    }
                    else{
                        this.life --
                        if(this.life == 0){
                            this.engine.createGameOverWindow()
                            this.state = 'lose'
                            return
                        }
                    }
                    this.damaged = true
                    let angle = GameFunctions.angle(element, this)
                    let hit_coef = (1 - this.mass/200)
                    hit_coef = hit_coef < 0.1 ? 0.1 : hit_coef

                    this.acceleration.x = Math.sin(angle) * hit_coef
                    this.acceleration.y = Math.cos(angle) * hit_coef

                    element.changeSpeedFromHit(this)
                    setTimeout(()=>{
                        this.state = 'idle'
                        this.damaged = false
                    },1000)
                }
                
            }
        });
    }
    // actions on mouse click
    leftClick(input){
        if(!this.damaged){
            if(this.l_click_item.avalaible){
                Render.effects.push(new Effect('after cast', this.pos, 0))
                this.l_click_item.do(input , this)
                
            }
            if(!this.casted){
                this.casted = true
                setTimeout(()=>{
                    this.casted = false
                },500)
            }
        }       
    }

    rightClick(input){
        if(!this.damaged){
            if(this.r_click_item){
                this.r_click_item.do(input , this)
                
            }
            if(!this.casted){
                this.casted = true
                setTimeout(()=>{
                    this.casted = false
                },500)
            }
        }
        
    }

    powerAbility(input){
        if(!this.damaged){
            if(this.power){
                if(this.power.clickable){
                    if(input.m_left){
                        this.power.do(input, this)
                    }
                }
                else{
                    this.power.do(input, this)
                }
            }
        }    
    }

    deleteProj(item){
        this.projectiles = this.projectiles.filter( elem => {            
            return elem != item
        })
    }
}