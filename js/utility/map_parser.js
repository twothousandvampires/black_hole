export class MapParser{

    constructor(){

    }
    createMap(plan){
        let map = []
        for(let i = 0; i < plan.length; i++){
            let row = []
            for (let j = 0; j < plan[i].length; j++){
                let item = this.createTail(plan[i][j], i , j)
                row.push(item)
            }
            map.push(row)
        }
        return map
    }

    createTail(type, i, j){
        let tail = {
            'size' : 50
        }
        switch (type){
            case 0:
                tail.x = j * 50
                tail.y = i * 50
                tail.type = 0
                tail.image = new Image()
                tail.image.src = '/ressourses/env/background_sky_tail.png'
                break
            case 1:
                tail.x = j * 50
                tail.y = i * 50
                tail.type = 1
                tail.image = new Image()
                tail.image.src = '/ressourses/env/ground_tail.png'
                break
        }
        return tail
    }
}