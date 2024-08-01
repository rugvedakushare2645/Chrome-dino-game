//variables for board
let board;
let boardWidth=750;
let boardHeight=250;
let context; //for drawing on the canvas

//variables for dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50; 
let dinoY = boardHeight - dinoHeight;
let dinoImg; // for reference the img object

//create an object 
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

let cactusArray = [] ;

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;

let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//for the moving the simulation
let velocityX= -8;//cactus is moving to the left speed
let velocityY = 0;
let gravity= .4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");// used for drawing on the board
    
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function(){
        context.drawImage(dinoImg,dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    
    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";
    requestAnimationFrame(update);
    setInterval(placeCactus,1000);
    document.addEventListener("keydown", moveDino);
}

function update(){ //for drawing the frames over and over
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0,0, board.width, board.height);

    //for dino
    velocityY +=gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // apply gravity to dinoY so it doesnot the exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //we need to draw a cactus
    for(let i =0 ; i< cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(dino,cactus)){
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function(){
                context.drawImage(dinoImg,dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e){
    if(gameOver){
        return;
    }

    if((e.code == "Space" || e.code == "ArrowUp") && (dino.y = dinoY)){//dino.y = dinoY checking id dino is on ground so we can jump
        //jump
        velocityY = -10;
    }

}

function placeCactus(){

    if(gameOver){
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance> .90){ // 10% you get a cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }

    else if(placeCactusChance> .70){ // 30% cactus 2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }

    else if(placeCactusChance> .50){ // 50% cactus 2
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if(cactusArray.length>5){
        cactusArray.shift(); //remove the first element from array, so it doesnot constantly grow
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&       //a's top left corner doesnt reach b's top right corner
            a.x + a.width > b.x &&      //a's top right corner passes b's top left corner
            a.y < b.y + b.height &&     //a's top left corner doesnt reach b's bottom left corner
            a.y + a.height > b.y;       //a's bottom left corner passes b's top left corner
}