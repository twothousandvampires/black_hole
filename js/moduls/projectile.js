import { GameFunctions } from "./game_functions.js"
import { Effect } from './effect.js'
import { Player } from "./player.js"


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
            case 'gravinado':
                this.r = 30
                this.max_frame  = 5
                this.draw_offset = 0
                this.image.src = './resources/img/tornado.png'
                this.mass = 15
                this.speed = 1
                break;
            case 'death comet':
                this.r = 20
                this.max_frame  = 4
                this.image.src = './resources/img/explosive_skull.png'
                this.draw_offset = 5
                this.mass = 500
                this.speed = 2
                break;
            case 'defend matrix':
                this.r = 50
                this.max_frame = 22
                this.image.src = './resources/img/defend_matrix.png'
                break;
            case 'worm hole':
                this.after_teleport = false
                setTimeout( () => {
                    this.after_teleport = true
                },700)
                this.r = 50
                this.max_frame = 12
                this.image.src = './resources/img/teleport.png'
                break;
            case 'dying star':   
                this.r = 30              
                this.max_frame = 15
                this.image.src = './resources/img/dying_sun.png'
                break;
        }
    }
 
    act(asteroids, bh){
        switch (this.type){
            case 'death comet':
                this.frame_timer += 0.1
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;
                case 'gravinado':
                this.frame_timer += 0.4
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;
            case 'defend matrix':
                this.pos = this.parrent.pos
                this.frame_timer += 0.5
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;
            case 'worm hole':               
                this.pos = this.parrent.pos
                this.frame_timer += 0.2
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame >= this.max_frame){
                        this.frame = 0
                    }
                }
                break;
            case 'dying star':               
                this.frame_timer += 0.15
                if(this.frame_timer >=1){
                    this.frame_timer = 0
                    this.frame ++
                    
                    if(this.frame >= this.max_frame){
                        function recoursive(item, array , render){
                            console.log(render)
                            for(let i = 0; i < array.length; i++){
                                const elem = array[i]
                                if((GameFunctions.distanceBetweenPoints(item, elem) < 140 + elem.r) && (!elem.destroyed)){
                                    console.log(elem)
                                    render.effects.push(new Effect('explosion fire', render, elem.pos,0))
                                    elem.destroyed = true
                                    elem.parrent.deleteAsteroid(elem)
                                    recoursive(elem, array ,render)                                    
                                }
                            }

                        }
                        this.parrent.render.effects.push(new Effect('explosion fire', this.parrent.render, this.pos,0))
                        recoursive(this, asteroids , this.parrent.render)
                                      
                        this.parrent.deleteProj(this)
                        
                    }
                }
                
                break;
        }

        asteroids.forEach(element => {
            if(GameFunctions.distanceBetweenPoints(this, element) < (this.r + element.r)){
                switch(this.type){
                    case 'gravinado':
                        element.angle = this.angle
                        element.reset()
                        this.parrent.deleteProj(this)
                        break;
                    case 'defend matrix':
                        element.angle = GameFunctions.angle(this.parrent, element)
                        element.reset()
                        break;
                    case 'worm hole':
                        if(this.after_teleport){
                            for(let i = 0; i < asteroids.length; i++){
                                if(GameFunctions.distanceBetweenPoints(this, asteroids[i]) < 80 + asteroids[i].r){
                                    this.parrent.render.effects.push(new Effect('explosion', this.parrent.render, this.pos))
                                    asteroids[i].parrent.deleteAsteroid(asteroids[i])
                                }
                            }
                        }
                        break;
                    case 'death comet':
                        let explosion_point = {
                            pos: {
                                "x" : this.pos.x + Math.sin(GameFunctions.angle(this,element)),
                                "y" : this.pos.y + Math.cos(GameFunctions.angle(this,element))
                            }                        
                        }
                        this.parrent.deleteProj(this)
                        this.parrent.render.effects.push(new Effect('explosion fire', this.parrent.render, {"x":explosion_point.pos.x, "y":explosion_point.pos.y}))
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
        if(this.type !== 'defend matrix' && this.type !== 'worm hole' && this.type !== 'dying star'){
            if(bh.intersect(this)){
                let distance_to_event = bh.distanceToEvent(this)
                let power = distance_to_event/bh.radius_of_influence
                power = power > 1 ? 1 : power
                power = power < 0.3 ? 0.3 : power
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

                this.pos.x += Math.sin(this.angle) * (this.speed + (bh.power * (1-power)))
                this.pos.y += Math.cos(this.angle) * (this.speed + (bh.power * (1-power)))
                }
                else {
                    this.pos.x += Math.sin(this.angle) * this.speed
                    this.pos.y += Math.cos(this.angle) * this.speed
                }
            }
            if(bh.intersectEvent(this)){
                if(this.type !== 'defend matrix' && this.type !== 'worm hole' && this.type !== 'dying star'){
                    bh.grow(this.mass)
                    this.parrent.deleteProj(this)
                }
            }
    }
}