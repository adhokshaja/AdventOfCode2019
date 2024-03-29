class Point {

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param {String} dir A single Character 'U','D', 'L' or 'R'
     * @param {Number} units 
     */
    move(dir, units = 1) {
        switch (dir) {
            case 'L':
                this.x = this.x - units;
                break;
            case 'R':
                this.x = this.x + units;
                break;
            case 'U':
                this.y = this.y + units;
                break;
            case 'D':
                this.y = this.y - units;
                break;
            default:
                break;
        }
    }

    /**
     * 
     * @param {String} dir Direction of motion
     * @param {String} units
     */
    cloneAndMove(dir, units = 1) {
        const b = new Point(this.x, this.y);
        b.move(dir, units);
        return b;
    }

    /**
     * Checks if two points are equal
     * @param {Point} a 
     * @param {Point} b 
     */
    static isEqual(a, b) {
        return a.x === b.x && a.y === b.y;
    }


    /**
     * Returns the Manhattan Distance between two points
     * @param {Point} a
     * @param {Point} b Defaults to origin
     */
    static ManhattanDistance(a, b = new Point()){
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }


    /**
     * Returns the Euclidean Distance between two points
     * @param {Point} a
     * @param {Point} b Defaults to origin
     */
    static EuclideanDistance(a, b = new Point()) {
        const dx = a.x - b.x,
            dy = a.y - b.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    /**
     * Returns the angle between two points in degrees
     * @param {Point} a Reference Point
     * @param {Point} b 
     */
    static AngularDistance(a, b) {
        const dx = b.x - a.x,
            dy = b.y - a.y;
        return Math.atan2(dy,dx)*180/Math.PI;
    }

    toString() {
        return `${this.x},${this.y}`;
    }

}


exports.Point = Point;