import {Config} from "./config.js";

export class Render{

    constructor(engine) {
        
        this.engine = engine        
        this.canvas = document.getElementById('cnv')
        this.ctx = this.canvas.getContext('2d')
        this.background_image = new Image()
        // get random background
        this.background_image.src = Config.background_image_pull[Math.floor(Math.random() * Config.background_image_pull.length)]
        // array of visual effects
        this.effects = []
        this.hud_info = Config.hud_info
     
    }
    // delete the effect from array
    deleteEffect(item){
        this.effects = this.effects.filter( elem => {
            return elem != item
        })
    }
    // draw full game frame
    drawFrame(bh, astr, player, power_up){
        // clear
        this.ctx.clearRect(0,0,900,900)
        // background
        this.drawBG()
        // black hole
        this.drawBlackHole(bh)
        // asteroids
        this.drawAsteroids(astr)
        // player
        this.drawPlayer(player)
        // player projectiles
        this.drawProjectiles(player.projectiles)
        // effects
        this.drawEffects(bh)
        // power ups
        this.drawPowerUp(power_up)
        // draw info
        this.pushInfo()
    }

    drawPowerUp(array){
        for( let i = 0 ; i < array.length; i ++){
            let item = array[i]
            this.ctx.drawImage(item.image, 0,0,15,15,item.pos.x - item.r , (item.pos.y - item.r) + Math.cos(item.woble_angle),30, 30 )
        }
    }

    pushInfo(){
        // draw info about game
        this.hud_info.l_skill_info.innerText = this.engine.player.l_click_item.name
        this.hud_info.r_skill_info.innerText = this.engine.player.r_click_item ? this.engine.player.r_click_item.name : ''
        this.hud_info.l_sign_info.style.backgroundColor = this.engine.player.l_click_item.avalaible ? 'green' : 'red'
        this.hud_info.r_sign_info.style.backgroundColor = !this.engine.player.r_click_item ? 'red' : this.engine.player.r_click_item.avalaible ? 'green' : "red"
        this.hud_info.timer.innerText = `timer : ` + this.engine.timer
        this.hud_info.mass_info.innerText = `mass : ` + this.engine.player.mass
        this.hud_info.acceleration_info.innerText = `accel : ` + this.engine.player.acceleration_step
        this.hud_info.cd_info.innerText = `cd : ` + this.engine.player.cd_redaction
        this.hud_info.bh_power_info.innerText = `bh power : ` + this.engine.black_hole.power
        this.hud_info.bh_radius_info.innerText = `bh radius : ` + this.engine.black_hole.radius
        this.hud_info.bh_influence_info.innerText = `bh influence : ` + this.engine.black_hole.radius_of_influence
    }

