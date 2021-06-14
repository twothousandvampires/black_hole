import  { Config } from "./config.js";
import { Asteroid } from "./asteroid.js";
import  { Blackhole } from "../moduls/black_hole.js";
import  { Player } from "./player.js";
import { Render } from './render.js'
import { Skill } from './skill.js'
import {Effect} from "./effect.js";
import {GameFunctions} from "./game_functions.js";


export class GameEngine{

    constructor(){
    
        this.black_hole = new Blackhole({x:450, y: 450})
        this.player = new Player(this)
        
        this.timer = 0
        this.astr_create_timer = 3.5     
        this.power_up_array = []
        this.asteroinds_mass = []

        this.game_time = setInterval( ()=> {
            if(!document.hidden){
                let timer = Math.round(this.timer/10)
                if(timer%8 === 0 && this.timer >=  9){
                    if(this.astr_create_timer > 0.2){                     
                        this.astr_create_timer = (this.astr_create_timer - 0.1).toFixed(1)
                        this.black_hole.grow(15)
                        clearInterval(this.asteroid_creator)
                        this.asteroid_creator = setInterval( () =>{
                            if(!document.hidden){
                                this.createAsteroid()
                            }          
                        },this.astr_create_timer * 1000 )
                    }
                    
                }
                if(timer%40 === 0 && this.timer >= 9 ){
                    this.createAsteroid(true)
                }
                if(timer%10 === 0  && this.timer >= 9){
                    if(!document.hidden){
                        this.createPowerUp()
                    }
                }
            }

        } , 1000)
        this.asteroid_creator = setInterval( () =>{
            if(!document.hidden && this.game_is_started){
                this.createAsteroid()
            }          
        },this.astr_create_timer * 1000 )
        this.game_is_started = false
    }
    
    createAsteroid(comet){

        let x, y, angle
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
        this.asteroinds_mass.push(new Asteroid(this, {x:x, y:y}, angle,Math.random() * ( 50 - 10) + 10, comet ? true : false))
    
    }

    deleteAsteroid(item, by_player = false){
        this.asteroinds_mass = this.asteroinds_mass.filter( elem => {
            return elem != item
        })
        if(by_player){
            this.player.getScore(10)
        }
    }
    asteroidAct(){
        for (let i = 0; i < this.asteroinds_mass.length;i ++){
            let asteroid = this.asteroinds_mass[i];
            if(asteroid.pos.x > 960 || asteroid.pos.y > 960 || asteroid.pos.x < -60 || asteroid.pos.y < -60 ){
                this.deleteAsteroid(asteroid)
            }
            else
            {
                asteroid.move(this.black_hole, this.asteroinds_mass , this.player)
            }
            
        }
    }
    powerUpAct(player, engine){
        for( let i = 0 ; i < this.power_up_array.length; i ++){
            let item = this.power_up_array[i];
            item.act(player, engine)
        }
    }
    deletePowerUp(item){
        this.power_up_array = this.power_up_array.filter( elem => {
            return elem != item
        })
    }
    gameStep(timer){
        let tick = 0.162
        if(!document.hidden && this.player.state != 'lose'){
            this.timer += tick
        }            
        Render.drawFrame(this)
        this.black_hole.act()
        this.asteroidAct()
        this.player.act(this.black_hole , this.asteroinds_mass)
        this.powerUpAct(this.player, this);
        requestAnimationFrame((timer) => this.gameStep(timer))
    }
    start(){
        this.game_is_started = true
        requestAnimationFrame((timer) => this.gameStep(timer))
    }
    createPowerUp(){
        let x = Math.floor( Math.random() * 900)
        let y = Math.floor( Math.random()  * 900)
        while (GameFunctions.distanceBetweenPoints({ pos : { 'x' : x, 'y' : y}}, this.black_hole) < this.black_hole.getTotalRadius()) {
            x = Math.floor( Math.random() * 900)
            y = Math.floor( Math.random()  * 900)
        }
        Render.effects.push(new Effect('power up', { "x" : x, "y": y}, 0))
        this.power_up_array = []
        setTimeout( () =>{
            this.power_up_array.push(new Skill(this.player, Config.list_of_power_ups[Math.floor(Math.random() * Config.list_of_power_ups.length)],this.render, { "x" : x, "y" : y}))
        }, 1000)
    }
    createGameOverWindow(){

        let body = document.getElementById('body');

        let window = document.createElement('div')
        window.id = 'game_over_window'
        window.innerText = 'game over'
        window.addEventListener('click', (e) =>{
            body.removeChild(window)
            self = this
            $.ajax({
                url: '/index.php',
                method: 'post',
                dataType: 'text',
                success : function(data){                  
                    self.createScoreBoard(data);
                  },
            });
        })
        body.appendChild(window)
    }

