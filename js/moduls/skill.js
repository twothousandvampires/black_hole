import {GameFunctions} from "./game_functions.js";
import {Projectile} from "./projectile.js";

export class Skill{
    constructor(player ,name, render, pos) {
        this.image = new Image()
        this.pos = pos
        this.avalaible = true
        this.name = name
        this.player = player
        this.render = render
        this.woble_angle = 0;
        this.r = 15
        this.init()       
    }

    check(){
        console.log(this.count)
        if(this.count){
            this.count --;
            if(this.count === 0){
                if(this.type === 'left'){
                    this.player.left = new Skill(this.player , 'gravinado')
                }
                else {
                    this.player[this.type] = undefined
                }
            }
        }
    }

    act(player, engine){
        this.woble_angle += 0.1
        if(this.woble_angle > 2 * Math.PI){
            this.woble_angle = 0
        }
        let thisDistanceX = Math.abs(player.pos.x - this.pos.x);
        let thisDistanceY = Math.abs(player.pos.y - this.pos.y);

        if (thisDistanceX > (player.width/2 + this.r)) { return false; }
        if (thisDistanceY > (player.height/2 + this.r)) { return false; }

        let cornerDistance_sq = (thisDistanceX - player.width/2)^2 +
            (thisDistanceY - this.player/2)^2;

        if(cornerDistance_sq <= (this.r^2) || thisDistanceX <= (player.width/2) || thisDistanceY <= (player.height/2)) {
                console.log(this)
                this.pickUp(player)
                engine.deletePowerUp((this))
            }
        }

