export class Render{

    constructor(map, player, actors, objects) {
        this.cnv = document.getElementById(('cnv'))
        this.cnv.width = map[0].length * 50
        this.cnv.height = map.length * 50
        this.ctx = this.cnv.getContext('2d')
        this.map = map
        this.player = player
        this.actors = actors
        this.objects = objects

    }

    drawWorld(){
        this.map.forEach( elemRow => {
            elemRow.forEach( elem => {
                this.ctx.drawImage(elem.image, 0,0,50,50,elem.x, elem.y ,50, 50)
            })
        })
    }
}