    createScoreBoard(data, after = false){

        let to_delete = document.getElementById('score_board')
        if(to_delete){
            to_delete.parentNode.removeChild(to_delete)
        }

        let score_board = document.createElement('div')
        score_board.id = 'score_board'

        let body = document.getElementById('body');

        let timer = Math.floor(this.timer/10)
        
        let coef = 1 + (Math.floor(timer/60)/10)

        console.log(timer)
        console.log(coef)

        let score = Math.floor( (this.player.score + timer )* coef)

        

        let score_elem = document.createElement('p')
        score_elem.innerText =  `Your score is ${score}`
        
        let rows = data.split('|');      
        let result_score_array = []

        for(let i = 0; i < rows.length-1;i ++){   
            result_score_array.push([+rows[i].split(':')[0], rows[i].split(':')[1], +rows[i].split(':')[2]])
        }

        result_score_array = result_score_array.sort(function(a,b){
            return b[2] - a[2];
        })

        score_board.appendChild(score_elem)     
        let table = document.createElement('table')
        table.id = 'score_table'
        let row = document.createElement('tr')
        let nametd = document.createElement('th')
        let scoretd = document.createElement('th')

        nametd.innerText = 'name'
        scoretd.innerText = 'scores'

        row.appendChild(nametd)
        row.appendChild(scoretd)

        table.appendChild(row)

        for(let i = 0; i < result_score_array.length; i++){
          
            let row = document.createElement('tr')

            let name = document.createElement('td')

            let score = document.createElement('td')

            name.innerText = result_score_array[i][1]

            score.innerText = result_score_array[i][2]
          
            row.appendChild(name)
            row.appendChild(score)
        
            table.appendChild(row)
        }
        score_board.appendChild(table)
        if( (result_score_array.length < 5 ||  score > result_score_array[result_score_array.length - 1][2]) && !after){

            let form = document.createElement('form')
            let input_name = document.createElement('input')
            let p = document.createElement('p')

            p.innerText = 'submit'
           
            p.id = 'submit'

            let text = document.createElement('p')
            text.innerText = 'You are on the leaderboard, enter your name : '
            
            form.appendChild(text)
            form.appendChild(input_name)
            form.appendChild(p)

            p.addEventListener('click', (e) =>{
                self = this
                $.ajax({
                    url: '/index.php',
                    method: 'post',
                    dataType: 'text',
                    data: { action : 'load' , score : score, name : input_name.value , delete : result_score_array.length < 5 ? 0 : result_score_array[result_score_array.length - 1][0]},  
                    success : function(data){              
                        self.createScoreBoard(data , true);
                    },
                });
            })

            score_board.appendChild(form)

        }
        else{
            let go_next = document.createElement('p')

            go_next.innerText = 'go next'
            go_next.id = 'next_game_button'

            score_board.appendChild(go_next)

            go_next.addEventListener('click', (e) => {
            location.reload(true)
            })
        }
            
        body.appendChild(score_board)
    }

}
