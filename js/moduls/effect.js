import {Render} from './render.js'
export class Effect{


    constructor(type, pos, angle){
        this.pos = pos
        this.type = type
        this.frame_timer = 0
        this.frame = 0
        this.image = new Image()
        switch(this.type){
            case 'explosion':
                this.max_frame = 8
                this.radius = 160;
                this.image.src = "./resources/img/explosion.png"
                break;
            case 'explosion fire':
                this.max_frame = 13
                this.radius = 160;
                this.image.src = "./resources/img/explosion_fire.png"
                break;
            case 'suction':
                this.angle = angle
                this.max_frame = 7;
                this.radius = 160;
                this.image.src = "./resources/img/suction.png"
                break
            case 'power up':
                this.angle = angle
                this.max_frame = 17;
                this.radius = 60;
                this.image.src = "./resources/img/new_power_up.png"
                break
            case 'after cast':
                this.angle = angle
                this.max_frame = 6;
                this.radius = 25;
                this.image.src = "./resources/img/cast_effect.png"
                break
            case 'cosmic explosion':
                this.angle = angle
                this.max_frame = 22;
                this.radius = 140;
                this.image.src = "./resources/img/cosmic_explosion.png"
                break
        }
    }

    act(){
        switch (this.type){
            case 'explosion':
                this.frame_timer += 0.2
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        Render.deleteEffect(this)
                    }
                }
                break;
                case 'explosion fire':
                    this.frame_timer += 0.3
                    if(this.frame_timer >=1 ){
                        this.frame_timer = 0
                        this.frame ++
                        if(this.frame === this.max_frame){
                            Render.deleteEffect(this)
                        }
                    }
                    break;
            case 'suction':
                this.frame_timer += 0.5
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        Render.deleteEffect(this)
                    }
                }
                break;
            case 'power up':
                this.frame_timer += 0.2
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        Render.deleteEffect(this)
                    }
                }
                break;
            case 'after cast':
                this.frame_timer += 0.2
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        Render.deleteEffect(this)
                    }
                }
                break;
            case 'cosmic explosion':
                this.frame_timer += 0.4
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        Render.deleteEffect(this)
                    }
                }
                break;
        }

    }

}