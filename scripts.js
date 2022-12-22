/** @type {HTMLTableElement} */
var table = document.getElementById('field');

var windowWidth = window.innerWidth;

var HEIGHT = table.clientHeight;
var WIDTH = table.clientWidth;

var N = 50;
var tr_h = HEIGHT/N * 100/windowWidth + 'vw';
var td_w = WIDTH/N * 100/windowWidth + 'vw';

var changable = true;
var numAlive = 0;

const alive = "#F3EFE0";
const dead = "#112616";

var cells = new Array(N);
for (let i=0; i<N; i++){
    var tr = table.insertRow();
    tr.style.height = tr_h;
    cells[i] = new Array(N);
    for (let j=0; j<N; j++){
        var td = tr.insertCell();
        td.style.backgroundColor = dead;
        td.style.width = td_w;
        td.isAive = false;
        td.draggable = false;
        td.addEventListener('click', function(){
            if (changable){
                if(this.isAive) numAlive--;
                else numAlive++;
                this.isAive = !this.isAive;
                this.style.backgroundColor = this.isAive? alive: dead;
            }
        })
        cells[i][j] = td;
    }
}

/** @type {HTMLButtonElement} */
var play = document.getElementById('play');
play.addEventListener('click', function(){
    if(changable && numAlive != 0){
        changable = false;
        this.innerText = 'Pause';
    }
    else{
        changable = true;
        this.innerText = 'Play';
    }
    console.log(this.innerText);
})

/** @type {HTMLButtonElement} */
var reset = document.getElementById('reset');
reset.addEventListener('click', function(){
    for(let i=0; i<N; i++){
        for(let j=0; j<N; j++){
            cells[i][j].isAive = false;
        }
    }
    draw();
    generation = 0;
    numAlive = 0;
    play.innerText = 'Play';
    changable = true;
    console.log(reset.innerText);
})

/** @type {HTMLButtonElement} */
var skip = document.getElementById('skip');
skip.addEventListener('click', function(){
    for(let i=0; i<100; i++){
        update();
    }
})

window.addEventListener("keydown", function(event){
    if(event.code == "Space"){
        event.preventDefault();
        play.click();
    }
    else if(event.key == "r"){
        reset.click();
    }
    else if(event.key == "s"){
        skip.click();
    }
})

check_state = function(x, y, copy, cells){
    let count = 0;
    for(let i=x-1; i<x+2; i++){
        for(let j=y-1; j<y+2; j++){
            if((i==x && j==y) || (i<0 || i>=N) || (j<0 || j>=N)) continue;
            else{
                if(copy[i][j]) count++;
            }
        }
    }
    // console.log(`Count(${x}, ${y}): ${count}`);
    if(copy[x][y]){
        if (!(count == 2 || count == 3)){
            cells[x][y].isAive = false;
            numAlive--;
        }
    }
    else{
        if (count == 3){
            cells[x][y].isAive = true;
            numAlive++;
        }
    }
    return count;
}

draw = function(){
    for(let i=0; i<N; i++){
        for(let j=0; j<N; j++){
            cells[i][j].style.backgroundColor = cells[i][j].isAive? alive: dead;
        }
    }
}

var generation = 0;

update = function(){
    if(!changable && numAlive != 0){
        let copy = new Array(N);
        for(let i=0; i<N; i++){
            copy[i] = new Array(N);
            for(let j=0; j<N; j++){
                copy[i][j] = cells[i][j].isAive;
            }
        }

        for(let i=0; i<N; i++){
            for(let j=0; j<N; j++){
                check_state(i, j, copy, cells);
            }
        }
        draw();
        generation++;
    }
    else if(numAlive == 0 && !changable){
        reset.click();
    }
}

table.addEventListener("dragover", function(e){   
    if(changable){
        e.preventDefault();
        if(e.target.tagName === "TD"){
            if(!e.target.isAive){
                e.target.isAive = true;
                numAlive++;
                e.target.style.backgroundColor = e.target.isAive? alive: dead;
                // e.target.style.cursor = 'pointer';
            }
        }
    }
})

setInterval(update, 100);