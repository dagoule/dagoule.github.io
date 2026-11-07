import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

export function createScene(container, language) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x879aa7, 18, 39);
  const camera = new THREE.PerspectiveCamera(29, 1, .1, 90);
  camera.position.set(11.8, 9.4, 15.6);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', language === 'zh'
    ? '红瓦双层住宅、庭院与车棚的三维场景。点击房门进入。'
    : 'A two-storey red-roof residence with a garden and carport. Select the front door to enter.');
  container.prepend(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.05, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 11;
  controls.maxDistance = 27;
  controls.minPolarAngle = .35;
  controls.maxPolarAngle = 1.35;
  controls.rotateSpeed = .55;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = .16;
  controls.update();
  controls.saveState();

  const world = new THREE.Group();
  world.rotation.y = -.08;
  scene.add(world);
  const geometries = [], materials = [], textures = [], interactive = [];
  const mat = (color, roughness = .76, metalness = 0, options = {}) => {
    const value = options.transparent || options.transmission
      ? new THREE.MeshPhysicalMaterial({ color, roughness, metalness, ...options })
      : new THREE.MeshToonMaterial({ color, ...options });
    materials.push(value);
    return value;
  };
  const M = {
    grass: mat(0x7fc85d), grass2: mat(0xa8d77a),
    cream: mat(0xfff0cf), white: mat(0xfffdf1),
    red: mat(0xcf5145), redDark: mat(0xa33d36),
    wood: mat(0xc58a4a), woodDark: mat(0x714b31),
    stone: mat(0xd8d1bd), road: mat(0xa9a6aa),
    glass: mat(0xa9dcf3, .18, 0, { transparent: true, opacity: .46, transmission: .2 }),
    metal: mat(0x49555a), brass: mat(0xe1aa43), canopy: mat(0x86c7d6),
    hedge: mat(0x4f9b4d), leaf: mat(0x54a848),
    tire: mat(0x272c2f), car: mat(0x4dc3c0),
    warm: mat(0xffdf91)
  };
  const mesh = (geometry, material, parent = world) => {
    geometries.push(geometry);
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (w, h, d, material, x, y, z, parent = world) => {
    const object = mesh(new THREE.BoxGeometry(w, h, d), material, parent);
    object.position.set(x, y, z);
    return object;
  };
  const cyl = (r1, r2, h, material, x, y, z, parent = world, segments = 24) => {
    const object = mesh(new THREE.CylinderGeometry(r1, r2, h, segments), material, parent);
    object.position.set(x, y, z);
    return object;
  };
  const ball = (r, material, x, y, z, parent = world, sx = 1, sy = 1, sz = 1) => {
    const object = mesh(new THREE.SphereGeometry(r, 24, 16), material, parent);
    object.position.set(x, y, z);
    object.scale.set(sx, sy, sz);
    return object;
  };

  scene.add(new THREE.HemisphereLight(0xdcecff, 0x526a58, 1.05));
  const sun = new THREE.DirectionalLight(0xe6eef3, 1.35);
  sun.position.set(-7, 14, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  sun.shadow.normalBias = .035;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xbad9ff, .45);
  rim.position.set(9, 7, -9);
  scene.add(rim);

  // Plot, road and pavement.
  box(15.4, .32, 11.4, M.grass, 0, -.2, 0);
  box(15.6, .08, 2.3, M.road, 0, -.02, -6.55);
  box(15.6, .06, .75, M.stone, 0, .02, -5.04);
  for (let x = -7; x <= 7; x += 1.4) box(.74, .025, .08, M.white, x, .035, -6.55);
  box(1.25, .045, 5.5, M.stone, 1.5, .04, 3.15);
  for (let z = .7; z < 5.6; z += .55) box(1.12, .018, .035, M.white, 1.5, .071, z);

  const house = new THREE.Group();
  house.position.set(-.75, 0, -.15);
  world.add(house);

  // Two full storeys with projecting balcony.
  box(7.2, 2.5, 5.15, M.cream, 0, 1.3, 0, house);
  box(6.6, 2.25, 4.65, M.white, -.2, 3.7, -.08, house);
  box(7.35, .18, 5.3, M.stone, 0, 2.55, 0, house);
  box(7.05, .14, 1.35, M.white, -.15, 2.78, 2.4, house);
  box(6.8, .1, 1.2, M.wood, -.15, 2.88, 2.43, house);
  for (const x of [-3.3, 3]) box(.09, 1.05, 1.12, M.white, x, 3.38, 2.42, house);
  box(6.7, .06, .06, M.white, -.15, 3.9, 2.94, house);
  box(6.7, .06, .06, M.white, -.15, 3.38, 2.94, house);
  for (let x = -3.25; x <= 3; x += .55) box(.035, 1.05, .035, M.white, x, 3.42, 2.94, house);
  box(6.55, .72, .035, M.glass, -.15, 3.42, 2.91, house);

  const windowAt = (x, y, z, w, h, parent = house) => {
    box(w + .16, h + .16, .08, M.wood, x, y, z, parent);
    box(w, h, .09, M.glass, x, y, z + .05, parent);
    box(.045, h, .04, M.white, x, y, z + .11, parent);
    box(w, .045, .04, M.white, x, y, z + .11, parent);
  };
  windowAt(-2.15, 1.32, 2.61, 1.65, 1.35);
  windowAt(-.15, 1.32, 2.61, 1.3, 1.35);
  windowAt(-1.9, 3.7, 2.3, 1.55, 1.2);
  windowAt(.25, 3.7, 2.3, 1.55, 1.2);

  const doorGroup = new THREE.Group();
  doorGroup.userData.enter = true;
  house.add(doorGroup);
  const door = box(.95, 1.85, .13, M.wood, 2.35, .96, 2.65, doorGroup);
  box(.68, .62, .025, M.glass, 2.35, 1.32, 2.73, doorGroup);
  ball(.045, M.brass, 2.7, .83, 2.76, doorGroup);
  box(1.35, .13, .8, M.stone, 2.35, .07, 2.85, house);
  box(1.45, .12, .72, M.wood, 2.35, 2.05, 2.68, house);
  interactive.push(doorGroup);

  // Liftable red hip roof with subtle tile bands.
  const roofGroup = new THREE.Group();
  roofGroup.position.set(-.2, 5.02, -.08);
  house.add(roofGroup);
  const roofGeometry = new THREE.BufferGeometry();
  const roofVertices = new Float32Array([
    -4.15,0,2.9, 4.15,0,2.9, 2.55,1.38,0,
    -4.15,0,2.9, 2.55,1.38,0, -2.55,1.38,0,
    -4.15,0,-2.9, 2.55,1.38,0, 4.15,0,-2.9,
    -4.15,0,-2.9, -2.55,1.38,0, 2.55,1.38,0,
    -4.15,0,-2.9, -4.15,0,2.9, -2.55,1.38,0,
    4.15,0,2.9, 4.15,0,-2.9, 2.55,1.38,0
  ]);
  roofGeometry.setAttribute('position',new THREE.BufferAttribute(roofVertices,3));
  roofGeometry.computeVertexNormals();
  mesh(roofGeometry,M.red,roofGroup);
  box(5.2,.14,.14,M.redDark,0,1.4,0,roofGroup);
  const dishPole = cyl(.05, .05, .65, M.metal, -1.35, 1.22, -.2, roofGroup);
  dishPole.rotation.z = -.2;
  const dish = mesh(new THREE.SphereGeometry(.48, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.stone, roofGroup);
  dish.position.set(-1.48, 1.52, -.18);
  dish.rotation.z = -.45;

  // Carport and compact car.
  const carport = new THREE.Group();
  carport.position.set(4.95, 0, -.25);
  world.add(carport);
  for (const x of [-1.2, 1.2]) for (const z of [-1.65, 1.65]) box(.08, 2.45, .08, M.metal, x, 1.22, z, carport);
  box(2.75, .1, 3.7, M.canopy, 0, 2.48, 0, carport);
  for (let z = -1.6; z <= 1.6; z += .32) box(2.65, .018, .035, M.glass, 0, 2.55, z, carport);
  const car = new THREE.Group();
  car.position.set(4.95, .02, -.25);
  world.add(car);
  box(1.75, .48, 3, M.car, 0, .42, 0, car);
  box(1.5, .55, 1.55, M.glass, 0, .82, -.15, car);
  for (const x of [-.82, .82]) for (const z of [-1.05, 1.05]) {
    const wheel = cyl(.22, .22, .14, M.tire, x, .25, z, car);
    wheel.rotation.z = Math.PI / 2;
  }

  // Cream boundary wall and dark entrance gate from the reference.
  box(14.5,.82,.22,M.cream,0,.4,-4.65);
  box(.22,.82,10.1,M.cream,-7.2,.4,.4);
  box(.22,.82,10.1,M.cream,7.2,.4,.4);
  box(7.25,.82,.22,M.cream,-3.57,.4,5.45);
  box(4.3,.82,.22,M.cream,5.05,.4,5.45);
  for (const x of [.38,2.82]) box(.52,1.2,.52,M.cream,x,.6,5.45);
  box(2.05,.08,.12,M.metal,1.6,.96,5.36);
  box(2.05,.08,.12,M.metal,1.6,.18,5.36);
  for (let x=.62;x<=2.58;x+=.28) box(.055,.96,.055,M.metal,x,.52,5.36);
  box(.22,.3,.035,M.red,2.82,.74,5.16);

  const tree = (x, z, scale = 1) => {
    cyl(.13, .18, 1.25 * scale, M.woodDark, x, .62 * scale, z);
    ball(.68 * scale, M.leaf, x, 1.55 * scale, z, world, 1, 1.15, 1);
    ball(.48 * scale, M.hedge, x - .38 * scale, 1.55 * scale, z + .08, world);
    ball(.45 * scale, M.grass2, x + .35 * scale, 1.75 * scale, z, world);
  };
  tree(-5.8, -1.7, 1.25);
  tree(3.15, 3.55, .8);
  for (let i = 0; i < 12; i++) {
    ball(.28, i % 2 ? M.hedge : M.grass2, -6.45 + i * .48, .25, 4.8, world, 1, .9, 1);
    if (i < 8) ball(.27, M.hedge, -6.65, .25, -3.7 + i * .48);
  }
  const planter = (x, y, z) => {
    box(.8, .25, .38, M.white, x, y, z, house);
    for (let i = -1; i <= 1; i++) ball(.15, M.leaf, x + i * .22, y + .23, z, house);
  };
  planter(-2.55, 3.02, 3.02);
  planter(-1.55, 3.02, 3.02);

  // High-fidelity 3D character renders placed inside the real Three.js world.
  const textureLoader = new THREE.TextureLoader();
  const characterSprite = (source, x, y, z, width, height) => {
    const texture = textureLoader.load(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      alphaTest: .035,
      depthWrite: true,
      toneMapped: false
    });
    materials.push(material);
    const sprite = new THREE.Sprite(material);
    sprite.position.set(x, y, z);
    sprite.scale.set(width, height, 1);
    sprite.center.set(.5, 0);
    sprite.renderOrder = 4;
    world.add(sprite);
    return sprite;
  };
  const characterShadow = (x, z, sx, sz) => {
    const material = new THREE.MeshBasicMaterial({ color: 0x26363d, transparent: true, opacity: .24, depthWrite: false });
    materials.push(material);
    const shadow = mesh(new THREE.CircleGeometry(.65, 32), material);
    shadow.position.set(x, .045, z);
    shadow.scale.set(sx, sz, 1);
    shadow.rotation.x = -Math.PI / 2;
  };
  const shinchan = characterSprite('./assets/shinchan-3d.png', -.45, .08, 5.02, 1.68, 2.28);
  const shiro = characterSprite('./assets/shiro-3d.png', 4.65, .06, 5.08, 1.55, 1.05);
  characterShadow(-.45, 5.05, 1.1, .38);
  characterShadow(4.65, 5.1, .95, .32);

  // Wet ground details catch the cool rainy light.
  const puddleMaterial = mat(0x9fc5d0, .16, .05, { transparent: true, opacity: .27, clearcoat: 1, clearcoatRoughness: .12, depthWrite: false });
  const puddle = (x, z, sx, sz) => {
    const object = mesh(new THREE.CircleGeometry(.75, 40), puddleMaterial);
    object.position.set(x, .052, z);
    object.scale.set(sx, sz, 1);
    object.rotation.x = -Math.PI / 2;
  };
  puddle(-2.5, -5.62, 2.2, .42);
  puddle(4.55, -5.75, 1.7, .34);
  puddle(1.35, 4.3, 1.1, .3);

  // Real-time rain made from lightweight line segments at varied depth and speed.
  const rainCount = innerWidth < 650 ? 280 : 620;
  const rainPositions = new Float32Array(rainCount * 6);
  const rainSpeeds = new Float32Array(rainCount);
  const resetDrop = (index, initial = false) => {
    const offset = index * 6;
    const x = THREE.MathUtils.randFloat(-10.5, 10.5);
    const y = initial ? THREE.MathUtils.randFloat(.4, 13) : THREE.MathUtils.randFloat(10, 14);
    const z = THREE.MathUtils.randFloat(-9, 10);
    const length = THREE.MathUtils.randFloat(.32, .72);
    rainPositions[offset] = x;
    rainPositions[offset + 1] = y;
    rainPositions[offset + 2] = z;
    rainPositions[offset + 3] = x - .055;
    rainPositions[offset + 4] = y - length;
    rainPositions[offset + 5] = z + .025;
    rainSpeeds[index] = THREE.MathUtils.randFloat(7.5, 13.5);
  };
  for (let i = 0; i < rainCount; i++) resetDrop(i, true);
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  geometries.push(rainGeometry);
  const rainMaterial = new THREE.LineBasicMaterial({ color: 0xcfe8f4, transparent: true, opacity: .58, depthWrite: false });
  materials.push(rainMaterial);
  const rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  rain.frustumCulled = false;
  rain.renderOrder = 8;
  scene.add(rain);

  // Shiro's small blue-roof dog house.
  const doghouse=new THREE.Group();doghouse.position.set(-4.65,0,3.2);world.add(doghouse);
  box(1.15,.8,1,M.white,0,.42,0,doghouse);
  const dogRoofL=box(.78,.09,1.3,M.canopy,-.34,.96,0,doghouse);dogRoofL.rotation.z=.48;
  const dogRoofR=box(.78,.09,1.3,M.canopy,.34,.96,0,doghouse);dogRoofR.rotation.z=-.48;
  ball(.28,M.ink,0,.36,.52,doghouse,1,1.22,.18);
  box(.9,.08,.26,M.stone,0,.04,.58,doghouse);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let entering = false, enterStart = 0, startPosition, startTarget;
  const pickDoor = event => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactive, true)[0];
    if (!hit) return false;
    let object = hit.object;
    while (object && !object.userData.enter) object = object.parent;
    return Boolean(object);
  };
  const enter = () => {
    if (entering) return;
    entering = true;
    enterStart = performance.now();
    startPosition = camera.position.clone();
    startTarget = controls.target.clone();
    controls.enabled = false;
    controls.autoRotate = false;
    container.classList.add('entering');
  };
  const click = event => { if (pickDoor(event)) enter(); };
  const move = event => { renderer.domElement.style.cursor = pickDoor(event) ? 'pointer' : 'grab'; };
  renderer.domElement.addEventListener('click', click);
  renderer.domElement.addEventListener('pointermove', move);

  const enterButton = document.querySelector('#enter-house');
  const resetButton = document.querySelector('#reset-scene');
  const motionButton = document.querySelector('#motion');
  enterButton?.addEventListener('click', enter);
  resetButton?.addEventListener('click', () => { controls.reset(); controls.autoRotate = !reduced; });
  motionButton?.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    motionButton.textContent = controls.autoRotate
      ? (language === 'zh' ? '暂停动画' : 'Pause motion')
      : (language === 'zh' ? '继续动画' : 'Resume motion');
  });

  const resize = new ResizeObserver(() => {
    const width = container.clientWidth, height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.zoom = width < 650 ? .72 : Math.min(1, camera.aspect / 1.32);
    camera.updateProjectionMatrix();
  });
  resize.observe(container);

  let previousFrame = performance.now();
  renderer.setAnimationLoop(() => {
    if (document.hidden) return;
    const now = performance.now();
    const delta = Math.min(.05, (now - previousFrame) / 1000);
    previousFrame = now;
    if (!reduced) {
      const positions = rainGeometry.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        const offset = i * 6;
        const fall = rainSpeeds[i] * delta;
        positions[offset + 1] -= fall;
        positions[offset + 4] -= fall;
        if (positions[offset + 1] < .02) resetDrop(i, false);
      }
      rainGeometry.attributes.position.needsUpdate = true;
      const float = Math.sin(now * .0024);
      shinchan.position.y = .08 + float * .025;
      shiro.position.y = .06 - float * .018;
    }
    if (entering) {
      const progress = Math.min(1, (performance.now() - enterStart) / 1050);
      const eased = 1 - Math.pow(1 - progress, 3);
      roofGroup.position.y = 5.02 + eased * 4.2;
      roofGroup.rotation.y = eased * .12;
      roofGroup.traverse(object => {
        if (object.material) {
          object.material.transparent = true;
          object.material.opacity = 1 - Math.max(0, progress - .35) / .65;
        }
      });
      const destination = new THREE.Vector3(4.8, 5.2, 8.6);
      const target = new THREE.Vector3(.65, 1.2, 1.1);
      camera.position.lerpVectors(startPosition, destination, eased);
      controls.target.lerpVectors(startTarget, target, eased);
      camera.lookAt(controls.target);
      container.style.setProperty('--entry-fade', Math.max(0, (progress - .78) / .22));
      if (progress >= 1) location.hash = 'room';
    } else {
      controls.update();
    }
    renderer.render(scene, camera);
  });
  container.classList.add('loaded');

  return () => {
    resize.disconnect();
    renderer.setAnimationLoop(null);
    renderer.domElement.removeEventListener('click', click);
    renderer.domElement.removeEventListener('pointermove', move);
    enterButton?.removeEventListener('click', enter);
    controls.dispose();
    geometries.forEach(item => item.dispose());
    materials.forEach(item => item.dispose());
    textures.forEach(item => item.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
