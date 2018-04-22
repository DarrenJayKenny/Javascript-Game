(function(){        
    document.addEventListener('DOMContentLoaded', init, false)
    
    var username;
    var ctheme = new Audio('city.mp3');
    var ptheme = new Audio('pirate.mp3'); 
    var vtheme = new Audio('viking.mp3');
    var stheme = new Audio('space.mp3');
    var thief = new Image()
        thief.src = "thief.png";   
    var gameImages = new Image()
        gameImages.src = "gameImages.png";  
    var city = new Image()
        city.src = "city.png";
    var water = new Image()
        water.src = "water.jpg"
    var warrior = new Image()
        warrior.src = "warrior.png"; 
    var mountains = new Image()
        mountains.src = "grassland.png"
    var space = new Image()
        space.src = "space.jpg"
    var CatcherScore = 0;
    var CatcherTotalScore = 0;
    var DodgerScore = 0;
    var DodgerTotalScore = 0;
    var BreakerScore = 0;
    var BreakerTotalScore = 0;
    var SpaceScore = 0;
    var SpaceTotalScore = 0;
    var TotalScore = 0;
    var metChange = getRandomNumber(0, 10)
    var difficulty = 1;
    
    var xChange = 7;
    var yChange = 7;
   
    var catcherinterval_id;
    var spaceinterval_id;
    var dodgerinterval_id;
    var breakerinterval_id;
    
    var moveRight = false;
    var moveUp = true;
    var moveDown = false;
    var moveLeft = false;
    var sweepLeft = false;
    var sweepRight = false;
    var rocketUp = false;
    var rocketDown = false;
    var rocketFwrd = false;
    var slideLeft = false;
    var slideRight = false;
    var jump = false;
    var pursueLeft = false;
    var pursueRight = false;
    var pursueDown = false;
    var pursueUp = false; 
    var GameStart = false;
    var Astro = [];
    var Blocks = [];
    var xChange;
    var yChange;
    
    var dodgerPlayer = {
        x : 200,
        y : 300,
        wide : 30,
        tall : 30};
    var dodgerObstacle = {
        x : 200,
        y : 0,
        size : 20};
    var dodgerGoal = {
        x : getRandomNumber(0, 400),
        y : 0,
        size : 40};
    var breakerPlayer = {
        x : 200,
        y : 340,
        wide : 30,
        tall : 60};
    var breakerObstacle = {
        x : getRandomNumber(10, 390),
        y : 10,
        size : 40};
    var spacePlayer = {
        x : 10,
        y : 200,
        wide : 60,
        tall : 20};
    var spaceObstacle = {
        x : 410,
        y : getRandomNumber(0, 390),
        size : 30};
    var catcherPlayer = {
        x : 200,
        y : 340,
        tall : 60,
        wide : 20};
    var catcherObstacle = {
        x : getRandomNumber(40, 360),
        y : 0,
        size : 40};
    
    function init() {
        canvasDodger = document.querySelector('#dodger');
        dodgerContext = canvasDodger.getContext('2d');
        canvasBreaker = document.querySelector('#breaker');
        breakerContext = canvasBreaker.getContext('2d');
        canvasCatcher = document.querySelector('#catcher');
        catcherContext = canvasCatcher.getContext('2d');
        canvasSpace = document.querySelector('#space');
        spaceContext = canvasSpace.getContext('2d');
        dodgerWidth = canvasDodger.width;
        dodgerHeight = canvasDodger.height;
        breakerWidth = canvasBreaker.width;
        breakerHeight = canvasBreaker.height;
        catcherWidth = canvasCatcher.width
        catcherHeight = canvasCatcher.height;
        spaceWidth = canvasSpace.width;
        spaceHeight = canvasSpace.height;
        window.addEventListener('keydown', move, false);
        window.addEventListener('keyup', stopmove, false);
        getPlayerName();
    }
    
    function drawCatcher(){
        yChange = 7 + difficulty;
        clearInterval(spaceinterval_id);
        ctheme.play();
        catcherContext.clearRect(0, 0, catcherWidth, catcherHeight);
        catcherContext.drawImage(city, 0, 0, catcherWidth, catcherHeight);
        if (Blocks.length < difficulty)
           {Blocks.push(catcherObstacle);}
        for (var i = 0; i < Blocks.length; i += 1) 
            {catcherContext.drawImage(gameImages, 712, 0, 20, 20, Blocks[i].x, Blocks[i].y, Blocks[i].size, Blocks[i].size);}
        catcherContext.fillStyle ='black';
        catcherObstacle.y += yChange;
        if (slideRight === false && slideLeft === false){catcherContext.drawImage(thief, 170, 1, 14, 31, catcherPlayer.x, catcherPlayer.y, catcherPlayer.wide, catcherPlayer.tall)};
        if (slideLeft) {catcherContext.drawImage(thief, 284, 128, 14, 31, catcherPlayer.x, catcherPlayer.y, catcherPlayer.wide, catcherPlayer.tall)};
        if (slideRight) {catcherContext.drawImage(thief, 171, 133, 14, 31, catcherPlayer.x, catcherPlayer.y, catcherPlayer.wide, catcherPlayer.tall)};
        if (catcherPlayer.x < 0)
            {slideLeft = false}
        if (catcherPlayer.x + catcherPlayer.wide >  catcherWidth)
            {slideRight = false}
        if (slideLeft) 
            {catcherPlayer.x -= 20;}
        if (slideRight) 
            {catcherPlayer.x += 20;}
        if (jump)
            {catcherPlayer.y -= 80;
             jump = false;}
        if (catcherPlayer.y + catcherPlayer.tall < catcherHeight)
            {catcherPlayer.y += 20}
        if (catcherCollision())
            {catcherObstacle.x = getRandomNumber(0 + catcherObstacle.size, catcherWidth - catcherObstacle.size);
            catcherObstacle.y = 0;
            CatcherScore += 1;
            TotalScore += 1;}
        if (CatcherScore === 5 + difficulty)
            {CatcherScore = 0;
            clearInterval(catcherinterval_id);
            dodgerinterval_id = window.setInterval(drawDodger, 33);
            ctheme.pause();}
        catcherDeath()
    }
    
    function catcherCollision(){
        if (catcherPlayer.x + catcherPlayer.wide < catcherObstacle.x ||
            catcherObstacle.x + catcherObstacle.size < catcherPlayer.x ||
            catcherPlayer.y > catcherObstacle.y + catcherObstacle.size ||
            catcherObstacle.y > catcherPlayer.y + catcherPlayer.wide) 
            {return false}
        else
           {return true}
    } 
    
    function catcherDeath(){
        if (catcherObstacle.y  > catcherHeight){stop();}
    }
 
    function drawDodger(){
        ptheme.play();
        dodgerContext.clearRect(0, 0, dodgerWidth, dodgerHeight);
        dodgerContext.drawImage(water, 0, 0, dodgerWidth, dodgerHeight);
        if (pursueRight){dodgerContext.drawImage(gameImages, 654, 943, 120, 100, dodgerObstacle.x, dodgerObstacle.y, dodgerObstacle.size, dodgerObstacle.size)};
        if (pursueLeft) {dodgerContext.drawImage(gameImages, 338, 943, 120, 100, dodgerObstacle.x, dodgerObstacle.y, dodgerObstacle.size, dodgerObstacle.size)};
        if (pursueUp)   {dodgerContext.drawImage(gameImages, 526, 917, 120, 100, dodgerObstacle.x, dodgerObstacle.y, dodgerObstacle.size, dodgerObstacle.size)};
        if (pursueDown) {dodgerContext.drawImage(gameImages, 844, 929, 120, 100, dodgerObstacle.x, dodgerObstacle.y, dodgerObstacle.size, dodgerObstacle.size)};
        if (moveRight){dodgerContext.drawImage(gameImages, 670, 771, 120, 120, dodgerPlayer.x, dodgerPlayer.y, dodgerPlayer.wide, dodgerPlayer.tall)};
        if (moveLeft) {dodgerContext.drawImage(gameImages, 353, 745, 120, 120, dodgerPlayer.x, dodgerPlayer.y, dodgerPlayer.wide, dodgerPlayer.tall)};
        if (moveUp)   {dodgerContext.drawImage(gameImages, 524, 771, 120, 120, dodgerPlayer.x, dodgerPlayer.y, dodgerPlayer.wide, dodgerPlayer.tall)};
        if (moveDown) {dodgerContext.drawImage(gameImages, 854, 752, 120, 120, dodgerPlayer.x, dodgerPlayer.y, dodgerPlayer.wide, dodgerPlayer.tall)};
        dodgerContext.drawImage(gameImages, 769, 505, 100, 100, dodgerGoal.x, dodgerGoal.y, dodgerGoal.size, dodgerGoal.size);
        if (dodgerPlayer.x < dodgerObstacle.x)
            {dodgerObstacle.x -= (2 + difficulty);
             pursueLeft = true;
             pursueRight = false;
             pursueUp = false;
             pursueDown = false;}
        if (dodgerPlayer.x > dodgerObstacle.x)
            {dodgerObstacle.x += (2 + difficulty);
             pursueRight = true;
             pursueLeft = false;
             pursueUp = false;
             pursueDown = false;}
        if (dodgerPlayer.y < dodgerObstacle.y)
            {dodgerObstacle.y -= (2 + difficulty);
             pursueUp = true;
             pursueRight = false;
             pursueLeft = false;
             pursueDown = false;}
        if (dodgerPlayer.y > dodgerObstacle.y)
            {dodgerObstacle.y += (2 + difficulty);
             pursueDown = true;
             pursueRight = false;
             pursueUp = false;
             pursueLeft = false;}
        if (moveRight){dodgerPlayer.x += (7 + difficulty);}
        if (moveUp)   {dodgerPlayer.y -= (7 + difficulty);}
        if (moveDown) {dodgerPlayer.y += (7 + difficulty);}
        if (moveLeft) {dodgerPlayer.x -= (7 + difficulty);}
        if (dodgerCollision())
            {stop()}
        if (dodgerFinish())
            {DodgerScore += 1;
            TotalScore += 1;
            dodgerGoal.x = getRandomNumber(0 + dodgerGoal.size, dodgerWidth - dodgerGoal.size);
            dodgerGoal.y = getRandomNumber(0 + dodgerGoal.size, dodgerHeight - dodgerGoal.size);}
        if (DodgerScore === 5 + difficulty)
            {DodgerScore = 0;
            ptheme.pause();
            clearInterval(dodgerinterval_id);
            breakerinterval_id = window.setInterval(drawBreaker, 33);
            }
        dodgerDeath()
        }
  
    function dodgerCollision(){
        if (dodgerPlayer.x + dodgerPlayer.wide < dodgerObstacle.x ||
            dodgerObstacle.x + dodgerObstacle.size < dodgerPlayer.x ||
            dodgerPlayer.y > dodgerObstacle.y + dodgerObstacle.size ||
            dodgerObstacle.y > dodgerPlayer.y + dodgerPlayer.tall)
        {return false}
        else {return true}
    }
    
    function dodgerFinish(){
        if (dodgerPlayer.x + dodgerPlayer.wide < dodgerGoal.x ||
            dodgerGoal.x + dodgerGoal.size < dodgerPlayer.x ||
            dodgerPlayer.y > dodgerGoal.y + dodgerGoal.size ||
            dodgerGoal.y > dodgerPlayer.y + dodgerPlayer.wide)
        {return false}
        else {return true}
    }
      
    function dodgerDeath(){
        if (dodgerPlayer.x < 0 ||
            dodgerPlayer.x + dodgerPlayer.wide > dodgerWidth ||
            dodgerPlayer.y < 0 ||
            dodgerPlayer.y + dodgerPlayer.tall > dodgerHeight)
        {stop()}
    }
    
    function drawBreaker(){
        vtheme.play();
        breakerContext.clearRect(0, 0, breakerWidth, breakerHeight);
        breakerContext.drawImage(mountains, 0, 0, breakerWidth, breakerHeight);
        if (xChange > 0 && yChange < 0) {breakerContext.drawImage(gameImages, 823, 0, 80, 80, breakerObstacle.x, breakerObstacle.y, breakerObstacle.size, breakerObstacle.size);}
        if (xChange < 0 && yChange < 0) {breakerContext.drawImage(gameImages, 905, 0, 80, 80, breakerObstacle.x, breakerObstacle.y, breakerObstacle.size, breakerObstacle.size);}
        if (xChange > 0 && yChange > 0) {breakerContext.drawImage(gameImages, 988, 0, 80, 80, breakerObstacle.x, breakerObstacle.y, breakerObstacle.size, breakerObstacle.size);}
        if (xChange < 0 && yChange > 0) {breakerContext.drawImage(gameImages, 1075, 0, 80, 80, breakerObstacle.x, breakerObstacle.y, breakerObstacle.size, breakerObstacle.size);}
        if (sweepLeft === false && sweepRight === false){breakerContext.drawImage(warrior, 15, 20, 40, 40, breakerPlayer.x, breakerPlayer.y, breakerPlayer.wide, breakerPlayer.tall)};  
        if (breakerPlayer.x < 0)
            {sweepLeft = false}
        if (breakerPlayer.x + breakerPlayer.wide > breakerWidth)
            {sweepRight = false}
        if (sweepLeft) 
            {breakerPlayer.x -= 20;
             breakerContext.drawImage(warrior, 171, 236, 40, 40, breakerPlayer.x, breakerPlayer.y, breakerPlayer.wide, breakerPlayer.tall);}
        if (sweepRight) 
            {breakerPlayer.x += 20;
             breakerContext.drawImage(warrior, 167, 90, 40, 40, breakerPlayer.x, breakerPlayer.y, breakerPlayer.wide, breakerPlayer.tall);}
        if (breakerObstacle.x + breakerObstacle.size > breakerWidth||
            breakerObstacle.x < 0)
            {xChange *= -1;}
        if (breakerObstacle.y + breakerObstacle.size < 10)
            {yChange *= -1;}
        if (breakerCollision())
            {yChange *= -1;
             BreakerScore += 1;
             TotalScore += 1;
             if (yChange > 0) {yChange += difficulty}
             if (yChange < 0) {yChange -= difficulty}
            }
        if (BreakerScore === 5 + difficulty)
            {BreakerScore = 0;
            difficulty += 1;
            clearInterval(breakerinterval_id);
            spaceinterval_id = window.setInterval(drawSpace, 33);
            vtheme.pause();}
        breakerDeath()
        breakerObstacle.x = breakerObstacle.x + xChange 
        breakerObstacle.y = breakerObstacle.y + yChange
    }
    
    function breakerCollision(){
        if (breakerPlayer.x + breakerPlayer.wide < breakerObstacle.x ||
            breakerObstacle.x + breakerObstacle.size < breakerPlayer.x ||
            breakerPlayer.y > breakerObstacle.y + breakerObstacle.size ||
            breakerObstacle.y > breakerPlayer.y + breakerPlayer.wide) 
           {return false}
        else
           {return true}
    }
    
    function breakerDeath(){
        if (breakerObstacle.y > breakerHeight)
            {stop()}
    }

    function drawSpace(){
       stheme.play();
       spaceContext.clearRect(0, 0, spaceWidth, spaceHeight);
       spaceContext.drawImage(space, 0, 0, spaceWidth, spaceHeight);
       spaceContext.drawImage(gameImages, 5, 170, 420, 430, spaceObstacle.x, spaceObstacle.y, spaceObstacle.size, spaceObstacle.size);
       spaceContext.drawImage(gameImages, 5, 5, 280, 150, spacePlayer.x, spacePlayer.y, spacePlayer.wide, spacePlayer.tall);   
       spaceObstacle.x = spaceObstacle.x - (1 + difficulty + metChange);
       spacePlayer.x = spacePlayer.x + 10 + difficulty
       if (spacePlayer.y < 0) 
            {rocketUp = false}
       if (spacePlayer.y + spacePlayer.size > spaceHeight) 
            {rocketDown = false}
       if (rocketUp) 
          {spacePlayer.y -= 10;}
       if (rocketDown) 
          {spacePlayer.y += 10;}
       if (spaceCollision())
          {spaceContext.drawImage(gameImages, 82, 735, 120, 120, spaceObstacle.x, spaceObstacle.y, spaceObstacle.size, spaceObstacle.size);
           stop()}
       if (spacePlayer.x + spacePlayer.wide > spaceWidth)
          {SpaceScore += 1;
           TotalScore += 1;
           spacePlayer.x = 10;}
       if (spaceObstacle.x + spaceObstacle.size < -15)
          {spaceObstacle.x = spaceWidth;
           spaceObstacle.y = getRandomNumber(0, spaceHeight);}
       if (SpaceScore === 5 + difficulty)
          {SpaceScore = 0;
           difficulty += 1;
           clearInterval(spaceinterval_id);
           catcherinterval_id = window.setInterval(drawCatcher, 33);
           stheme.pause();}
    }
        
    function spaceCollision(){
        if (spacePlayer.x + spacePlayer.wide < spaceObstacle.x ||
            spaceObstacle.x + spaceObstacle.size < spacePlayer.x ||
            spacePlayer.y > spaceObstacle.y + spaceObstacle.size ||
            spaceObstacle.y > spacePlayer.y + spacePlayer.tall) 
        {return false}
        else {return true}
    }
    
    function move (event){
        var keyCode = event.keyCode;
            if (keyCode === 37){
                moveLeft = true;
                moveRight = false;
                moveUp = false;
                moveDown = false;
                sweepLeft = true;
                slideLeft = true;}
            else if (keyCode === 38){
                moveUp = true;
                jump = true;
                moveRight = false;
                moveDown = false;
                moveLeft = false;
                rocketUp = true;}
            else if (keyCode === 39){
                moveRight = true;
                moveDown = false;
                moveUp = false;
                moveLeft = false;
                sweepRight = true;
                rocketFwrd = true;
                slideRight = true;}
            else if (keyCode === 40){
                moveDown = true;
                moveRight = false;
                moveUp = false;
                moveLeft = false;
                rocketDown = true;}
            else if (keyCode === 83){
                GameStart = true;
                catcherinterval_id = window.setInterval(drawCatcher, 33);}
    }
    
    function stopmove (event){
        var keyCode = event.keyCode;
            if (keyCode === 37){
                sweepLeft = false;
                slideLeft = false;}
            else if (keyCode === 38){
                rocketUp = false;}
            else if (keyCode === 39){
                sweepRight = false;
                rocketFwrd = false;
                slideRight = false;}
            else if (keyCode === 40){
                rocketDown = false;}
    }
    
    function getRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
    
    function stop() {
        clearInterval(dodgerinterval_id);
        clearInterval(catcherinterval_id);
        clearInterval(spaceinterval_id);
        clearInterval(breakerinterval_id);
        window.removeEventListener('keydown', move);
        window.alert("Your score is: " + TotalScore);
        storescore();
    }
    
    function getPlayerName() {
        var url = 'getPlayerName.py';
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_name_response, false);
        request.open("GET", url, true);
        request.send(null);
    }
    
    function handle_name_response() {
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                username =  request.responseText.trim()
        }
    }
}
    
    function storescore() {
        console.log(TotalScore)
        console.log(username)
        var url = 'insertHighscore.py?score='+TotalScore+'&username='+username;
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_score_response, false);
        request.open("GET", url, true);
        request.send(null);
    }
    
    function handle_score_response() {
    if ( request.readyState === 4 ) {
        if ( request.status === 200 ) {
            if ( request.responseText.trim() === 'success' ) {
                window.alert("New Highscore for you " + username + "! Check out the highscores page to see where you rank!")
            }
        }
    }
}

    
})();