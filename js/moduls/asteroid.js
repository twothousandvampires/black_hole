import { GameFunctions } from "./game_functions.js"
import {Effect} from "./effect.js";
import { Render } from "./render.js";

export class Asteroid{

    constructor(parrent ,pos ,angle,mass, comet) {
        if(comet){
            // this flag makes some properties different
            this.comet = true
        }
        this.destroyed = false
        this.damaged = false
        this.frame_timer = 0
        this.frame = 0
        this.max_frame = 7
        this.parrent = parrent
        this.mass = mass
        this.pos = pos
        this.angle = angle
        this.size = mass
        this.speed = 20/mass
        if(this.comet){
            this.speed = 100/mass
        }
        this.image = new Image()
        this.image.src = './resources/img/asteroid.png'
        if(this.comet){
            this.image.src = './resources/img/comet.png'
        }
        this.x_movie = Math.sin(this.angle)
        this.y_movie = Math.cos(this.angle)
        this.r = mass/2
        if(this.comet){
            this.r = mass/5
        }
        this.frozen = false       
    }
    
    reset(){
        //reset the x and y step depending on the angle
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
        // rotate the asteroid depending on the him mass
        if(!this.comet && !this.frozen){
            this.frame_timer += 0.2
            if(this.frame_timer > this.mass/30){
                this.frame++
                this.frame_timer = 0
                if(this.frame === this.max_frame){
                    this.frame = 0
                }
            }
        }
        else if(this.comet){
            this.frame_timer += 0.5
            if(this.frame_timer > this.mass/300){
                this.frame++
                this.frame_timer = 0
                if(this.frame === this.max_frame){
                    this.frame = 0
                }
            }
        }
        // if an asteroid collides with a black hole
        if(bh.intersectEvent(this)){
            if(!this.comet){
                let a = GameFunctions.angle(this, bh)
                Render.effects.push(new Effect('suction',{ "x" : bh.pos.x - bh.radius, "y" : bh.pos.y - bh.radius} , a))
                this.parrent.deleteAsteroid(this)
                bh.grow(this.mass)
            }
            else{
                bh.reduce(this.mass)
                this.parrent.deleteAsteroid(this)
                
            }
        }
        // if an asteroid collides with a black hole attracted zone
        else if(bh.intersect(this)){
            let distance_to_event = bh.distanceToEvent(this)
            // power based on distance to black hole
            let power = distance_to_event/bh.radius_of_influence
            power = power > 1 ? 1 : power
            let xm = 0;
            let ym = 0;
            // get x and y offsets to black hole
            if(this.pos.x < bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x < bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
            // change it based on the power and the black hole power
            xm = (xm * (1 - power)) * bh.power
            ym = (ym * (1 - power)) *  bh.power
            // set the x abd y step based on item mass
            if(!this.comet){
                this.x_movie += xm/(this.mass * 4)
                this.y_movie += ym/(this.mass * 4)
            }
            else{
                this.x_movie += xm/(this.mass * 10)
                this.y_movie += ym/(this.mass * 10)
            }
            // set new angle
            let new_angle = GameFunctions.angle(this, { pos : {"x" : this.pos.x + this.x_movie , "y" : this.pos.y + this.y_movie }})

            this.angle = new_angle
            // set the new position
            this.pos.x += Math.sin(this.angle) * (this.speed + (bh.power * (1-power)))
            this.pos.y += Math.cos(this.angle) * (this.speed + (bh.power * (1-power)))
        }
        else {
            // set the new position
            this.pos.x += Math.sin(this.angle) * this.speed
            this.pos.y += Math.cos(this.angle) * this.speed
        }
        // check the asteroid collision
        for (let i = 0; i < astr.length; i++) {
            const element = astr[i];
            if(GameFunctions.distanceBetweenPoints(this, element) < (this.r + element.r)){
                if(this !== element && !this.damaged && !this.frozen ){
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
        this.damaged = true
        setTimeout(()=>{
            this.damaged = false
        },100)
        let angle = GameFunctions.angle(element, this)
        this.angle = angle
        this.reset()
    }
    
    changeSpeedFromAstr(element){
        if(!this.comet){
            
            let hit_angle = this.angle - element.angle
            this.angle -= hit_angle
            if(!element.comet){
                element.angle += hit_angle
                element.reset()
            }
            this.reset()
        }
        else {
            if(!element.comet){
                if( Math.random() > 0.5){
                    element.angle = this.angle + Math.PI
                }
                else {
                    element.angle = this.angle - Math.PI
                }
                element.reset()
            }
        }
    }
}