export class Asteroid{

    constructor(pos ,angle,mass) {
        this.mass = mass
        this.pos = pos
        this.angle = angle
        this.size = mass
        this.speed = 20/mass
        this.x_movie = Math.sin(this.angle)
        this.y_movie = Math.cos(this.angle)
        this.r = mass/2
    }
    calcAngle(center, item){
        return Math.atan((center.pos.x-item.pos.x)/(center.pos.y-item.pos.y));
    }
    move(bh){



        if(bh.intersect(this)){

            let distance_to_event = bh.calcDistanceToEventHorizon(this)

            let power = distance_to_event/bh.radius_of_influence
            power = power > 1 ? 1 : power

            let xm = 0;
            let ym = 0;
            if(this.pos.x < bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y < bh.pos.y) { xm = Math.sin(bh.calcAngle(this)) ; ym =  Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x < bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }
            else if(this.pos.x > bh.pos.x && this.pos.y > bh.pos.y) { xm = -Math.sin(bh.calcAngle(this)) ; ym =  -Math.cos(bh.calcAngle(this)) }


            xm = (xm * (1 - power)) * bh.power
            ym = (ym * (1 - power)) *  bh.power

            this.x_movie += xm/(this.mass * 2)

            this.y_movie += ym/(this.mass * 2)

            //console.log("xm " + xm + '\n' + 'ym ' + ym)



            this.pos.x += this.x_movie * this.speed
            this.pos.y += this.y_movie * this.speed
        }
        else {
            this.pos.x += this.x_movie * this.speed
            this.pos.y += this.y_movie * this.speed
        }
    }

}