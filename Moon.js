/**
 * Moon is a Sphere in 2d space
 * It's position in indicated by integers on the x,y,x axis
 * The velocity on each of these axes is indicated by u,v,w respectively
 */
class Moon {

    constructor(name = "Moon", { x, y, z } = { x: 0, y: 0, z: 0 }) {

        this.name = name;

        //Position Vectors
        this.x = x;
        this.y = y;
        this.z = z;

        // Velocity
        this.u = 0;
        this.v = 0;
        this.w = 0;
    }

    /**
     * Moves the Moon forward by one time step
     */
    move() {

        this.x += this.u;
        this.y += this.v;
        this.z += this.w;

    }

    toString() {
        return `${this.name.padStart(8)} :: pos:<x= ${('' + this.x).padStart(2)}, y= ${('' + this.y).padStart(2)}, z= ${('' + this.z).padStart(2)}>, vel: <x= ${('' + this.u).padStart(2)}, y= ${('' + this.v).padStart(2)}, z=${('' + this.w).padStart(2)}>`;
    }

    getHash(){
        return `${this.name[0].toLowerCase()}::${this.x},${this.y},${this.z}:${this.u},${this.v},${this.w}`;
    }

    getKineticEnergy() {
        return Math.abs(this.u) + Math.abs(this.v) + Math.abs(this.w);
    }

    getPotentialEnergy() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    getTotalEnergy() {
        return this.getKineticEnergy() * this.getPotentialEnergy();
    }

}



exports.Moon = Moon;