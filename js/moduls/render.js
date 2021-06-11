import {Config} from "./config.js";
import { Player } from "./player.js";

export class Render{
      
        static canvas = document.getElementById('cnv')
        static ctx = Render.canvas.getContext('2d')
        // get random background
        static background_image = Config.getBgImage()
        // array of visual effects
        static effects = []
        static hud_info = Config.hud_info
     
    // delete the effect from array
    static deleteEffect(item){
        Render.effects = Render.effects.filter( elem => {
            return elem != item
        })
    }
    // draw full game frame
    static drawFrame(engine){
    
        // clear
        this.ctx.clearRect(0,0,900,900)
        // background
        Render.drawBG()
        // black hole
        Render.drawBlackHole(engine.black_hole)
        // asteroids
        Render.drawAsteroids(engine.asteroinds_mass)
        // player
        Render.drawPlayer(engine.player)
        // player projectiles
        Render.drawProjectiles(engine.player.projectiles)
        // effects
        Render.drawEffects(engine.black_hole)
        // power ups
        Render.drawPowerUp(engine.power_up_array)
        // draw info
        Render.pushInfo(engine.timer, engine.black_hole, engine.player)
    }

    static drawPowerUp(array){
        for( let i = 0 ; i < array.length; i ++){
            let item = array[i]
            Render.ctx.drawImage(item.image, 0,0,30,30,item.pos.x - item.r , (item.pos.y - item.r) + Math.cos(item.woble_angle),30, 30 )
        }
    }

    static pushInfo(timer, bh , player){
        // draw info about game
        this.hud_info.l_skill_info.innerText = player.l_click_item.name
        this.hud_info.r_skill_info.innerText = player.r_click_item ? player.r_click_item.name : ''
        this.hud_info.l_sign_info.style.backgroundColor = player.l_click_item.avalaible ? 'green' : 'red'
        this.hud_info.r_sign_info.style.backgroundColor = !player.r_click_item ? 'red' : player.r_click_item.avalaible ? 'green' : "red"
        this.hud_info.timer.innerText = `timer : ` + Math.round(timer/10)
        this.hud_info.mass_info.innerText = `mass : ` + player.mass
        this.hud_info.acceleration_info.innerText = `accel : ` + player.acceleration_step
        this.hud_info.cd_info.innerText = `cd : ` + player.cd_redaction
        this.hud_info.bh_power_info.innerText = `bh power : ` + bh.power
        this.hud_info.bh_radius_info.innerText = `bh radius : ` + bh.radius
        this.hud_info.bh_influence_info.innerText = `bh influence : ` + bh.radius_of_influence
    }

