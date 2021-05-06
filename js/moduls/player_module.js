import  { Input } from "./input_module.js";
import { GameFunctions } from "./game_functions.js"
import { Projectile } from "./projectile_module.js"
import  { Skill } from "./skill_module.js";

export class Player{
    constructor(render) {
        this.render = render
        this.pos = {
           "x" : 450,
           "y" : 100  
        }
        this.acceleration = {
            "x" : 0,
            "y" : 0
        }
        this.imune = false
        this.cd_redaction = 0
        this.speed = 3
        this.mass = 10
        this.width = 30
        this.height = 60
        this.input = new Input()
        this.color = 'black'
        this.acceleration_step = 0.02
        this.damaged = false
        this.projectiles = []
        this.l_click_item = new Skill(this, 'gravinado', this.render)
        this.r_click_item = undefined
        this.can_be_gravitate = true
    }
    getImune(time){
        this.imune = true
        setTimeout(()=>{
            this.imune = false
        } ,time * 1000)
    }
    act(bh , ast){
        let input = this.input.getInput()

        this.projectiles.forEach( elem => {
            elem.act(ast, bh)
        })
        if(input.m_left){
            this.left_click(input)
        }
        if(input.m_right){
            this.right_click(input)
        }
        this.color = 'black'
        let x_movie = 0;
        let y_movie = 0;
                
        if(input.w && !this.damaged) {   
                        this.acceleration.y -= this.acceleration_step
                        if(this.acceleration.y < -1)
                        {   
                            this.acceleration.y = -1
                        }

        }
        if(input.s && !this.damaged)  { 
                        this.acceleration.y += this.acceleration_step 

                        if(this.acceleration.y > 1) 
                        {
                             this.acceleration.y = 1} 
                        }
        if(input.d && !this.damaged)  {  
                        this.acceleration.x +=  this.acceleration_step; 
                        if(this.acceleration.x > 1)
                        {
                            this.acceleration.x = 1}  
                        }
        if(input.a && !this.damaged)  {  this.acceleration.x -=  this.acceleration_step  
                        if(this.acceleration.x < -1)
                        {
                            this.acceleration.x = -1} 
                        }
        
        if(!input || this.damaged){
            
            if(Math.abs(this.acceleration.x) < this.acceleration_step ){
                this.acceleration.x = 0
            }
            if(Math.abs(this.acceleration.y) < this.acceleration_step ){
                this.acceleration.y = 0
            }
            if(this.acceleration.x != 0){
                x_movie = this.acceleration.x
                this.acceleration.x += this.acceleration.x > 0 ? -this.acceleration_step : this.acceleration_step
            }
            if(this.acceleration.y != 0){
                y_movie = this.acceleration.y
                this.acceleration.y += this.acceleration.y > 0 ? -this.acceleration_step : this.acceleration_step
            }

        }

        x_movie = this.acceleration.x
        y_movie = this.acceleration.y

        if(bh.intersectPlayer(this) && this.can_be_gravitate){
            
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

            

            x_movie += xm/(this.mass/10)
            
            y_movie += ym/(this.mass/10)

            
            this.pos.x += x_movie * (this.speed + (bh.power * (1-power)))
            this.pos.y += y_movie * (this.speed + (bh.power * (1-power)))
        }
        else {
            this.pos.x += x_movie * this.speed
            this.pos.y += y_movie * this.speed
        }
       
        ast.forEach(element => {
            let thisDistanceX = Math.abs(element.pos.x - this.pos.x);
            let thisDistanceY = Math.abs(element.pos.y - this.pos.y);
        
            if (thisDistanceX > (this.width/2 + element.r)) { return false; }
            if (thisDistanceY > (this.height/2 + element.r)) { return false; }
        
            let cornerDistance_sq = (thisDistanceX - this.width/2)^2 +
            (thisDistanceY - this.height/2)^2;
        
            if(cornerDistance_sq <= (element.r^2) || thisDistanceX <= (this.width/2) || thisDistanceY <= (this.height/2)){
                if(!this.damaged && !this.imune){
                    this.damaged = true
                    
                    let angle = GameFunctions.angle(element, this)

                    this.acceleration.x = Math.sin(angle)
                    this.acceleration.y = Math.cos(angle)

                    element.changeSpeedFromHit(this)
                    setTimeout(()=>{
                        this.damaged = false
                    },1000)
                }
                
            }
        });
    }
    left_click(input){
        this.l_click_item.do(input , this)
    }
    right_click(input){
        this.r_click_item.do(input , this)
    }
    deleteProj(item){
        this.projectiles = this.projectiles.filter( elem => {            
            return elem != item
        })
    }
}