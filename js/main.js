import { Asteroid } from "./moduls/asteroid_module.js";
import  { Blackhole } from "./moduls/black_hole.js";
import  { Player } from "./moduls/player_module.js";

let canvas = document.getElementById('cnv')
let m_pos = {
    pos :{x:0,
    y:0}
}
let black_hole = new Blackhole({x:450, y: 450})
canvas.addEventListener('click', e => {
    m_pos.pos.x = e.offsetX
    m_pos.pos.y = e.offsetY
    console.log("sin  " + Math.sin(black_hole.calcAngle(m_pos)) +  "\n" +  "cos  " + Math.cos(black_hole.calcAngle(m_pos)) + "\n" + 'angle ' + black_hole.calcAngle(m_pos))
})


let asteroind_mass = []

asteroind_mass.push(new Asteroid({x:600,y:100},0, 50, 6))
asteroind_mass.push(new Asteroid({x:100,y:300},1.57, 50, 6))
asteroind_mass.push(new Asteroid({x:200,y:800},3.14, 50, 6))
asteroind_mass.push(new Asteroid({x:900,y:600},4.71, 50, 6))
let ctx = canvas.getContext('2d')

setInterval(()=>{

    ctx.clearRect(0,0,900,900)
    ctx.fillStyle = 'gray'
    ctx.fillRect(0,0,900,900)


    drawBH(black_hole)
    drawRocks(asteroind_mass, black_hole)
    // console.log(calcDistanceToEventHorizon((rock)))
},1000/60)

function drawRocks(arr, bh){
    for (let i = 0; i < asteroind_mass.length;i ++){
        asteroind_mass[i].move(bh)
        if(bh.intersectEvent(asteroind_mass[i])){
            bh.grow()
            asteroind_mass = asteroind_mass.filter( elem => {
                return elem != asteroind_mass[i]
            })
        }
    }
   arr.forEach( elem => {
       ctx.fillStyle ='black'
       ctx.fillRect(elem.pos.x - elem.size/2, elem.pos.y- elem.size/2, elem.size, elem.size);
   })
}
function drawBH(item){
    ctx.fillStyle = 'yellow'
    ctx.beginPath();
    ctx.arc(item.pos.x, item.pos.y, item.radius + item.radius_of_influence, 0 ,2 * Math.PI, false)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = 'black'
    ctx.beginPath();
    ctx.arc(item.pos.x, item.pos.y, item.radius, 0 ,2 * Math.PI, false)
    ctx.fill()
    //item.grow()
}


