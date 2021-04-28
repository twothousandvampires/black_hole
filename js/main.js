let canvas = document.getElementById('cnv')

let black_hole = {
    "x" : 450,
    "y" : 450,
    "r" : 30,
    "frame" : 0,
    "power" : 1.1
}
let ctx = canvas.getContext('2d')

let rock = {
    "x" : 300,
    "y" : 300,
    "start_angle" : 3.14,
    "speed" : 0
}
console.log(Math.sin(rock.start_angle))
console.log(Math.cos(rock.start_angle))
setInterval(()=>{
    ctx.clearRect(0,0,900,900)
    ctx.fillStyle = 'gray'
    ctx.fillRect(0,0,900,900)
    ctx.fillStyle = 'black'


    ctx.beginPath();
    ctx.arc(black_hole.x, black_hole.y, black_hole.r, 0 ,2 * Math.PI, false)
    ctx.fill()

    black_hole.r += 0.1
    drawRock((rock))
    console.log(calcDistanceToEventHorizon((rock)))
},100)

function drawRock(item){
    ctx.fillStyle = 'black'
    ctx.fillRect(rock.x, rock.y,50,50)
    item.x += Math.sin(item.start_angle) * item.speed
    item.y += Math.cos(item.start_angle) * item.speed
}

function calcDistanceToEventHorizon(item){
    return calcDistanceToHoleCentr(item) - black_hole.r
}

function calcDistanceToHoleCentr(item){
    return Math.sqrt(((black_hole.x - item.x) ** 2) + ((black_hole.y - item.y) ** 2));
}