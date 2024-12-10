//board
let board;
let boardWidth = 1000; //1000 pixels wide
let boardHeight = 855; //855 pixels tall
let context; //Used for drawing on the canvas
 
//Mario
    let MarioWidth = 50;
    let MarioHeight = 50;
    let MarioX = boardWidth / 2 - MarioWidth / 2; //marios x location 
    let MarioY = boardHeight * 7 / 8 - MarioHeight; //location of where Mario is on y axis
    let MarioRightImg;
    let MarioLeftImg;
    let deathSound = new Audio('./MarioDeath.mp3'); // Load the Mario death sound effect
    deathSound.volume = 0.3; 

    let Mario = {  //holds current properties of Mario
        img: null, //specify image source
        x: MarioX,
        y: MarioY,
        width: MarioWidth,  //the arguments we have to specify before we can draw on the canves
        height: MarioHeight
    }

//physics
    let velocityX = 0;
    let velocityY = 0; //Mario jump speed
    let initialVelocityY = -2; //starting velocity Y, how fast he moves upwards
    let gravity = 0.01;

//platforms
let platformArray = [];
let platformWidth = 100;
let platformHeight = 30;
let platformImg;

//score
let score = 0;
let maxScore = 0;    //tracks players score and whether game is over
let gameOver = false;

    window.onload = function() { //will run the functions when the web page is fully loaded 
        board = document.getElementById("board"); //This line selects the HTML element with the id="board"
        board.height = boardHeight;
        board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
        MarioRightImg = new Image(); //will draw the Mario within these parameters and have the mario facing right 
        MarioRightImg.src = "./mario-right.png";
        Mario.img = MarioRightImg;
        MarioRightImg.onload = function() {
        context.drawImage(Mario.img ,   Mario.x ,    Mario.y ,    Mario.width ,   Mario.height); //Fills the Mario image by the amount of px I gave earlier 
    }

        MarioLeftImg = new Image();
        MarioLeftImg.src = "./mario-left.png";
       
        platformImg = new Image();
        platformImg.src = "./platform.png";

        velocityY = initialVelocityY; //sets the speed at which Mario jumps
        placePlatforms();  //will place the platform images
        requestAnimationFrame(update); //keeps frames at 60
        document.addEventListener("keydown", moveMario); //calls the move Mario function basically when a key is pressed down Mario will move
    }

//

    function update() { //runs repeatedly to update the state of the game 
    requestAnimationFrame(update); //tells the browser to call this update function
    if (gameOver) {
    if (!deathSound.mp3) { // Ensure the sound only plays once
    deathSound.play();  // Play the death sound
    }
        return;
    }
    
    
    context.clearRect(0, 0, board.width, board.height); //clears the canvas of repeating Mario



    //Mario
    Mario.x += velocityX; //updates marios x position if u move hit a or d keys 
    if (Mario.x > boardWidth) { //if Mario passes right side of canvas he comes from the left 
    Mario.x = 0;}
    else if (Mario.x + Mario.width < 0) { //if Mario passes left side he will come out the right 
    Mario.x = boardWidth;}
   
    velocityY += gravity;//continuously pdates velocity by adding gravity value each jump pulling mario down
    Mario.y += velocityY;//updates y position of mario by the velovity updating him moving up and down 
    
    if (Mario.y > board.height) { //vertical exceeds height of canvas 
    gameOver = true;} //if mario fallsoff game over 
   
   
    context.drawImage(Mario.img , Mario.x , Mario.y , Mario.width , Mario.height);



    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && Mario.y < boardHeight * 3 / 4) {
            platform.y -= initialVelocityY; //slide platform down when mario is jumping on it 
        }
        if (detectCollision(Mario, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //mario will jump when colding with platform
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }




    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }




    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px";
    context.fillText(score, 2, 20);

    if (gameOver) {
        context.fillText("Game Over:'Space'", boardWidth / 7, boardHeight * 7 / 8);
    }
    }

//


    function moveMario(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
    velocityX = 2;
    Mario.img = MarioRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
    velocityX = -2;
    Mario.img = MarioLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset puts game back into starting position
    Mario = {
        img: MarioRightImg,
        x: MarioX,
        y: MarioY,
        width: MarioWidth,
        height: MarioHeight
        //this is the starting position from previous
    }
        //
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();//will place new platforms 
    }
    }


//clears platforms from the previous game and places new ones at random
function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 30,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);
    for (let i = 0; i < 7; i++) { //used to create more space between the platforms
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 5); //random x position for each platform, math random will pick a number 0-1 and multiply it by boardwidth
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 80 * i - 120, //will create a random space between platforms within the for loop of 80 x [1,2,3,4,5,6] - 120 on the y axis 
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    }
    }




function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 4 / 5); //(0-1) * boardWidth*4/4
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,//generate a new platform and make it above the canvos
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);
    }
function detectCollision(a, b) { //detects collision between two rectangles will call mario as a and platform as b 
    return a.x < b.x + b.width &&   // top left corner doesnt reach that b corner
           a.x + a.width > b.x &&   // top right coner of a passes its b counter part
           a.y < b.y + b.height &&  // as top left doesnt reach top left b
           a.y + a.height > b.y;    // a botom vonner passes b nottom coner
}


function updateScore() {
    let points = Math.floor(50); //will make that score go up when he jumps higher
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
    }
