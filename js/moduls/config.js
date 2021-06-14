export class Config{

    static player_mass = 10;

    static player_speed = 3

    static list_of_power_ups = [
        'defend matrix',
        'grow mass',
        'death comet',
        'worm hole',
        'dying star',
        'frozen rail',
        'cosmic implosion',
        'massive wave',
        'space crusher',
        'spell power',
        'improve acceleration',
        'add scores'
    ]

    static background_image_pull = [
        "./resources/img/background.jpg",
        "./resources/img/background2.png",
    ]

    static hud_info = {
        // 'timer' : document.getElementById('timer'),
        // 'mass_info' : document.getElementById('mass'),
        // 'acceleration_info' : document.getElementById('accel'),
        // 'cd_info' : document.getElementById('cd'),
        // 'bh_power_info' : document.getElementById('bh-power'),
        // 'bh_radius_info' : document.getElementById('bh-radius'),
        // 'bh_influence_info' : document.getElementById('bh-influence'),
        'l_skill_info' : document.getElementById('skill-bar-left-name'),
        'r_skill_info' : document.getElementById('skill-bar-right-name'),
        'l_sign_info' : document.getElementById('skill-bar-left-sign'),
        'r_sign_info' : document.getElementById('skill-bar-right-sign'),
        'l_skill_count' : document.getElementById('l_skill_count'),
        'r_skill_count' : document.getElementById('r_skill_count'),
        'power_name' : document.getElementById('power-name'),
        'power_timer' : document.getElementById('power-timer'),
        'hp_container' : document.getElementById('hp-container'),
        'timer_count' : document.getElementById('timer-count'),
    }

    static getBgImage(){
        let result = new Image()
        result.src = Config.background_image_pull[Math.floor(Math.random() * Config.background_image_pull.length)]
        return result
    }
}