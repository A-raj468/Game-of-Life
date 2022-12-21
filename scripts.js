/** @type {HTMLTableElement} */
var table = document.getElementById('field');

var windowWidth = window.innerWidth;

var HEIGHT = table.clientHeight;
var WIDTH = table.clientWidth;

var N = 50;
var tr_h = HEIGHT/N * 100/windowWidth + 'vw';
var td_w = WIDTH/N * 100/windowWidth + 'vw';

var changable = true;

const dead = "#666";
const alive = "#ccc";

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
        td.addEventListener('click', function(){
            if (changable){
                this.isAive = !this.isAive;
                this.style.backgroundColor = this.isAive? alive: dead;
            }
        })
        cells[i][j] = td;
    }
}

window.addEventListener("keydown", function(event){
    if(event.code == "Space"){
        event.preventDefault();
        changable = !changable;
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
    console.log(`Count(${x}, ${y}): ${count}`);
    if(copy[x][y]){
        if (!(count == 2 || count == 3)){
            cells[x][y].isAive = !copy[x][y];
        }
    }
    else{
        if (count == 3){
            cells[x][y].isAive = !copy[x][y];
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

update = function(){
    if(!changable){
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
    }
}

table.addEventListener("dragover", function(e){   
    if(changable){
        e.preventDefault();
        if(e.target.tagName === "TD"){
            if(!e.target.isAive){
                e.target.isAive = true;
                e.target.style.backgroundColor = e.target.isAive? alive: dead;
            }
        }
    }
})
            
function onClick(event) {                
    if(event.target.tagName === "TD")
        event.target.style.cursor = "pointer"
}