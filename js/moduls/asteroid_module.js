export class Asteroid{

    constructor(pos ,angle, size, speed) {
        this.pos = pos
        this.angle = angle
        this.size = size
        this.speed = speed/5
    }

    //
    // move(bh){
    //
    //     console.log(bh.calcDistanceToRoi(this))
    //
    //     if(bh.intersect(this)){
    //         let distance_to_event = bh.calcDistanceToEventHorizon(this)
    //         console.log('!!!')
    //         let power = distance_to_event/bh.radius_of_influence
    //         power = power > 1 ? 1 : power
    //         power = power <= 0.5 ? 0.5 : power
    //         let xm = 0;
    //         let ym = 0;
    //         if(this.pos.x < bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
    //         else if(this.pos.x > bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
    //         else if(this.pos.x < bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
    //         else if(this.pos.x > bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
    //
    //         xm = (xm * (1 - power)) * bh.power
    //         ym = (ym * (1 - power)) * bh.power
    //
    //         this.pos.x += ((Math.sin(this.angle) + xm)* this.speed)
    //         this.pos.y += ((Math.cos(this.angle) + ym)* this.speed)
    //     }
    //     else {
    //         this.pos.x += Math.sin(this.angle) * this.speed
    //         this.pos.y += Math.cos(this.angle) * this.speed
    //     }
    // }
    move(bh){

        if(bh.intersect(this)){
            let a = bh.calcAngle(this)
            let distance_to_event = bh.calcDistanceToEventHorizon(this)
            let power = distance_to_event/bh.radius_of_influence
            power = power > 1 ? 1 : power
            power = power <= 0.5 ? 0.5 : power
            a = a * (1 - power)

            this.angle = (this.angle + a )/ 2
            this.pos.x += Math.sin(this.angle) * this.speed
            this.pos.y += Math.cos(this.angle) * this.speed
        }
        else {
            this.pos.x += Math.sin(this.angle) * this.speed
            this.pos.y += Math.cos(this.angle) * this.speed
        }

    }
}