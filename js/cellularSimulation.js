// Cellular automata physics
// Johan van Dongen
// Falling sand game

// Particle class is defined in another file

// Get canvas en define values
var c = document.getElementById("particleSimulation");
var ctx = c.getContext("2d");

var selectedParticle = "sand";
var selectedSize = 10;
const cellSize = 10; // Code is not optimized for small cellsizes 
c.width = 500; // Canvas will be centered in a div of size 500*500
c.height = 500;

//initialize grid with empty particles
function create_empty_grid() {
    var xbins = Math.floor(c.width/cellSize);  // Determine how big the 2d array needs to be
    var ybins = Math.floor(c.height/cellSize); // To fill op the entire canvas

    var grid = [];
    for (i = 0; i<ybins; i++) {
        var row = [];
        for (j = 0; j < xbins; j++) {
            var empty_particle = new Particle("empty", particleColors["empty"], false, false, 1);
            row.push(empty_particle);
        }
        grid.push(row);
    }
    return grid;
}

// Check if point (r,c) is in the 2d array bounds
// gridRows/gridCols is defined later in this file
function is_inbound(r, c) {
    if (r>=0 && r<gridRows && c>= 0 && c<gridCols) {
        return true;
    }
    return false;
}

// Update grid state (bottom-top left-right)
// Changes are immedeatly applied (if cell 1 changes then cell 2 can change with the already updated cell 1)
// After all cells are updated the function is done (after which the grid will be drawn in another function)
function update() {
    randomBool = Math.random() < 0.5
    for (i = 0; i<grid.length; i++) {
        for (j = 0; j < grid[0].length; j++) {
            if (grid[grid.length-1 - i][j].updated == false) {
                switch(grid[grid.length-1 - i][j].type) {
                    case "sand": update_sand(grid.length-1-i,j); break;
                    case "water": update_water(grid.length-1-i,j); break;
                }
            }
        }
    }
}

// Set all particles to a non-updated fase, for second iteration
function reset_grid_update_state() {
    for (i = 0; i<grid.length; i++) {
        for (j = 0; j < grid[0].length; j++) {
            grid[i][j].updated = false;
        }   
    }
}

// Draw all particles on the canvas
function draw() {
    for (i = 0; i<grid.length; i++) {
        for (j = 0; j < grid[0].length; j++) {
            ctx.fillStyle = grid[i][j].color;
            ctx.fillRect(j*cellSize,i*cellSize,cellSize,cellSize);
        }
    }
}

// ------------------
// Initialising grid
// ------------------
var grid = create_empty_grid();
var gridRows = grid.length;
var gridCols = grid[0].length;

// Populate grid with some initial values to let the user
// know there is life in this simulation
grid[2][5].update_particle_to("sand");
grid[3][5].update_particle_to("sand");
grid[4][5].update_particle_to("sand");
grid[5][5].update_particle_to("sand");
grid[5][4].update_particle_to("sand");
grid[5][6].update_particle_to("sand");
grid[15][5].update_particle_to("stone");

// ---------------------------------------------
// Simulation loop - Here is where it all starts
// ---------------------------------------------
function update_frame(){
    reset_grid_update_state();
    update();
    draw();
}
ms = 5*cellSize // Lower value is higher fps
setInterval(update_frame, ms);
// function simulationLoop(){
//     window.requestAnimationFrame(simulationLoop);
//     reset_grid_update_state();
//     update();
//     draw();
// }
// simulationLoop()

// -------------------------
// Mouse click event handler
// -------------------------
var isDrawing = false;
var radius = 30;
function spawnParticle(radius, x, y, type) {
    var radius = Math.floor(radius/cellSize);
    var checkRadius = radius==1 ? Math.pow(radius,2) : Math.pow(radius,2)-radius; // r^2 since the distance is also squared
    for (let i=y-radius; i<y+radius; i++) {
        for(let j=x-radius; j<x+radius; j++) {
            if (is_inbound(i, j) && Math.pow(j-x,2)+Math.pow(i-y,2)<checkRadius) {
                grid[i][j].update_particle_to(type);
                grid[i][j].set_lifetime(100);
            }
        }
    }
}
// If mouse button down, spawn particle and set isDrawing to true
c.addEventListener('mousedown', (event) => {
    var x = Math.floor(event.offsetX/cellSize);
    var y = Math.floor(event.offsetY/cellSize);
    spawnParticle(selectedSize, x, y, selectedParticle);
    draw();
    isDrawing = true; // Keep spawning particles if mouse button down (next function)
})
// If mouse moves and isDrawwing == true (mousebutton down), spawn particles
c.addEventListener('mousemove', (event) => {
    if (isDrawing === true) {
        var x = Math.floor(event.offsetX/cellSize);
        var y = Math.floor(event.offsetY/cellSize);
        spawnParticle(selectedSize, x, y, selectedParticle);
        draw();
    }
});
// If mouse button up, set is isDrawing to false -> spawning particles stops
window.addEventListener('mouseup', e => {
if (isDrawing === true) {
    isDrawing = false;
}
});


// User input (Size/Particle selection)
// After the user selects a particle type (on button click),
// the mousebutton will then spawn the selected particle type (at a certain size in px)
var userSelectedParticle = document.getElementById("selected");
var userSelectedSize = document.getElementById("selectedSize");
var borders = document.getElementsByClassName("particleButton");
var buttonsborder = document.getElementById("particleButtons");
var saveSizeId;
var sizeBorders = document.getElementsByClassName("sizeOption");

function selectParticle(id, type) {
    selectedParticle = type;
    userSelectedParticle.innerHTML = selectedParticle;
    userSelectedParticle.style.color = "var(--color-"+type+")";
    for (let i = 0; i < borders.length; i++) {
        borders[i].style.borderBottom = "1px solid var(--color-theme)";
    }
    document.getElementById(id).style.borderBottom = "1px solid var(--color-"+type+")";
    buttonsborder.style.border = "5px solid var(--color-"+type+")";
    userSelectedSize.style.color = "var(--color-"+type+")";
    
    document.getElementById(saveSizeId).style.border = "3px solid var(--color-"+selectedParticle+")";
}
function selectSize(id, size) {
    selectedSize = size;
    userSelectedSize.innerHTML = selectedSize;
    saveSizeId = id;
    for (let i = 0; i < sizeBorders.length; i++) {
        sizeBorders[i].style.border = "3px solid var(--color-theme)";
    }
    document.getElementById(id).style.border = "3px solid black";
    document.getElementById(id).style.border = "3px solid var(--color-"+selectedParticle+")";
}

//Run these functions as default options
selectSize("size10", 10);
selectParticle("sandButton", "sand");