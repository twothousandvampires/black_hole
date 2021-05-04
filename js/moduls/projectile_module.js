import { GameFunctions } from "./game_functions.js"
import { Effect } from './effect_module.js'


export class Projectile {

    constructor(parrent,pos,angle, type){
        this.parrent = parrent
        this.frame_timer = 0
        this.frame = 0 
        this.pos = pos
        this.type = type
        this.angle = angle
        this.image = new Image()
        this.x_move = Math.sin(this.angle)
        this.y_move = Math.cos(this.angle)

        switch(type){
            case 'gravity':
                this.r = 30
                this.max_frame  = 5
                this.draw_offset = 0
                this.image.src = './resources/img/tornado.png'
                this.mass = 1
                this.speed = 1
                break;
            case 'fire':
                this.r = 20
                this.max_frame  = 4
                this.image.src = './resources/img/explosive_skull.png'
                this.draw_offset = 5
                this.mass = 500
                this.speed = 2
                break;
        }
    }
 
    act(asteroids, bh){
        switch (this.type){
            case 'fire':
                this.frame_timer += 0.1
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;  case 'gravity':
                this.frame_timer += 0.5123

                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;

        }

        asteroids.forEach(element => {
            if(GameFunctions.distanceBetweenPoints(this, element) < (this.r + element.r)){
                switch(this.type){
                    case 'gravity':
                        element.angle = this.angle
                        element.reset()
                        this.parrent.deleteProj(this)
                        break;
                    case 'fire':
                        let explosion_point = {
                            pos: {
                                "x" : this.pos.x + Math.sin(GameFunctions.angle(this,element)),
                                "y" : this.pos.y + Math.cos(GameFunctions.angle(this,element))
                            }                        
                        }
                        this.parrent.deleteProj(this)
                        this.parrent.render.effects.push(new Effect('explosion', this.parrent.render, {"x":explosion_point.pos.x, "y":explosion_point.pos.y}))
                       
                        for(let i = 0; i < asteroids.length; i++){
                            if(GameFunctions.distanceBetweenPoints(explosion_point, asteroids[i]) < 80 + asteroids[i].r){
                                
                                asteroids[i].parrent.deleteAsteroid(asteroids[i])
                                console.log(this.parrent.render.effects)
                            }
                        }                       
                        
                        break;
                }
                
                
                
            }
        });
        if(bh.intersect(this)){
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

            this.x_move += xm/(this.mass * 4)

            this.y_move += ym/(this.mass * 4)

            let new_angle = GameFunctions.angle(this, { pos : {"x" : this.pos.x + this.x_move , "y" : this.pos.y + this.y_move }})

            this.angle = new_angle

            // GameFunctions.drawPoint({ pos : {"x" : this.pos.x + x_movie , "y" : this.pos.y + y_movie } }, "yellow")
            // console.log(GameFunctions.angle(this, { pos : {"x" : this.pos.x + x_movie , "y" : this.pos.y + y_movie }}))

            console.log(this.speed *(1 + (1 - power)))

            this.pos.x += Math.sin(this.angle) * (this.speed * (1.3 + (1 - power)))
            this.pos.y += Math.cos(this.angle) * (this.speed * (1.3 + (1 - power))) 
        }
        else {
            this.pos.x += Math.sin(this.angle) * this.speed
            this.pos.y += Math.cos(this.angle) * this.speed 
        }
        if(bh.intersectEvent(this)){            
            bh.grow(this.mass)
            this.parrent.deleteProj(this)
        }
      
    }

}