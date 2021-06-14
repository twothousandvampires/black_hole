import { Render } from "./render.js";

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

    static normalizeAngle(angle){
        if(angle > Math.PI * 2){
            return angle - Math.PI * 2
        }
        if(angle < 0){
            return Math.PI * 2 + angle
        }
        return angle
    }

    static inRow(num, skill_name, player){

        console.log(skill_name)
        console.log(player)
        switch(skill_name){
            case  'death comet':
                player.getScore(num * 40)
                break;
            case  'worm hole':
                player.getScore(num * 90)
                break;
            case  'dying star':
                player.getScore(num * 15)
                break;
        }


        Render.drawInRowWindow(num)

    }
}