    init(){
        switch (this.name){
            case 'gravinado':
                this.cd = 3500;
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let new_proj = new Projectile(player, {'x' : player.pos.x, "y" : player.pos.y},angle,'gravinado')
                        player.projectiles.push(new_proj)
                            setTimeout(() => {
                                player.deleteProj(new_proj)
                            }, 16000)
                            setTimeout(()=>{
                                this.avalaible = true
                            }, this.cd - player.cd_redaction)
                        }
                    }
                break;
            case 'massive wave':
                this.count = 2
                this.type = 'power'
                this.image.src = './resources/pic_mini/massive_wave.png'
                this.cd = 7500;
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        let new_proj = new Projectile(player, {'x' : player.pos.x, "y" : player.pos.y},0,'massive wave')
                        player.projectiles.push(new_proj)
                            setTimeout(()=>{
                                this.avalaible = true
                            }, this.cd - player.cd_redaction)
                        }
                    }
                    this.pickUp = function (player){
                        player.power = this
                    }
            break;
            case 'space crusher':
                this.type = 'left'
                this.count = 8
                this.image.src = './resources/pic_mini/space_crusher.png'
                this.cd = 1500;
                this.do = function (input, player){
                    if(this.avalaible){
                        let x = player.pos.x
                        let y = player.pos.y
                        this.avalaible = false
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let new_proj = new Projectile(player, {'x' : x + Math.sin(angle) * 60, "y" : y + Math.cos(angle) * 60},angle,'space crusher')
                        player.projectiles.push(new_proj)
                            setTimeout(()=>{
                                this.avalaible = true
                            }, this.cd - player.cd_redaction)
                        }
                    }
                this.pickUp = function (player){
                    player.left = this
                }
            break;
            case 'death comet':
                this.type = 'right'
                this.count = 3
                this.image.src = './resources/pic_mini/death_comet.png'
                this.cd = 10000
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let new_proj = new Projectile(player, {'x' : player.pos.x, "y" : player.pos.y},angle,'death comet')
                        player.projectiles.push(new_proj)
                        console.log(new_proj)
                        setTimeout(() => {
                            player.deleteProj(new_proj)
                        }, 16000)
                        setTimeout(()=>{
                            this.avalaible = true
                        }, this.cd - player.cd_redaction)
                    }
                }
                this.pickUp = function (player){
                    player.right = this
                }
                break
            case 'defend matrix':
                this.count = 5
                this.type = 'left'
                this.image.src = './resources/pic_mini/dm_mini.png'
                this.cd = 6000;
                this.do = function (input, player){
                    if(this.avalaible){
                        player.getImmunity(2)
                        player.can_be_attracted = false
                        this.avalaible = false
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let new_proj = new Projectile(player, {'x' : player.pos.x, "y" : player.pos.y},angle,'defend matrix')
                        player.projectiles.push(new_proj)
                        console.log(new_proj)
                        setTimeout(() => {
                            player.can_be_attracted= true
                            player.deleteProj(new_proj)
                        }, 2000)
                        setTimeout(()=>{
                            
                            this.avalaible = true
                        }, this.cd - player.cd_redaction)
                    }
                }
                this.pickUp = function (player){
                    player.left = this
                }
                break;
            case 'grow mass':
                this.image.src = './resources/pic_mini/mass_up.png'
                this.pickUp = function (player){
                    player.mass += 10
                }
                break
            case 'dying star':
                this.count = 1
                this.type = 'power'
                this.clickable = false
                this.cd = 2000

                    this.image.src = './resources/pic_mini/dying_star.png'
                    this.do = function(input, player){
                        if(this.avalaible){
                            this.avalaible = false
                            let x = player.pos.x
                            let y = player.pos.y
                            let new_proj = new Projectile(player, {'x' : x, "y" : y},0,'dying star')
                                player.projectiles.push(new_proj)
                            setTimeout(() =>{
                                this.avalaible = true
                                
                            } ,this.cd)
                        }
                        
                    }
                    this.pickUp = function (player){
                        player.power = this
                    }
                    break
            case 'worm hole':
                this.type = 'power'
                this.count = 3
                this.clickable = true
                this.charges = 2
                this.image.src = './resources/pic_mini/teleport.png'
                this.cd = 10000;
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        console.log("FO!")
                        setTimeout(() => {
                            player.getImmunity(0.2)
                            player.pos.x = input.m_pos_x
                            player.pos.y = input.m_pos_y
                        }, 700)
                        let item = new Projectile(player, {"x" : player.pos.x, "y" : player.pos.y} ,0.1, 'worm hole')
                        player.projectiles.push(item)
                        setTimeout( () =>{
                            player.deleteProj(item)
                        },1000)
                        setTimeout(() => {
                            this.avalaible = true
                        },this.cd - player.cd_redaction)
                    }

                }
                this.pickUp = function (player){
                    player.power = this
                }
                break;
            case 'cosmic implosion':
                this.count = 4
                this.clickable = true
                this.charges = 3
                this.type = 'right'
                this.image.src = './resources/pic_mini/cosmic_implosion.png'
                this.cd = 4000;
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        let x = player.pos.x
                        let y = player.pos.y
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let item = new Projectile(player, {"x" : x, "y" : y} ,angle, 'cosmic implosion', { "x" : input.m_pos_x, "y" : input.m_pos_y})
                        player.projectiles.push(item)
                        setTimeout(() => {
                            this.avalaible = true
                        },this.cd - player.cd_redaction)
                    }
                }
                this.pickUp = function (player){
                    player.right = this
                }
                break;
            case 'frozen rail':
                this.count = 6
                this.clickable = true
                this.charges = 3
                this.type = 'right'
                this.image.src = './resources/pic_mini/frozen_rail.png'
                this.cd = 4000;
                this.do = function (input, player){
                    if(this.avalaible){
                        this.avalaible = false
                        let x = player.pos.x
                        let y = player.pos.y
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        while(x < 900 && x >0 && y < 900 && y >0){
                            let item = new Projectile(player, {"x" : x + Math.sin(angle) * 30, "y" : y + Math.cos(angle) * 30} ,angle, 'frozen rail')
                            x += Math.sin(angle) * 30;
                            y += Math.cos(angle) * 30
                            player.projectiles.push(item)
                        }                      
                        
                        setTimeout(() => {
                            this.avalaible = true
                        },this.cd - player.cd_redaction)
                    }
                }
                this.pickUp = function (player){
                    player.right = this
                }
                break;
            case 'spell power' :
                this.image.src = './resources/pic_mini/spell_power.png'
                this.pickUp = function (player){
                    player.spell_power += 10
                    player.cd_redaction += 100
                }
                break
            case 'improve acceleration' :
                    this.image.src = './resources/pic_mini/improve_aces.png'
                    this.pickUp = function (player){
                        player.acceleration_step += 0.005
                    }
                    break
            }
        }
    }


