export class Blackhole{

    constructor(pos) {
        this.pos = pos
        this.radius = 20
        this.radius_of_influence = 280
        this.power  = 1
    }

    calcDistanceToRoi(item){
        return this.calcDistanceToEventHorizon(item) - this.radius_of_influence
    }
    calcDistanceToEventHorizon(item){
        return this.calcDistanceToHoleCentr(item) - this.radius
    }
    calcDistanceToHoleCentr(item){
        return Math.sqrt(((this.pos.x - item.pos.x) ** 2) + ((this.pos.y - item.pos.y) ** 2));
    }
    grow(){
        this.radius += 1
        this.radius_of_influence += 1
        this.power += 0.1
    }
    calcAngle(item)
    {
        return Math.atan((this.pos.x-item.pos.x)/(this.pos.y-item.pos.y));
    }
    intersect(item)
    {
        let thisDistanceX = Math.abs(this.pos.x - item.pos.x);
        let thisDistanceY = Math.abs(this.pos.y - item.pos.y);

        if (thisDistanceX > (item.size/2 + this.getTotalRadius())) { return false; }
        if (thisDistanceY > (item.size/2 + this.getTotalRadius())) { return false; }

        if (thisDistanceX <= (item.size/2)) { return true; }
        if (thisDistanceY <= (item.size/2)) { return true; }

       let cornerDistance_sq = (thisDistanceX - item.size/2)^2 +
        (thisDistanceY - item.size/2)^2;

        return (cornerDistance_sq <= (this.getTotalRadius()^2));
    }
    getTotalRadius(){
        return this.radius + this.radius_of_influence
    }

    intersectEvent(item)
    {
        let thisDistanceX = Math.abs(this.pos.x - item.pos.x);
        let thisDistanceY = Math.abs(this.pos.y - item.pos.y);

        if (thisDistanceX > (item.size/2 + this.radius)) { return false; }
        if (thisDistanceY > (item.size/2 + this.radius)) { return false; }

        if (thisDistanceX <= (item.size/2)) { return true; }
        if (thisDistanceY <= (item.size/2)) { return true; }

        let cornerDistance_sq = (thisDistanceX - item.size/2)^2 +
            (thisDistanceY - item.size/2)^2;

        return (cornerDistance_sq <= (this.radius^2));
    }

}