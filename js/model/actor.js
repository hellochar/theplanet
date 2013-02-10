//pos: Vector3 of unit length representing where it is on the sphere
//forward: Vector3 of unit length representing where it's facing
function Actor(map, pos, forward) {
  this.map = map;
  this.pos = pos; // y
  this.forward = forward; //x
  this.right = new THREE.Vector3().cross(forward, pos);

  this.model = new THREE.Object3D();

  var size = .1;
  var cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), new THREE.MeshNormalMaterial());
  cube.position = new THREE.Vector3(0, size/2, 0);
  this.model.add(cube);

  this.model.matrixAutoUpdate = false;

  scene.add(this.model);

  map.actors.push(this);

  this.update();
}
Actor.prototype.update = function() {
  var mat = this.model.matrix;
  mat.identity;
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
  
  this.model.matrixWorldNeedsUpdate = true;
  // this.model.position = this.map.onTerrain(this.pos);
  // this.mesh.rotation = 
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