    static drawEffects(bh){
        for(let i = 0;i < this.effects.length; i++){
            let item = this.effects[i]
                switch (item.type){
                    case 'explosion':
                        Render.ctx.drawImage(item.image, item.radius * item.frame +1, 0, item.radius-1, item.radius, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'explosion fire':
                        Render.ctx.drawImage(item.image, 143 * item.frame , 0, 143, 147, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'power up':
                        Render.ctx.drawImage(item.image, 40 * item.frame, 0, 40, 40, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'suction':
                        Render.ctx.drawImage(item.image, 160 * item.frame, 0, 160, 160, bh.pos.x - bh.radius * 1.1, bh.pos.y - bh.radius * 1.1, bh.radius * 2.2, bh.radius * 2.2)
                        break;
                    case 'after cast':
                        Render.ctx.drawImage(item.image, 15 * item.frame, 0, 15, 15, (item.pos.x - item.radius/2) + 20, (item.pos.y - item.radius/2) - 12,item.radius, item.radius)
                        break;
                    case 'cosmic explosion':
                        Render.ctx.drawImage(item.image, 140 * item.frame, 0, 140, 140, item.pos.x - item.radius, item.pos.y - item.radius,item.radius * 2, item.radius * 2)
                        break;
                }
            item.act()
        }
    }

    static drawBG(){
        Render.ctx.drawImage( Render.background_image, 0 , 0 , 900 , 900 , 0, 0 , 900 , 900 )
    }

    static drawBlackHole(item){
        Render.ctx.fillStyle = 'black'
        Render.ctx.beginPath();
        Render.ctx.arc(item.pos.x, item.pos.y, item.radius , 0 ,2 * Math.PI, false)
        Render.ctx.fill()
        Render.ctx.closePath()
        Render.ctx.drawImage(item.image, 363 * item.frame,0, 363, 363, item.pos.x - item.radius * 1.15, item.pos.y - item.radius * 1.15, item.radius * 2.3, item.radius *2.3)
    }

    static drawAsteroids(array){          
        array.forEach( elem => {
            Render.ctx.translate(elem.pos.x, elem.pos.y);
            Render.ctx.rotate(-elem.angle);
            Render.ctx.drawImage(elem.image, 40 * elem.frame, 0 ,40,40,- elem.r , - elem.r , elem.r * 2 , elem.r * 2);
            Render.ctx.rotate(elem.angle);
            Render.ctx.translate(-elem.pos.x, -elem.pos.y);
        })
    }

    static drawPlayer(player){
        function flipHorizontally(context, around){
            context.translate(around , 0);
            context.scale(-1, 1);
            context.translate(-around, 0)
        }
        Render.ctx.save()
        // if player looks left
        if(player.fliped){
            flipHorizontally(Render.ctx, player.pos.x)
        }
        switch(player.state){
            case 'idle':
                Render.ctx.drawImage(player.idle_image, 100 * player.frame, 0,100,225,player.pos.x - player.width/2 , player.pos.y - player.height/2 + Math.cos(player.woble_angle)*4,player.width, player.height )
                break;
            case 'damage':
                Render.ctx.drawImage(player.damage_image, 100 * player.frame, 0,100,225,player.pos.x - player.width/2 , player.pos.y - player.height/2 ,player.width, player.height )
                break;
            case 'move':
                Render.ctx.drawImage(player.move_image, 100 * player.frame, 0,100,225,player.pos.x - player.width/2 , player.pos.y - player.height/2 ,player.width, player.height )
                break;   
            case 'cast':
                Render.ctx.drawImage(player.cast_image, 100 * player.frame, 0,100,225,player.pos.x - player.width/2 , player.pos.y - player.height/2 ,player.width, player.height )
                break;
        }
        Render.ctx.restore()
    }
    
    static drawProjectiles(array){
        array.forEach( elem => {
            switch ( elem.type){
                case "death comet":
                    Render.ctx.translate(elem.pos.x, elem.pos.y);
                    Render.ctx.rotate(-elem.angle);
                    Render.ctx.drawImage(elem.image, 25 * elem.frame, 0 ,25,25,(- elem.r - elem.draw_offset) / 2, (- elem.r - elem.draw_offset) / 2, elem.r + elem.draw_offset, elem.r + elem.draw_offset);
                    Render.ctx.rotate(elem.angle);
                    Render.ctx.translate(-elem.pos.x, -elem.pos.y);
                    break;
                case "space crusher":
                    Render.ctx.translate(elem.pos.x, elem.pos.y);
                    Render.ctx.rotate(-elem.angle);
                    Render.ctx.drawImage(elem.image, 120 * elem.frame, 0 ,120,120,- 50, - 50, 100, 100);
                    Render.ctx.rotate(elem.angle);
                    Render.ctx.translate(-elem.pos.x, -elem.pos.y);
                        break;
                case "cosmic implosion":
                    Render.ctx.translate(elem.pos.x, elem.pos.y);
                    Render.ctx.rotate(-elem.angle);
                    Render.ctx.drawImage(elem.image, 48 * elem.frame, 0 ,48,80,(- elem.r ) / 2, (- elem.r) / 2, elem.r , elem.r );
                    Render.ctx.rotate(elem.angle);
                    Render.ctx.translate(-elem.pos.x, -elem.pos.y);
                    break;
                case "frozen rail":
                    Render.ctx.translate(elem.pos.x, elem.pos.y);
                    Render.ctx.rotate(-elem.angle);
                    Render.ctx.drawImage(elem.image, 60 * elem.frame, 0 ,60,60,(- elem.r ) / 2, (- elem.r) / 2, elem.r *2 , elem.r *2 );
                    Render.ctx.rotate(elem.angle);
                    Render.ctx.translate(-elem.pos.x, -elem.pos.y);
                    break;
                case "gravinado":
                    Render.ctx.drawImage(elem.image, 30 * elem.frame, 0 ,30 ,30 , elem.pos.x - elem.r, elem.pos.y - elem.r, elem.r * 2, elem.r * 2)
                    break
                case 'defend matrix':
                    Render.ctx.drawImage(elem.image, 50 * elem.frame +1 , 0 ,49,50, elem.parrent.pos.x - elem.r , elem.parrent.pos.y - elem.r , elem.r * 2 , elem.r * 2);
                    break;
                case 'massive wave':
                    Render.ctx.drawImage(elem.image, 140 * elem.frame  , 0 ,140,140, elem.parrent.pos.x - elem.r/2 , elem.parrent.pos.y - elem.r/2 , elem.r  , elem.r);
                    break;
                case 'worm hole':
                    Render.ctx.drawImage(elem.image, 50 * elem.frame +1 , 0 ,49,50, elem.parrent.pos.x - elem.r , elem.parrent.pos.y - elem.r , elem.r * 2 , elem.r * 2);
                    break;
                case 'dying star':
                    Render.ctx.drawImage(elem.image, 40 * elem.frame, 0 ,40,40, elem.pos.x - elem.r/2 , elem.pos.y - elem.r/2 , elem.r , elem.r);
                    break;
            }
        })
    }
}