    drawEffects(bh){
        for(let i = 0;i < this.effects.length; i++){
            let item = this.effects[i]
                switch (item.type){
                    case 'explosion':
                        this.ctx.drawImage(item.image, item.radius * item.frame +1, 0, item.radius-1, item.radius, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'explosion fire':
                        this.ctx.drawImage(item.image, 143 * item.frame , 0, 143, 147, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'power up':
                        this.ctx.drawImage(item.image, 40 * item.frame, 0, 40, 40, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'suction':
                        this.ctx.drawImage(item.image, 160 * item.frame, 0, 160, 160, bh.pos.x - bh.radius * 1.1, bh.pos.y - bh.radius * 1.1, bh.radius * 2.2, bh.radius * 2.2)
                        break;
                    case 'after cast':
                        this.ctx.drawImage(item.image, 15 * item.frame, 0, 15, 15, (item.pos.x - item.radius/2) + 20, (item.pos.y - item.radius/2) - 12,item.radius, item.radius)
                        break;
                }
            item.act()
        }
    }

    drawBG(){
        this.ctx.drawImage( this.background_image, 0 , 0 , 900 , 900 , 0, 0 , 900 , 900 )
    }

    drawBlackHole(item){
        this.ctx.fillStyle = 'black'
        this.ctx.beginPath();
        this.ctx.arc(item.pos.x, item.pos.y, item.radius , 0 ,2 * Math.PI, false)
        this.ctx.fill()
        this.ctx.closePath()
        this.ctx.drawImage(item.image, 363 * item.frame,0, 363, 363, item.pos.x - item.radius * 1.15, item.pos.y - item.radius * 1.15, item.radius * 2.3, item.radius *2.3)
    }

    drawAsteroids(array){          
        array.forEach( elem => {
            this.ctx.translate(elem.pos.x, elem.pos.y);
            this.ctx.rotate(-elem.angle);
            this.ctx.drawImage(elem.image, 40 * elem.frame, 0 ,40,40,- elem.r , - elem.r , elem.r * 2 , elem.r * 2);
            this.ctx.rotate(elem.angle);
            this.ctx.translate(-elem.pos.x, -elem.pos.y);
        })
    }

    drawPlayer(item){
        function flipHorizontally(context, around){
            context.translate(around , 0);
            context.scale(-1, 1);
            context.translate(-around, 0)
        }
        this.ctx.save()
        // if player looks left
        if(item.fliped){
            flipHorizontally(this.ctx, item.pos.x)
        }
        switch(item.state){
            case 'idle':
                this.ctx.drawImage(item.idle_image, 100 * item.frame, 0,100,225,item.pos.x - item.width/2 , item.pos.y - item.height/2 + Math.cos(item.woble_angle)*4,item.width, item.height )
                break;
            case 'damage':
                this.ctx.drawImage(item.damage_image, 100 * item.frame, 0,100,225,item.pos.x - item.width/2 , item.pos.y - item.height/2 ,item.width, item.height )
                break;
            case 'move':
                this.ctx.drawImage(item.move_image, 100 * item.frame, 0,100,225,item.pos.x - item.width/2 , item.pos.y - item.height/2 ,item.width, item.height )
                break;   
            case 'cast':
                this.ctx.drawImage(item.cast_image, 100 * item.frame, 0,100,225,item.pos.x - item.width/2 , item.pos.y - item.height/2 ,item.width, item.height )
                break;
        }
        this.ctx.restore()
    }
    
    drawProjectiles(array){
        array.forEach( elem => {
            switch ( elem.type){
                case "death comet":
                    this.ctx.translate(elem.pos.x, elem.pos.y);
                    this.ctx.rotate(-elem.angle);
                    this.ctx.drawImage(elem.image, 25 * elem.frame, 0 ,25,25,(- elem.r - elem.draw_offset) / 2, (- elem.r - elem.draw_offset) / 2, elem.r + elem.draw_offset, elem.r + elem.draw_offset);
                    this.ctx.rotate(elem.angle);
                    this.ctx.translate(-elem.pos.x, -elem.pos.y);
                    break;
                case "gravinado":
                    this.ctx.drawImage(elem.image, 30 * elem.frame, 0 ,30 ,30 , elem.pos.x - elem.r, elem.pos.y - elem.r, elem.r * 2, elem.r * 2)
                    break
                case 'defend matrix':
                    this.ctx.drawImage(elem.image, 50 * elem.frame +1 , 0 ,49,50, elem.parrent.pos.x - elem.r , elem.parrent.pos.y - elem.r , elem.r * 2 , elem.r * 2);
                    break;
                case 'worm hole':
                    this.ctx.drawImage(elem.image, 50 * elem.frame +1 , 0 ,49,50, elem.parrent.pos.x - elem.r , elem.parrent.pos.y - elem.r , elem.r * 2 , elem.r * 2);
                    break;
                case 'dying star':
                    this.ctx.drawImage(elem.image, 40 * elem.frame, 0 ,40,40, elem.pos.x - elem.r/2 , elem.pos.y - elem.r/2 , elem.r , elem.r);
                    break;
            }
        })
    }
}