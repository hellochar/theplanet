function Map(segments, heightAt) {
  this.heightAt = (heightAt === undefined) ? Map.generateDefaultHeightFn() : heightAt;

  this.geometry = new THREE.CubeGeometry(1, 1, 1, segments, segments, segments);
  this.geometry.vertices.forEach(function (v) {
    v.normalize();
    v.setLength(this.heightAt(v));
  }, this);
  this.geometry.verticesNeedUpdate = true;
  this.geometry.computeFaceNormals();
  this.geometry.computeVertexNormals();
  this.geometry.computeCentroids();
  this.geometry.computeTangents();
  this.geometry.normalsNeedUpdate = true;

  this.averageHeight = _.reduce(this.geometry.vertices, function(memo, v) { return memo + v.length(); }, 0) / ( this.geometry.vertices.length );

  this.actors = [];
}

Map.prototype.update = function() {
  this.actors.forEach(function (a) {
    a.update();
  });
}

Map.prototype.onTerrain = function(pos) {
  return pos.clone().setLength(this.heightAt(pos));
};

Map.generateDefaultHeightFn = function() {
  var noise = new ClassicalNoise();
  return function(pos) {
    var v = pos.clone().setLength(4);
    var noise1 = .5 * noise.noise(v.x, v.y, v.z);
    var noise2 = .1 * noise.noise(v.x * 5, v.y * 5, v.z * 5);
    var noise3 = .01 * noise.noise(v.x * 50, v.y * 50, v.z * 50);
    return 8 + noise1 + noise2 + noise3;
  };
}
