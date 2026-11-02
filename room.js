import * as THREE from 'three';

export function createRoom(container, language) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xfff4d9, 18, 32);
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 70);
  const homePosition = new THREE.Vector3(9.6, 7.25, 13.9);
  const homeTarget = new THREE.Vector3(0, 1.15, -.05);
  camera.position.copy(homePosition);
  camera.lookAt(homeTarget);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label', language === 'zh'
    ? '动画还原风格客厅，白板、电视、成果箱和电话均可点击。'
    : 'An animation-inspired living room with four interactive objects.');
  container.prepend(renderer.domElement);

  const geometries = [], materials = [], textures = [], targets = [];
  const objects = new Map();
  const mat = (color, roughness = .78, metalness = 0, options = {}) => {
    const value = options.transparent || options.transmission
      ? new THREE.MeshPhysicalMaterial({ color, roughness, metalness, ...options })
      : new THREE.MeshToonMaterial({ color, ...options });
    materials.push(value);
    return value;
  };
  const M = {
    wall: mat(0xb7cf85), wallLight: mat(0xfff0cf),
    wood: mat(0xc78b4a), woodDark: mat(0x6c4933), table: mat(0xd9a34c),
    floor: mat(0xcadd8c), green: mat(0x6b8a52),
    greenLight: mat(0xdce7a9), cream: mat(0xffedc9),
    white: mat(0xfffdf2), red: mat(0xe75c4d), pink: mat(0xf2a3ba), gray: mat(0x788f99),
    yellow: mat(0xf5c84d), blue: mat(0x67a9c5), sky: mat(0x8ed4f6), leaf: mat(0x66b64c),
    ink: mat(0x303438), brass: mat(0xe1aa43),
    glass: mat(0xbde8f4, .16, 0, { transparent: true, opacity: .38, transmission: .18 }),
    glow: mat(0xfff4c7), paper: mat(0xfff8df)
  };
  const mesh = (geometry, material, parent = scene) => {
    geometries.push(geometry);
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (w, h, d, material, x, y, z, parent = scene) => {
    const object = mesh(new THREE.BoxGeometry(w, h, d), material, parent);
    object.position.set(x, y, z);
    return object;
  };
  const cyl = (r1, r2, h, material, x, y, z, parent = scene, segments = 24) => {
    const object = mesh(new THREE.CylinderGeometry(r1, r2, h, segments), material, parent);
    object.position.set(x, y, z);
    return object;
  };
  const ball = (r, material, x, y, z, parent = scene, sx = 1, sy = 1, sz = 1) => {
    const object = mesh(new THREE.SphereGeometry(r, 24, 16), material, parent);
    object.position.set(x, y, z);
    object.scale.set(sx, sy, sz);
    return object;
  };
  const picture = (file, w, h, x, y, z, parent) => {
    const texture = new THREE.TextureLoader().load('assets/' + file);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    materials.push(material);
    const object = mesh(new THREE.PlaneGeometry(w, h), material, parent);
    object.position.set(x, y, z);
    return object;
  };
  const interactive = (id, x, y, z) => {
    const root = new THREE.Group();
    root.position.set(x, y, z);
    root.userData.route = id;
    scene.add(root);
    targets.push(root);
    objects.set(id, { root, base: new THREE.Vector3(x, y, z) });
    return root;
  };

  scene.add(new THREE.HemisphereLight(0xfff8df, 0x9ab66a, 1.35));
  const sun = new THREE.DirectionalLight(0xfff1c2, 1.75);
  sun.position.set(-6, 11, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
  sun.shadow.normalBias = .035;
  scene.add(sun);
  const roomGlow = new THREE.PointLight(0xffd98d, 2.4, 14, 2);
  roomGlow.position.set(0, 5.4, 1.5);
  scene.add(roomGlow);

  // Single Japanese tatami living room based on the supplied reference.
  box(10.5, .32, 7.4, M.woodDark, 0, -.2, 0);
  box(10.2, .13, 7.1, M.floor, 0, .02, 0);
  for (let x = -5; x <= 5; x += 2.5) box(.035, .012, 6.95, M.green, x, .095, 0);
  for (let z = -3.35; z <= 3.35; z += 1.72) box(10.05, .012, .035, M.green, 0, .096, z);
  box(10.5, 5.4, .2, M.wall, 0, 2.65, -3.62);
  box(.2, 5.4, 7.35, M.wallLight, -5.22, 2.65, 0);
  box(10.45, .16, .24, M.woodDark, 0, .2, -3.49);
  box(.24, .16, 7.2, M.woodDark, -5.08, .2, 0);
  box(10.4, .1, .22, M.wood, 0, 5.24, -3.5);
  for (const x of [-3.4, -1.7, 0, 1.7, 3.4]) box(.07, 5.05, .06, M.wood, x, 2.7, -3.48);

  // Sliding doors and curtains on the right.
  box(3.4, 3.3, .12, M.woodDark, 3.1, 2.05, -3.46);
  box(3.18, 3.05, .045, M.glass, 3.1, 2.05, -3.36);
  box(.07, 3.08, .05, M.wood, 3.1, 2.05, -3.28);
  box(3.15, .07, .05, M.wood, 3.1, 2.05, -3.27);
  box(.62, 3.2, .08, M.pink, 1.68, 2.03, -3.15);
  box(.62, 3.2, .08, M.pink, 4.52, 2.03, -3.15);
  // Bright garden visible through the sliding glass doors.
  box(3.05, 2.92, .035, M.sky, 3.1, 2.05, -3.58);
  for (const x of [2.05, 2.65, 3.35, 4.05]) ball(.42, M.leaf, x, .72, -3.47, scene, 1.2, .8, .45);

  // Pale-green fusuma closet panels.
  box(.12, 3.25, 3.15, M.woodDark, -5.08, 1.92, -.55);
  box(.08, 3.02, 1.38, M.greenLight, -4.98, 1.92, -1.3);
  box(.08, 3.02, 1.38, M.greenLight, -4.98, 1.92, .2);
  ball(.06, M.ink, -4.88, 1.92, -.72);
  ball(.06, M.ink, -4.88, 1.92, -.38);

  // Nohara-family style low table: broad honey-coloured top and thick square legs.
  box(3.35, .24, 2.05, M.table, -.05, .82, .65);
  box(3.12, .08, 1.82, M.wood, -.05, .675, .65);
  for (const x of [-1.42, 1.32]) for (const z of [-.12, 1.42]) box(.2, .66, .2, M.table, x, .39, z);
  // Mug and green tissue box from the supplied living-room reference.
  const mug = cyl(.18, .2, .38, M.white, -.82, 1.15, .48);
  const mugHandle = mesh(new THREE.TorusGeometry(.16, .045, 8, 20, Math.PI * 1.55), M.white);
  mugHandle.position.set(-.61, 1.16, .48); mugHandle.rotation.y = Math.PI / 2;
  box(.54, .5, .34, M.green, .75, 1.12, .53);
  box(.42, .07, .25, M.white, .75, 1.4, .53);

  // 01 Whiteboard — profile.
  const about = interactive('about', 0, 2.85, -3.35);
  box(2.5, 1.42, .1, M.wood, 0, 0, 0, about);
  box(2.32, 1.24, .055, M.white, 0, 0, .08, about);
  box(1.78, .09, .03, M.green, -.12, .3, .12, about);
  for (const [x, y, c] of [[-.72,0,M.red],[-.18,0,M.blue],[.42,0,M.yellow]]) box(.42,.08,.03,c,x,y,.12,about);
  box(1.05,.07,.03,M.ink,-.4,-.32,.12,about);

  // 02 Television — projects and internships.
  const projects = interactive('projects', -2.95, 1.15, -2.88);
  box(3.05, 1.1, .6, M.gray, 0, -.52, .18, projects);
  for (const x of [-1.22, 1.22]) box(.12, .42, .12, M.woodDark, x, -1.22, .18, projects);
  box(2.32, 1.45, .16, M.ink, 0, .58, 0, projects);
  box(2.08, 1.2, .035, M.glass, 0, .58, .1, projects);
  box(.86, .08, .04, M.green, 0, .72, .15, projects);
  box(1.34, .06, .04, M.white, 0, .42, .15, projects);
  box(.62, .06, .04, M.yellow, -.36, .18, .15, projects);

  // 03 Trophy box and documents — honors, papers, patents and software.
  const achievements = interactive('achievements', -3.9, .15, 2.65);
  box(1.7, .48, 1.25, M.wood, 0, .24, 0, achievements);
  box(1.56, .08, 1.1, M.woodDark, 0, .52, 0, achievements);
  for (const x of [-.5, 0, .5]) {
    cyl(.07, .09, .36, M.brass, x, .78, 0, achievements);
    cyl(.22, .07, .3, M.brass, x, 1.08, 0, achievements);
  }
  box(.78, .035, .48, M.red, 0, .62, -.36, achievements);
  box(.72, .03, .44, M.paper, .05, .67, -.33, achievements);
  box(.52, .018, .025, M.ink, .05, .69, -.25, achievements);

  // 04 Telephone by the entry — contact.
  const contact = interactive('contact', 4.1, .82, 1.95);
  box(1.28, 1.1, .62, M.wood, 0, .1, 0, contact);
  box(1.42, .14, .72, M.woodDark, 0, .68, 0, contact);
  box(.68, .22, .42, M.red, 0, .88, 0, contact);
  cyl(.12, .12, .42, M.red, -.4, 1.03, 0, contact);
  cyl(.12, .12, .42, M.red, .4, 1.03, 0, contact);
  box(.82, .11, .15, M.red, 0, 1.16, 0, contact);

  // Wall clock and pendant light complete the animated-home character.
  const clock = cyl(.48, .48, .08, M.woodDark, -4.35, 3.72, -3.39);
  clock.rotation.x = Math.PI / 2;
  const face = cyl(.4, .4, .085, M.white, -4.35, 3.72, -3.33);
  face.rotation.x = Math.PI / 2;
  box(.035, .26, .025, M.ink, -4.35, 3.82, -3.24);
  box(.2, .035, .025, M.ink, -4.25, 3.72, -3.24);
  box(2.05, .18, 1.25, M.wood, 0, 4.78, .25);
  box(1.82, .14, 1.03, M.glow, 0, 4.66, .25);
  cyl(.025, .025, .45, M.ink, .72, 4.39, .25);

  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let hovered = null, entering = null, enterStarted = 0, startPosition, startTarget, startZoom;
  const pick = event => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targets, true)[0];
    if (!hit) return null;
    let object = hit.object;
    while (object && !object.userData.route) object = object.parent;
    return object ? object.userData.route : null;
  };
  const setHover = id => {
    if (hovered === id) return;
    hovered = id;
    renderer.domElement.style.cursor = id ? 'pointer' : 'default';
    container.dataset.hovered = id || '';
  };
  const enter = id => {
    if (!id || entering) return;
    entering = id;
    enterStarted = performance.now();
    startPosition = camera.position.clone();
    startTarget = homeTarget.clone();
    startZoom = camera.zoom;
    container.classList.add('room-entering');
  };
  const click = event => enter(pick(event));
  const move = event => { if (!entering) setHover(pick(event)); };
  const leave = () => { if (!entering) setHover(null); };
  renderer.domElement.addEventListener('click', click);
  renderer.domElement.addEventListener('pointermove', move);
  renderer.domElement.addEventListener('pointerleave', leave);
  container.querySelectorAll('[data-object]').forEach(label => label.addEventListener('click', event => {
    event.preventDefault();
    enter(label.dataset.object);
  }));

  const fit = () => {
    const width = container.clientWidth, height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    if (!entering) {
      camera.position.copy(homePosition);
      camera.lookAt(homeTarget);
      camera.zoom = width < 650 ? .67 : Math.min(1.08, camera.aspect / 1.35);
    }
    camera.updateProjectionMatrix();
  };
  fit();
  const resize = new ResizeObserver(fit);
  resize.observe(container);
  renderer.setAnimationLoop(() => {
    if (document.hidden) return;
    for (const [id, data] of objects) {
      const targetScale = hovered === id && !entering ? 1.045 : 1;
      data.root.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .1);
    }
    if (entering) {
      const data = objects.get(entering);
      const progress = Math.min(1, (performance.now() - enterStarted) / 720);
      const eased = 1 - Math.pow(1 - progress, 3);
      const center = data.base.clone();
      const destination = center.clone().add(new THREE.Vector3(3.2, 2.4, 4.5));
      const target = center.clone();
      camera.position.lerpVectors(startPosition, destination, eased);
      camera.lookAt(startTarget.clone().lerp(target, eased));
      camera.zoom = THREE.MathUtils.lerp(startZoom, 1.22, eased);
      camera.updateProjectionMatrix();
      if (progress >= 1) location.hash = entering;
    }
    renderer.render(scene, camera);
  });
  container.classList.add('loaded');

  return () => {
    resize.disconnect();
    renderer.setAnimationLoop(null);
    renderer.domElement.removeEventListener('click', click);
    renderer.domElement.removeEventListener('pointermove', move);
    renderer.domElement.removeEventListener('pointerleave', leave);
    geometries.forEach(item => item.dispose());
    materials.forEach(item => item.dispose());
    textures.forEach(item => item.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
