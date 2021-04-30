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
    console.log("sin  " + Math.sin(black_hole.calcAngle(m_pos)) +  "\n" +  "cos  " + Math.cos(black_hole.calcAngle(m_pos)) + "\n" + 'angle ' + black_hole.calcAngle(m_pos) + '\n'
    + "dx " + (black_hole.pos.x - m_pos.pos.x) + "\n" + "dy" + (black_hole.pos.y - m_pos.pos.y))
})


let asteroind_mass = []
asteroind_mass.push(new Asteroid({x:200,y:300},1.57,20,2))
function createAsteroid(){
    let x, y, angle, mass
    let side = Math.floor(Math.random() * (5 - 1) +1)

    switch (side){
        case 1:
            x = Math.random() * 900
            angle = Math.random() < 0.5 ? Math.random() * 1.57 : Math.random() * (6.28 - 4.71) + 4.71
            y = -60
            break
        case 2:
            y = Math.random() * 900
            angle = Math.random() * (6.28 - 3.14) + 3.14
            x = 960
            break
        case 3:
            y = 960
            x = Math.random() * 900
            angle = Math.random() * (4.71 - 1.57)  + 1.57
            break
        case 4:
            y = Math.random() * 900
            x = -60
            angle = Math.random() * 3.14
            break
    }
    asteroind_mass.push(new Asteroid({x:x, y:y}, angle,Math.random() * ( 50 - 10) + 10))

}

createAsteroid()
let ctx = canvas.getContext('2d')

setInterval(()=>{

    ctx.clearRect(0,0,900,900)
    ctx.fillStyle = 'gray'
    ctx.fillRect(0,0,900,900)


    drawBH(black_hole)
    drawRocks(asteroind_mass, black_hole)
    // console.log(calcDistanceToEventHorizon((rock)))
},30)

setInterval(()=>{
    createAsteroid()
},1000)

function drawRocks(arr, bh){
    for (let i = 0; i < asteroind_mass.length;i ++){
        asteroind_mass[i].move(bh)

        if(bh.intersectEvent(asteroind_mass[i])){
            bh.grow(asteroind_mass[i].mass)
            console.log(bh.power)
            asteroind_mass = asteroind_mass.filter( elem => {
                return elem != asteroind_mass[i]
            })
        }
        if(asteroind_mass[i].pos.x > 960 || asteroind_mass[i].pos.y > 960 || asteroind_mass[i].pos.x < -60 || asteroind_mass[i].pos.y < -60 ){
            console.log('-')
            asteroind_mass = asteroind_mass.filter( elem => {
                return elem != asteroind_mass[i]
            })
        }
    }
   arr.forEach( elem => {
       ctx.fillStyle ='black'
       ctx.beginPath();
       ctx.arc(elem.pos.x, elem.pos.y, elem.r, 0 ,2 * Math.PI, false)
       ctx.fill()
       ctx.closePath()
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


