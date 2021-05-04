export class Blackhole{

    constructor(pos) {
        this.pos = pos
        this.radius = 30
        this.radius_of_influence = 280
        this.power  = 1
        this.image = new Image()
        this.image.src = './resources/img/border.png'
        this.frame = 0
        this.frame_timer = 0
    }
    act(){      
        this.frame  ++      
        if(this.frame > 10){
            this.frame = 0
        }
    }
    distanceToRoE(item){
        return this.distanceToEvent(item) - this.radius_of_influence
    }
    distanceToEvent(item){
        return this.distanceToCentr(item) - this.radius
    }
    distanceToCentr(item){
        return Math.floor(Math.sqrt(((this.pos.x - item.pos.x) ** 2) + ((this.pos.y - item.pos.y) ** 2)));
    }
    grow(mass){
        this.radius += mass/100
        this.radius_of_influence += mass/150
        this.power += mass/2000
    }
    calcAngle(item)
    {
        return Math.atan((this.pos.x-item.pos.x)/(this.pos.y-item.pos.y));
    }
    intersect(item)
    {
        return !(this.distanceToCentr(item) > this.getTotalRadius() + item.r)
      
    }
    intersectPlayer(item){
        
        let thisDistanceX = Math.abs(this.pos.x - item.pos.x);
        let thisDistanceY = Math.abs(this.pos.y - item.pos.y);
       
        if (thisDistanceX > (item.width/2 + this.getTotalRadius())) { return false; }
        if (thisDistanceY > (item.height/2 + this.getTotalRadius())) { return false; }
       
        if (thisDistanceX <= (item.width/2)) { return true; }
        if (thisDistanceY <= (item.height/2)) { return true; }
       
       let cornerDistance_sq = (thisDistanceX - item.width/2)^2 +
        (thisDistanceY - item.height/2)^2;
       
        return (cornerDistance_sq <= (this.getTotalRadius()^2));
    }
    getTotalRadius(){
        return this.radius + this.radius_of_influence
    }

    intersectEvent(item)
    {
        return !(this.distanceToCentr(item) > this.radius + item.r)
    }

}