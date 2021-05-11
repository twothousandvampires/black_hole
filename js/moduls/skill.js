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
        this.init()
        this.woble_angle = 0;
        this.r = 15
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
            case 'death comet':
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
                    player.r_click_item = this
                }
                break
            case 'defend matrix':
                this.type = 1
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
                    player.l_click_item = this
                }
                break;
            case 'grow mass':
                this.image.src = './resources/pic_mini/mass_up.png'
                this.pickUp = function (player){
                    player.mass += 10
                }
                break
            case 'dying star':
                this.clickable = false
                this.cd = 2000
                    this.charges = 1
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
                this.clickable = true
                this.charges = 2
                this.type = 1
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
        }
        }

    }


