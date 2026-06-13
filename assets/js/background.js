// Interactive Three.js Particle Background
(function () {
  const container = document.querySelector("#home");
  if (!container) return;

  const canvas = container.querySelector("canvas");
  if (!canvas) return;

  let scene,
    camera,
    renderer,
    particles,
    particleCount = 1000;
  let positions, velocities;
  let mouseX = 0,
    mouseY = 0;
  let targetX = 0,
    targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0007);

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      3000,
    );
    camera.position.z = 1000;

    const geometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    velocities = [];

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a large sphere or box area
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.2,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Custom circle particle texture using canvas
    const material = new THREE.PointsMaterial({
      size: 3,
      color: 0x7163f1, // Premium theme color matching original site
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.addEventListener("mousemove", onDocumentMouseMove);
    window.addEventListener("resize", onWindowResize);

    animate();
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.15;
    mouseY = (event.clientY - windowHalfY) * 0.15;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Slowly rotate particle field
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    // Smooth camera inertia following mouse
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Update particle positions
    const posAttr = particles.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      posAttr.array[i * 3] += velocities[i].x;
      posAttr.array[i * 3 + 1] += velocities[i].y;
      posAttr.array[i * 3 + 2] += velocities[i].z;

      // Wrap-around particles if they go out of bounds
      if (Math.abs(posAttr.array[i * 3]) > 1200)
        posAttr.array[i * 3] = -posAttr.array[i * 3];
      if (Math.abs(posAttr.array[i * 3 + 1]) > 1200)
        posAttr.array[i * 3 + 1] = -posAttr.array[i * 3 + 1];
      if (Math.abs(posAttr.array[i * 3 + 2]) > 1200)
        posAttr.array[i * 3 + 2] = -posAttr.array[i * 3 + 2];
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  init();
})();
