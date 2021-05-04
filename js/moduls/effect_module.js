export class Effect{


    constructor(type, parrent, pos, angle){
        this.pos = pos
        this.parrent = parrent
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
            case 'suction':
                this.angle = angle
                this.max_frame = 7;
                this.radius = 160;
                this.image.src = "./resources/img/suction.png"
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
                        this.parrent.deleteEffect(this)
                    }
                }
                break;
            case 'suction':
                this.frame_timer += 0.5
                if(this.frame_timer >=1 ){
                    this.frame_timer = 0
                    this.frame ++
                    if(this.frame === this.max_frame){
                        this.parrent.deleteEffect(this)
                    }
                }
                break;
        }

    }

}