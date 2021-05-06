import {GameFunctions} from "./game_functions.js";
import {Projectile} from "./projectile_module.js";


export class Skill{

    constructor(player ,name, render, pos) {
        this.avalaible = true
        this.name = name
        this.player = player
        this.render = render
        this.init()
        this.iamge = new Image()
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
                break
            case 'defend matrix':
                this.cd = 6000;
                this.do = function (input, player){
                    if(this.avalaible){
                        player.getImune(2)
                        player.can_be_gravitate = false
                        this.avalaible = false
                        let angle = GameFunctions.angle(player, { pos : { "x" : input.m_pos_x, "y" : input.m_pos_y}})
                        let new_proj = new Projectile(player, {'x' : player.pos.x, "y" : player.pos.y},angle,'defend matrix')
                        player.projectiles.push(new_proj)
                        console.log(new_proj)
                        setTimeout(() => {
                            player.can_be_gravitate = true
                            player.deleteProj(new_proj)
                        }, 2000)
                        setTimeout(()=>{
                            
                            this.avalaible = true
                        }, this.cd - player.cd_redaction)
                    }
                }
                break;
        }
        }

    }


