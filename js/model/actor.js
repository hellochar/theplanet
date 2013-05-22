//pos: Vector3 of unit length representing where it is on the sphere
//forward: Vector3 of unit length representing where it's facing
//
// Actors have a local coordinate system specified by the pos, forward, and right matricies.
// As of now we establish that 
function Actor(map, pos, forward) {
  this.map = map;
  this.pos = pos; // y
  this.forward = forward; //x
  this.right = new THREE.Vector3().cross(forward, pos); //z

  this.model = new THREE.Object3D();

  var size = .1;
  var cube = new THREE.Mesh(new THREE.CubeGeometry(size, size/2, size/10), new THREE.MeshNormalMaterial());
  cube.position = new THREE.Vector3(0, size/2, 0);
  this.model.add(cube);

  //place a small axis indicator on the actor
  var axis = new THREE.AxisHelper(1);
  axis.position.set(1, 0, 0);
  this.model.add(axis);

  //control the model's matrix directly
  this.model.matrixAutoUpdate = false;

  scene.add(this.model);

  map.actors.push(this);

  this.update();
}
Actor.prototype.update = function() {
  //update my model's matrix to match this actor's position
  this.model.matrix.copy( this.matrix() );
  this.model.matrixWorldNeedsUpdate = true;
}
Actor.prototype.turnLeft = function (rad) {
  var matrix = new THREE.Matrix4().makeRotationAxis(this.pos, rad);
  matrix.multiplyVector3(this.forward);
  matrix.multiplyVector3(this.right);
}
Actor.prototype.goForward = function (amt) { //amt == distance on the sphere => turn into an angle by dividing by size of sphere
  var rad = amt / this.map.averageHeight;
  var matrix = new THREE.Matrix4().makeRotationAxis(this.right, -rad);
  matrix.multiplyVector3(this.pos);
  matrix.multiplyVector3(this.forward);
}
// Returns this actor's matrix in world coordinates. The coordinate system maps this way:
// forward = +X axis
// pos = +Y axis
// right = +Z axis
Actor.prototype.matrix = function() {
    var mat = new THREE.Matrix4();
    mat.setPosition(this.map.onTerrain(this.pos));

    var te = mat.elements;
    var forward = this.forward,
        pos = this.pos,
        right = this.right;
    te[0] = forward.x;
    te[1] = forward.y;
    te[2] = forward.z;

    te[4] = pos.x;
    te[5] = pos.y;
    te[6] = pos.z;

    te[8] = right.x;
    te[9] = right.y;
    te[10] = right.z;
    return mat;
}
