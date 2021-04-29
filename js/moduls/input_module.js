export class Input{
    inputs = {
        'm_left' : false,
        'm_right'  : false,
        'e' : false,
        't' : false
    }
    constructor(){
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener( 'mousedown', e=>{
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
                case 97:
                    this.inputs.w = false
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
        return this.inputs
    }
}