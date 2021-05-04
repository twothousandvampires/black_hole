export class Input{
    inputs = {
        'm_left' : false,
        'm_right'  : false,
        'e' : false,
        't' : false,
        "m_pos_x" : undefined,
        "m_pos_y" : undefined

    }
    constructor(){
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener( 'mousedown', e=>{
            this.inputs.m_pos_x = e.offsetX
            this.inputs.m_pos_y = e.offsetY
            switch (e.which){
                case 1:
                    this.inputs.m_left = true
                    break
                case 3:
                    this.inputs.m_right = true
                    break;
            }
        })
        document.addEventListener('mouseup', e=>{
            switch (e.which){
                case 1:
                    this.inputs.m_left = false
                    break
                case 3:
                    this.inputs.m_right = false
                    break;
            }
        })
        document.addEventListener(('keydown'), e=>{
            switch (e.keyCode){
                case 69:
                    this.inputs.e = true
                    break
                case 84:
                    this.inputs.t = true
                    break;
                case 87:
                    this.inputs.w = true
                    break
                case 83:
                    this.inputs.s = true
                    break
                case 65:
                    this.inputs.a = true
                    break
                case 68:
                    this.inputs.d = true
                    break
            }
        })
        document.addEventListener(('keyup'), e=>{
            switch (e.keyCode){
                case 69:
                    this.inputs.e = false
                    break
                case 84:
                    this.inputs.t = false
                    break
                case 87:
                    this.inputs.w = false
                    break
                case 83:
                    this.inputs.s = false
                    break
                case 65:
                    this.inputs.a = false
                    break
                case 68:
                    this.inputs.d = false
                    break
            }
        })
    }
    getInput(){
        let flag;
        for(let key in this.inputs){
            if (this.inputs[key] === true){
                flag = true;
            }
        }
        return flag  ? this.inputs : false
    }
}