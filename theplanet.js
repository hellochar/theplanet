window.onFinish.push(function () {

//This class listens to WASD on the document and moves the actor accordingly
function ActorControls(actor, speed, turnRate) {
  this.actor = actor;
  this.speed = speed || .05;
  this.turnRate = turnRate || this.speed;
  var keyState = this.keyState = {};
  function keyDown(evt) {
    keyState[String.fromCharCode(evt.keyCode)] = true;
  };

  function keyUp(evt) {
    delete keyState[String.fromCharCode(evt.keyCode)];
  };

  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}
ActorControls.prototype.update = function() {

  if('W' in this.keyState) {
    this.actor.goForward(this.speed);
  }
  if('S' in this.keyState) {
    this.actor.goForward(-this.speed);
  }

  if('A' in this.keyState) {
    this.actor.turnLeft(this.turnRate);
  }
  if('D' in this.keyState) {
    this.actor.turnLeft(-this.turnRate);
  }
}

// sets the given camera's matrix to be that of the actor
// The default camera is:
// 0, 0, 0 is center of the screen
//
// right = +X axis
// up = +Y axis
// behind the camera, towards the viewer = +Z axis
//
//
//
function lookAsActor(actor, camera) {
  camera.matrixAutoUpdate = false;

  camera.matrix.copy( actor.matrix() );
  camera.matrix.rotateByAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);
  
  camera.updateMatrix();
  camera.updateMatrixWorld(true);

  // camera.position.copy( map.onTerrain(actor.pos).multiplyScalar(1.1) );
  // camera.up.copy( actor.pos.normalize() );
  // camera.lookAt( actor.pos.clone().addSelf( actor.forward ) );

}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, .01, 10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener( 'resize', onWindowResize, false );

  controls = window.trackballControls = new THREE.TrackballControls(camera);
  scene.add(new THREE.AxisHelper(10));


  window.map = new Map(100);
  camera.position.set( 1,1,1 ).multiplyScalar(map.averageHeight);

  mesh = THREE.SceneUtils.createMultiMaterialObject(map.geometry, [new THREE.MeshPhongMaterial({color: 0xff0000})]);
  scene.add(mesh);

  waterMesh = new THREE.Mesh(new THREE.SphereGeometry(map.averageHeight, 50, 50), new THREE.MeshLambertMaterial({color: 0x84d4b4}));
  scene.add(waterMesh);

  a = new Actor(map, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1))
  actorControls = new ActorControls(a);

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

  myCam = new THREE.PerspectiveCamera(70, 1, .01, 1);
  camHelper = new THREE.CameraHelper(myCam);
  scene.add(camHelper);
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
  stats.begin();
  requestAnimationFrame(render);
  actorControls.update();

  map.update();

  controls.update();
  lookAsActor(a, myCam);
  camHelper.update();

  // waterMesh.geometry.vertices.forEach(function (v) {
  //   v.setLength(averageHeight * (.99 + Math.sin(v.x * v.y * v.z + (new Date()).getTime() / 1000) *.003 ) );
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

