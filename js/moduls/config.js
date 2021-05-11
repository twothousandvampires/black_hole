export class Config{

    static player_mass = 10;

    static player_speed = 3

    static list_of_power_ups = [
        'defend matrix',
        'grow mass',
        'death comet',
        'worm hole',
        'dying star'
    ]

    static background_image_pull = [
        "./resources/img/background.jpg",
        "./resources/img/background2.png",
    ]

    static hud_info = {
        'timer' : document.getElementById('timer'),
        'mass_info' : document.getElementById('mass'),
        'acceleration_info' : document.getElementById('accel'),
        'cd_info' : document.getElementById('cd'),
        'bh_power_info' : document.getElementById('bh-power'),
        'bh_radius_info' : document.getElementById('bh-radius'),
        'bh_influence_info' : document.getElementById('bh-influence'),
        'l_skill_info' : document.getElementById('skill-bar-left-name'),
        'r_skill_info' : document.getElementById('skill-bar-right-name'),
        'l_sign_info' : document.getElementById('skill-bar-left-sign'),
        'r_sign_info' : document.getElementById('skill-bar-right-sign')
    }

    
}