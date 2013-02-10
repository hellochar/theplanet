window.onFinish.push(function () {

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


  window.map = new Map(100);

  // mesh = THREE.SceneUtils.createMultiMaterialObject(cube, [new THREE.MeshPhongMaterial({color: 0xff0000}), new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true})]);
  mesh = THREE.SceneUtils.createMultiMaterialObject(map.geometry, [new THREE.MeshPhongMaterial({color: 0xff0000})]);
  scene.add(mesh);

  waterMesh = new THREE.Mesh(new THREE.SphereGeometry(map.averageHeight, 50, 50), new THREE.MeshLambertMaterial({color: 0x84d4b4}));
  scene.add(waterMesh);

  a = new Actor(map, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1))

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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
  stats.begin();
  requestAnimationFrame(render);
  controls.update();

  map.update();

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

