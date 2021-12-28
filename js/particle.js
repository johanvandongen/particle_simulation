var particleColors = {"sand": "#fcb503", "empty":"white", "stone":"black", "water":"blue"}
var particleSolid = {"sand": true, "empty":false, "stone":true, "water": false}

// Particle class
class Particle {
    constructor(type, color, solid, updated, lifetime) {
        this.type = type;
        this.color = color;
        this.solid = solid;
        this.updated = updated
        this.lifetime = lifetime
    }
    update_particle_to(new_type) {
        this.type = new_type
        this.color = particleColors[this.type];
        this.solid = particleSolid[this.type];
        this.updated = true;
        if (this.lifetime > 0){
            this.lifetime -= 1
        }
    } 
    set_lifetime(time) {
        this.lifetime = time;
    }
}
var waterLifetime = 100;

// -----------------------
// Update_particle section
// -----------------------

// Update sand particle 
function update_sand(i,j) {
    // Go down if possible
    if (is_inbound(i+1, j) && grid[i+1][j].solid == false) {
        grid[i][j].update_particle_to(grid[i+1][j].type);
        grid[i+1][j].update_particle_to("sand");
        if (grid[i+1][j].type == "water") {
            grid[i][j].set_lifetime(waterLifetime)
        }
    }
    // Otherwise go down left if possible
    else if (is_inbound(i+1, j-1) && grid[i+1][j-1].type=="empty" && grid[i][j-1].solid == false) {
        grid[i][j].update_particle_to("empty");
        grid[i+1][j-1].update_particle_to("sand");
    }
    // Otherwise go down right if possible
    else if (is_inbound(i+1, j+1) && grid[i+1][j+1].type=="empty" && grid[i][j+1].solid == false) {
        grid[i][j].update_particle_to("empty");
        grid[i+1][j+1].update_particle_to("sand");
    }
}

// Update water particle 
function update_water(i, j) {
    // Go down if possible
    if (is_inbound(i+1, j) && grid[i+1][j].type=="empty") {
        grid[i][j].update_particle_to("empty");
        grid[i+1][j].update_particle_to("water");
        grid[i+1][j].set_lifetime(grid[i][j].lifetime)
    }
    // Otherwise go down left if possible
    else if (is_inbound(i+1, j-1) && grid[i+1][j-1].type=="empty") {
        grid[i][j].update_particle_to("empty");
        grid[i+1][j-1].update_particle_to("water");
        grid[i+1][j-1].set_lifetime(grid[i][j].lifetime)
    }
    // Otherwise go down right if possible
    else if (is_inbound(i+1, j+1) && grid[i+1][j+1].type=="empty") {
        grid[i][j].update_particle_to("empty");
        grid[i+1][j+1].update_particle_to("water");
        grid[i+1][j+1].set_lifetime(grid[i][j].lifetime)
    }
    // If Right is not solid and not water move to the right
    else if (is_inbound(i, j+1) && grid[i][j+1].solid==false && grid[i][j+1].type != "water") {
        grid[i][j].update_particle_to("empty");
        grid[i][j+1].update_particle_to("water");
        grid[i][j+1].set_lifetime(grid[i][j].lifetime)
    }
    // If there is space to the left and the right is water, move to the left (lifetime to prevent loop)
    else if (is_inbound(i, j+1) && is_inbound(i, j-1) && grid[i][j+1].type == "water" && grid[i][j-1].type == "empty" && grid[i][j].lifetime>0) {
        grid[i][j].update_particle_to("empty");
        grid[i][j-1].update_particle_to("water");
        grid[i][j-1].set_lifetime(grid[i][j].lifetime)
        if (grid[i][j+1].lifetime == 0){
            grid[i][j+1].set_lifetime(1) // Gives wave like behavior 
        }
    }

}