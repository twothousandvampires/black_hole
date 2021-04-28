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
            }
        })
        document.addEventListener(('keyup'), e=>{
            switch (e.keyCode){
                case 69:
                    this.inputs.e = false
                    break
                case 84:
                    this.inputs.t = false
                    break;
            }
        })
    }
    getInput(){
        return this.inputs
    }
}