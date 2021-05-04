import { GameFunctions } from "./game_functions.js"
import {Effect} from "./effect_module.js";



export class Asteroid{

    constructor(parrent ,pos ,angle,mass) {
        this.frame_timer = 0
        this.frame = 0
        this.max_frame = 7
        this.parrent = parrent
        this.mass = mass
        this.pos = pos
        this.angle = angle
        this.size = mass
        this.speed = 20/mass
        this.image = new Image()
        this.image.src = './resources/img/asteroid.png'
        this.x_movie = Math.sin(this.angle)
        this.y_movie = Math.cos(this.angle)
        this.r = mass/2
        this.damaged = false
    }
    
    reset(){
        this.x_movie = Math.sin(this.angle)
        this.y_movie = Math.cos(this.angle)
        if(this.angle < 0){
            this.angle = 2*Math.PI - this.angle
        }
        if(this.angle > 2 * Math.PI){
            this.angle = this.angle - 2 * Math.PI
        }

    }
    move(bh ,astr){
        this.frame_timer += 0.2
        if(this.frame_timer > this.mass/30){
            this.frame++
            this.frame_timer = 0
            if(this.frame === this.max_frame){
                this.frame = 0
            }
        }
        if(bh.intersectEvent(this)){
            let a = GameFunctions.angle(this, bh)

            this.parrent.render.effects.push(new Effect('suction',this.parrent.render ,{ "x" : bh.pos.x - bh.radius, "y" : bh.pos.y - bh.radius} , a))
            this.parrent.deleteAsteroid(this)
            bh.grow(this.mass)
        }
        else if(bh.intersect(this)){
            let distance_to_event = bh.distanceToEvent(this)
            let power = distance_to_event/bh.radius_of_influence
            power = power > 1 ? 1 : power
            let xm = 0;
            let ym = 0;

            if(this.pos.x < bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x < bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
            
            xm = (xm * (1 - power)) * bh.power
            ym = (ym * (1 - power)) *  bh.power

            this.x_movie += xm/(this.mass * 4)

            this.y_movie += ym/(this.mass * 4)

            let new_angle = GameFunctions.angle(this, { pos : {"x" : this.pos.x + this.x_movie , "y" : this.pos.y + this.y_movie }})

            this.angle = new_angle

            // GameFunctions.drawPoint({ pos : {"x" : this.pos.x + x_movie , "y" : this.pos.y + y_movie } }, "yellow")
            // console.log(GameFunctions.angle(this, { pos : {"x" : this.pos.x + x_movie , "y" : this.pos.y + y_movie }}))


            this.pos.x += Math.sin(this.angle) * (this.speed * (1 + (bh.power - power)))
            this.pos.y += Math.cos(this.angle) * (this.speed * (1 + (bh.power - power)))
        }
       
        else {
            this.pos.x += Math.sin(this.angle) * this.speed
            this.pos.y += Math.cos(this.angle) * this.speed
        }
        
        for (let i = 0; i < astr.length; i++) {
            const element = astr[i];
           
            if(GameFunctions.distanceBetweenPoints(this, element) < (this.r + element.r)){
               
                if(this != element && !this.damaged){

                    
                    this.changeSpeedFromAstr(element)
                   

                    this.damaged = true
                    
                    let timer = setInterval(()=>{
                        if(!(GameFunctions.distanceBetweenPoints(this, element) < (this.r + element.r))){
                            this.damaged = false
                            clearInterval(timer)
                        }                       
                    },100)
                }
                
                
            }
            
        }
    }
    changeSpeedFromHit(element){
        this.damaged - true
        setTimeout(()=>{
            this.damaged = false
        },100)
        
        let item ={
            pos :{
                "x": element.acceleration.x,
                "y": element.acceleration.y,
            }
        }
        
        let angle = GameFunctions.angle(element, this)

        this.angle = angle

        this.reset()
    }
    
    changeSpeedFromAstr(element){
        
        let hit_angle = this.angle - element.angle 
       
        
        this.angle -= hit_angle 
        element.angle += hit_angle 
        element.reset()

        this.reset()
    }
}