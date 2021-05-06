<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="style.css">
</head>
<body style="display: flex;flex-direction: row; justify-content: center; align-items: center; width: 100%; height: 100%">
    <div id = 'hud'>
        <div id = 'skill-bar'>
            <div id = 'skill-bar-left'>
                <p id = 'skill-bar-left-name'></p>
                <div id = 'skill-bar-left-sign'></div> 
            </div>
            <div id = 'skill-bar-right'>
                <div id = 'skill-bar-right-sign'></div> 
                <p id = 'skill-bar-right-name'></p>                
            </div>
        </div>
        <div id = 'hp-bar'>
        </div>
        <div id = 'hud-timer'>
        </div>
    </div>
    <div id = 'info'>
        <div id = 'bh-info'>
            <p id = 'bh-power'></p>
            <p id = 'bh-radius'></p>
            <p id = 'bh-influence'></p>
        </div>
        <div id = 'game-info'>
            <p id = 'timer'></p>
            <p id = 'meteor hit count'></p>
            <p id = 'hit with meteor'></p>
        </div>
    </div>
    <canvas id="cnv" width="900px" height="900px"></canvas>
    <script type="module" src="js/main.js"></script>
</body>
</html>