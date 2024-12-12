const root = document.documentElement;
root.style.setProperty('--color-primary', '#000');
root.style.setProperty('--second-color', '#000');
root.style.setProperty('--home-menu-color', '#fff');
head_color = 0X000;
background_color = '#000';

if (location.pathname === '/') {
var sketch = function(p) {
  p.setup = function() {
    p.createCanvas(p.displayWidth, p.displayHeight);
    p.background(background_color);
  };
  
  p.windowResized = function() {
    p.resizeCanvas(p.displayWidth, p.displayHeight);
    p.background(background_color);
  }
};

var myp5_1 = new p5(sketch);


// BEGIN THREEJS
if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var statsEnabled = false;

var container, stats, loader;

var cam, scene, renderer;

var mesh;

var spotLight;

var mouseX = 0;
var mouseY = 0;

var targetX = 0;
var targetY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  container.setAttribute("id", "threejsDiv");

  //

  cam = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 10000 );
  cam.position.z =950;


  scene = new THREE.Scene();
          

  // LIGHTS

  scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

  spotLight = new THREE.SpotLight( 0xffffbb, 2 );
  spotLight.position.set( 0.5, 0, 1 );
  spotLight.position.multiplyScalar( 700 );
  scene.add( spotLight );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 8192;
  spotLight.shadow.mapSize.height = 8192;

  spotLight.shadow.camera.near = 200;
  spotLight.shadow.camera.far = 1500;

  spotLight.shadow.camera.fov = 40;

  spotLight.shadow.bias = - 0.005;

          

  //

  var mapHeight = new THREE.TextureLoader().load( "/assets/heads/FBHead_baked_tex.png" );
  var material = new THREE.MeshPhongMaterial( {
   
    color: head_color,
    specular: 0x222222,
    shininess: 25,
    bumpMap: mapHeight,
    bumpScale: 15
  } );

  loader = new THREE.GLTFLoader();
  loader.load( "/assets/heads/cat_head.glb", function ( gltf ) {

    createScene( gltf.scene.children[ 0 ].geometry, 120, material );

  } );

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
          renderer.setClearColor( 0x000000, 0 ); 
  renderer.shadowMap.enabled = true;

  //

  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  
  // EVENTS

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );

}


function createScene( geometry, scale, material ) {

  mesh = new THREE.Mesh( geometry, material );

  mesh.position.y = - 20;
  mesh.scale.set( scale, scale, scale );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add( mesh );

}

//

function onWindowResize() {

  renderer.setSize( window.innerWidth, window.innerHeight );

  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

}

//

function animate() {

  requestAnimationFrame( animate );

  render();
  if ( statsEnabled ) stats.update();

}

function render() {

  targetX = mouseX * .001;
  targetY = mouseY * .0004;

  if ( mesh ) {

    mesh.rotation.y += 0.05 * ( targetX - mesh.rotation.y );
    mesh.rotation.x += 0.05 * ( targetY - mesh.rotation.x );
  }
    // Rotates the spotlight around the object
    spotLight.position.x = Math.sin(Date.now() * 0.0035) * 700;
    spotLight.position.z = Math.cos(Date.now() * 0.0035) * 700;
  
    // Update the camera and renderer
    cam.lookAt( scene.position );
    renderer.render( scene, cam );
}
}