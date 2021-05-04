export class Render{

    constructor() {        
        this.canvas = document.getElementById('cnv')
        this.ctx = this.canvas.getContext('2d')
        this.background_image_pull = [
            "./resources/img/background.jpg",
            "./resources/img/background2.png"
        ]
        this.background_image = new Image()
        this.background_image.src = this.background_image_pull[Math.floor(Math.random() * this.background_image_pull.length)]
        this.effects = []
    }
    deleteEffect(item){
        this.effects = this.effects.filter( elem => {
            return elem != item
        })
    }
    flipHorizontally(around) {
        this.ctx.translate(around, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-around, 0)
    }

    drawFrame(bh, astr, player){
        this.ctx.clearRect(0,0,900,900)
        this.drawBG()
        this.drawBlackHole(bh)
        this.drawAsteroids(astr)
        this.drawPlayer(player)
        this.drawProjectiles(player.projectiles)
        this.drawEffects(bh)
    }
    drawEffects(bh){
        for(let i = 0;i < this.effects.length; i++){
            let item = this.effects[i]
                switch (item.type){
                    case 'explosion':
                        this.ctx.drawImage(item.image, item.radius * item.frame, 0, item.radius, item.radius, item.pos.x - item.radius/2, item.pos.y - item.radius/2, item.radius, item.radius)
                        break
                    case 'suction':
                        // this.ctx.translate(bh.pos.x + bh.radius * 1.1, bh.pos.y + bh.radius * 1.1);
                        // this.ctx.rotate(-item.angle);
                        // this.ctx.drawImage(item.image, 160 * item.frame, 0 ,160,160,- bh.radius * 1.1 , - bh.radius * 1.1 , bh.radius * 2.2 , bh.radius.r * 2.2);
                        // this.ctx.rotate(item.angle);
                        // this.ctx.translate(-bh.pos.x - bh.radius * 1.1 ,bh.pos.y - bh.radius * 1.1);
                        this.ctx.drawImage(item.image, 160 * item.frame, 0, 160, 160, bh.pos.x - bh.radius * 1.1, bh.pos.y - bh.radius * 1.1, bh.radius * 2.2, bh.radius * 2.2)
                        break;
                }
                //this.ctx.drawImage(item.image, 160 * item.frame, 0, 160, 160, bh.pos.x - bh.radius * 1.1, bh.pos.y - bh.radius * 1.1, bh.radius * 2.2, bh.radius * 2.2)
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
        this.ctx.fillStyle = item.color
        this.ctx.fillRect(item.pos.x - item.width/2, item.pos.y - item.height/2, item.width, item.height)
        this.ctx.fillStyle = 'red'
        this.ctx.fillRect(item.pos.x , item.pos.y , 2, 2)
    }
    drawProjectiles(array){
        
        array.forEach( elem => {
            switch ( elem.type){
                case "fire":
                    this.ctx.translate(elem.pos.x, elem.pos.y);
                    this.ctx.rotate(-elem.angle);
                    this.ctx.drawImage(elem.image, 25 * elem.frame, 0 ,25,25,(- elem.r - elem.draw_offset) / 2, (- elem.r - elem.draw_offset) / 2, elem.r + elem.draw_offset, elem.r + elem.draw_offset);
                    this.ctx.rotate(elem.angle);
                    this.ctx.translate(-elem.pos.x, -elem.pos.y);
                    break;
                case "gravity":
                    this.ctx.drawImage(elem.image, 30 * elem.frame, 0 ,30 ,30 , elem.pos.x - elem.r, elem.pos.y - elem.r, elem.r * 2, elem.r * 2)
                    break

            }

        })
    }
    

    

    
   
   
    


}