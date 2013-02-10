window.onFinish.push(function () {


map = {
  heightAt: function(pos) {
              var noise1 = .5 * noise.noise(v.x, v.y, v.z);
              var noise2 = .1 * noise.noise(v.x * 5, v.y * 5, v.z * 5);
              var noise3 = .01 * noise.noise(v.x * 50, v.y * 50, v.z * 50);
              return 8 + noise1 + noise2 + noise3;
            },
  onTerrain: function(pos) {
               return pos.copy().setLength(this.heightAt(pos));
             }
};

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 10000);
  camera.position.set( 20, 20, 20 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener( 'resize', onWindowResize, false );

  controls = window.trackballControls = new THREE.TrackballControls(camera);
  scene.add(new THREE.AxisHelper(10));


  cube = new THREE.CubeGeometry(10, 10, 10, 100, 100, 100);
  map.geometry = cube;

  var noise = new ClassicalNoise();
  cube.vertices.forEach(function (v) {
    v.setLength(4);
    var noise1 = .5 * noise.noise(v.x, v.y, v.z);
    var noise2 = .1 * noise.noise(v.x * 5, v.y * 5, v.z * 5);
    var noise3 = .01 * noise.noise(v.x * 50, v.y * 50, v.z * 50);
    v.setLength(8 + noise1 + noise2 + noise3);
  });
  cube.verticesNeedUpdate = true;
  cube.computeFaceNormals();
  cube.computeVertexNormals();
  cube.computeCentroids();
  cube.computeTangents();
  cube.normalsNeedUpdate = true;

  // mesh = THREE.SceneUtils.createMultiMaterialObject(cube, [new THREE.MeshPhongMaterial({color: 0xff0000}), new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true})]);
  mesh = THREE.SceneUtils.createMultiMaterialObject(cube, [new THREE.MeshPhongMaterial({color: 0xff0000})]);
  scene.add(mesh);

  avgLength = _.reduce(cube.vertices, function(memo, v) { return memo + v.length(); }, 0) / ( cube.vertices.length );
  waterMesh = new THREE.Mesh(new THREE.SphereGeometry(avgLength, 50, 50), new THREE.MeshLambertMaterial({color: 0x84d4b4}));
  scene.add(waterMesh);

  map.waterHeight = avgLength;

  light = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(light);

  //set up stats
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild( stats.domElement );
};

// function faceFor(pos) {
//   //1) find the face of the cube the pos is in
//   //2) project the pos onto the face's plane, using a coordinate system to represent the 
//   //3) 
// 
//   //or: face whose centroid is closest
//   //
//   map.geometry.faces.map(
// 
// }

// function isWalkable(pos) {
//   return map.geometry.
// }

//pos: Vector3 of unit length representing where it is on the sphere
//forward: Vector3 of unit length representing where it's facing
function Entity(pos, forward) {
  this.pos = pos; // y
  this.forward = forward; //x
  this.right = new THREE.Vector3().cross(forward, pos);

  this.model = new THREE.Object3D();
  (function() {
    var size = .1;
    var cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), new THREE.MeshNormalMaterial());
    cube.position = new THREE.Vector3(0, size/2, 0);
    this.model.add(cube);
  })();
  scene.add(this.model);

  this.update();
}
Entity.prototype.update = function() {
  this.mesh.position = map.onTerrain(this.pos);
  // this.mesh.rotation = 
}
Entity.prototype.turnLeft = function (rad) {
}
Entity.prototype.goForward = function (amt) {
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
  stats.begin();
  requestAnimationFrame(render);
  controls.update();

  // waterMesh.geometry.vertices.forEach(function (v) {
  //   v.setLength(avgLength * (.99 + Math.sin(v.x * v.y * v.z + (new Date()).getTime() / 1000) *.003 ) );
  // });
  // waterMesh.geometry.verticesNeedUpdate = true;
  // waterMesh.geometry.computeFaceNormals();
  // waterMesh.geometry.computeVertexNormals();
  // waterMesh.geometry.normalsNeedUpdate = true;

  renderer.render(scene, camera);
  stats.end();
}

init();
render();
});

