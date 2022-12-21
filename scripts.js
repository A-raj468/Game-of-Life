/** @type {HTMLTableElement} */
var table = document.getElementById('field');

const HEIGHT = table.clientHeight;
const WIDTH = table.clientWidth;

const N = 50;
const tr_h = HEIGHT/N;
const td_w = WIDTH/N;

var changable = true;

const dead = "#666";
const alive = "#ccc";

var cells = new Array(N);
for (let i=0; i<N; i++){
    var tr = table.insertRow();
    tr.style.height = tr_h + 'px';
    cells[i] = new Array(N);
    for (let j=0; j<N; j++){
        var td = tr.insertCell();
        td.style.backgroundColor = dead;
        td.style.width = td_w + 'px';
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