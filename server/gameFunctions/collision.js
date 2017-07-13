
 class Collision{
  constructor(){

  }

  // detectCollision(x1,  y1,  x2,  y2,  cx,  cy,  diameter){
  //   var self = this;
  //
  //  this.players.forEach( (player) => {
  //     if(player.id != laser.id && collideLineCircle(x1,  y1,  x2,  y2,  cx,  cy,  diameter)){
  //       self.removePlayer(player.id)
  //     }
  //   })
  // }

  collideLineCircle( x1,  y1,  x2,  y2,  cx,  cy,  diameter) {

    var inside1 = this.collidePointCircle(x1,y1, cx,cy,diameter);
    var inside2 = this.collidePointCircle(x2,y2, cx,cy,diameter);
    if (inside1 || inside2) return true;

    // get length of the line
    var distX = x1 - x2;
    var distY = y1 - y2;
    var len = Math.sqrt( (distX*distX) + (distY*distY) );

    // get dot product of the line and circle
    var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    var closestX = x1 + (dot * (x2-x1));
    var closestY = y1 + (dot * (y2-y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
    if (!onSegment) return false;

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    var distance = Math.sqrt( (distX*distX) + (distY*distY) );

    if (distance <= diameter/2) {
      return true;
    }
    return false;
  }

  collidePointLine(px,py,x1,y1,x2,y2, buffer){
    // get distance from the point to the two ends of the line
  var d1 = this.dist(px,py, x1,y1);
  var d2 = this.dist(px,py, x2,y2);

  // get the length of the line
  var lineLen = this.dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add a little buffer zone that will give collision
  if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

  // if the two distances are equal to the line's length, the point is on the line!
  // note we use the buffer here to give a range, rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
  }

  collidePointCircle(x, y, cx, cy, d) {
  //2d
  if( this.dist(x,y,cx,cy) <= d/2 ){
    return true;
  }
  return false;
  }

  dist(x1, y1, x2, y2){
      var distX = x1 - x2;
      var distY = y1 - y2;
      var distance = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2))
      return distance;
    }
}

module.exports = Collision
