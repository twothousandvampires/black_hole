let canvas = document.getElementById('cnv')
let ctx = canvas.getContext('2d')


export class GameFunctions{

    static distanceBetweenPoints( point_1 , point_2 ){

        return Math.floor(Math.sqrt(((point_1.pos.x - point_2.pos.x) ** 2) + ((point_1.pos.y - point_2.pos.y) ** 2)));

    }

    static angle( item , other ){

        let angle = Math.atan((item.pos.x-other.pos.x)/(item.pos.y-other.pos.y));
        if(other.pos.x < item.pos.x && other.pos.y < item.pos.y){
            angle += Math.PI
        }
        if(other.pos.x > item.pos.x && other.pos.y < item.pos.y){
            angle += Math.PI
        }
        if(other.pos.x < item.pos.x && other.pos.y > item.pos.y){
            angle += Math.PI*2
        }
        
        return angle
    }

    static drawPoint( item , color ){
        ctx.fillStyle = color
        ctx.fillRect( item.pos.x-1 , item.pos.y-1 , 2 , 2 )
    }
    static fixNum(num){
        return +num.toFixed(2)
    }
}