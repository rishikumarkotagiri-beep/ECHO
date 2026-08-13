import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export function addBuildingDetails(renderer, group, building, width, height, depth) {
  const type = building.type || "house";
  const frontZ = -depth / 2 - 0.08;
  const sideX = width / 2 + 0.05;
  const trimColors = {
    house: 0xe5c5a0,
    apartment: 0xb8c5ce,
    market: 0xf4d36c,
    cafe: 0xf0a477,
    bank: 0xb9d4e2,
    gym: 0x4de0c2,
    library: 0xbca8d9,
    clinic: 0xf1f1e8,
    school: 0xe5bd6d,
    station: 0x7db8d0,
    workshop: 0xa98768
  };
  const trimColor = trimColors[type] || 0xd0d0d0;
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.65
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x25282b,
    roughness: 0.8
  });
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x7fd7e6,
    roughness: 0.16,
    metalness: 0.22,
    emissive: 0x123d43,
    emissiveIntensity: 0.3
  });
  addBaseTrim(group, width, depth, trimMaterial);
  addWindowFrames(group, width, height, depth, glassMaterial, darkMaterial);
  addFrontDoor(group, depth, type);
  if (type === "house") addHousePorch(group, width, depth, trimMaterial);
  if (type === "apartment") addBalconies(group, width, height, depth, trimMaterial, darkMaterial);
  if (["market", "cafe", "bank", "gym", "library", "clinic", "school", "station", "workshop"].includes(type)) {
    addStorefront(group, width, depth, type, glassMaterial);
  }
  if (type === "cafe") addCafeAwning(group, width, depth);
  if (type === "gym") addGymEntrance(group, width, depth);
  if (type === "clinic") addClinicEntrance(group, width, depth);
  if (type === "library") addLibraryEntrance(group, width, depth);
  if (type === "bank") addBankEntrance(group, width, depth);
  addRoofEquipment(group, width, height, depth, type, darkMaterial);
  addWallLights(renderer, group, width, height, depth, type);
}

function addBaseTrim(group, width, depth, material) {
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, 0.22, depth + 0.08),
    material
  );
  trim.position.y = 0.12;
  trim.castShadow = true;
  group.add(trim);
}

function addWindowFrames(group, width, height, depth, glassMaterial, frameMaterial) {
  const columns = Math.max(1, Math.floor(width / 1.35));
  const rows = Math.max(1, Math.floor((height - 0.5) / 1.45));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = -width / 2 + 0.72 + col * 1.3;
      const y = 1.15 + row * 1.3;
      if (y > height - 0.45) continue;
      addWindow(group, x, y, -depth / 2 - 0.075, glassMaterial, frameMaterial);
      if (width >= 5) {
        addWindowSide(group, sideOffset(width), y, x, glassMaterial, frameMaterial);
      }
    }
  }
}

function sideOffset(width) {
  return width / 2 + 0.075;
}

function addWindow(group, x, y, z, glassMaterial, frameMaterial) {
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.62, 0.05),
    glassMaterial
  );
  glass.position.set(x, y, z);
  group.add(glass);
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.055, 0.09),
    frameMaterial
  );
  top.position.set(x, y + 0.34, z);
  group.add(top);
  const bottom = top.clone();
  bottom.position.y = y - 0.34;
  group.add(bottom);
  const left = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.68, 0.09),
    frameMaterial
  );
  left.position.set(x - 0.31, y, z);
  group.add(left);
  const right = left.clone();
  right.position.x = x + 0.31;
  group.add(right);
  const vertical = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.58, 0.09),
    frameMaterial
  );
  vertical.position.set(x, y, z);
  group.add(vertical);
}

function addWindowSide(group, x, y, z, glassMaterial, frameMaterial) {
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.62, 0.52),
    glassMaterial
  );
  glass.position.set(x, y, z);
  group.add(glass);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.68, 0.055),
    frameMaterial
  );
  frame.position.set(x, y, z - 0.31);
  group.add(frame);
  const frame2 = frame.clone();
  frame2.position.z = z + 0.31;
  group.add(frame2);
}

function addFrontDoor(group, depth, type) {
  const doorColors = {
    house: 0x5b3a29,
    apartment: 0x303b42,
    market: 0x39464a,
    cafe: 0x5d382d,
    bank: 0x253d4a,
    gym: 0x123e38,
    library: 0x493a58,
    clinic: 0xffffff,
    school: 0x62482c,
    station: 0x314d5b,
    workshop: 0x4b3529
  };
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.75, 0.14),
    new THREE.MeshStandardMaterial({
      color: doorColors[type] || 0x493024,
      roughness: 0.65
    })
  );
  door.position.set(0, 0.875, -depth / 2 - 0.1);
  group.add(door);
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 8, 8),
    new THREE.MeshStandardMaterial({
      color: 0xd6b86a,
      metalness: 0.8,
      roughness: 0.2
    })
  );
  handle.position.set(0.27, 0.88, -depth / 2 - 0.19);
  group.add(handle);
}

function addHousePorch(group, width, depth, material) {
  const porch = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.72, 3.8),
      0.16,
      1.05
    ),
    material
  );
  porch.position.set(0, 0.28, -depth / 2 - 0.55);
  porch.castShadow = true;
  group.add(porch);
  [-1, 1].forEach(side => {
    const column = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.8, 0.12),
      material
    );
    column.position.set(
      side * Math.min(width * 0.3, 1.35),
      1.05,
      -depth / 2 - 0.75
    );
    group.add(column);
  });
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.8, 4.2),
      0.16,
      1.35
    ),
    material
  );
  roof.position.set(
    0,
    2,
    -depth / 2 - 0.62
  );
  roof.castShadow = true;
  group.add(roof);
}

function addBalconies(group, width, height, depth, material, darkMaterial) {
  const levels = Math.max(1, Math.floor(height / 2.2));
  for (let i = 0; i < levels; i++) {
    const y = 1.75 + i * 1.9;
    if (y > height - 0.4) continue;
    const balcony = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.min(width * 0.65, 3.5),
        0.12,
        0.85
      ),
      material
    );
    balcony.position.set(
      0,
      y,
      -depth / 2 - 0.42
    );
    balcony.castShadow = true;
    group.add(balcony);
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.min(width * 0.65, 3.5),
        0.42,
        0.08
      ),
      darkMaterial
    );
    rail.position.set(
      0,
      y + 0.26,
      -depth / 2 - 0.82
    );
    group.add(rail);
    for (let x = -1.3; x <= 1.3; x += 0.65) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.42, 0.05),
        darkMaterial
      );
      bar.position.set(
        x,
        y + 0.26,
        -depth / 2 - 0.82
      );
      group.add(bar);
    }
  }
}

function addStorefront(group, width, depth, type, glassMaterial) {
  const frontWidth = Math.min(width * 0.82, 4.4);
  const front = new THREE.Mesh(
    new THREE.BoxGeometry(
      frontWidth,
      1.05,
      0.06
    ),
    glassMaterial
  );
  front.position.set(
    0,
    0.72,
    -depth / 2 - 0.13
  );
  group.add(front);
  const colors = {
    market: 0xffc84a,
    cafe: 0xff875b,
    bank: 0x5aaee8,
    gym: 0x00d9b4,
    library: 0xa882d6,
    clinic: 0xf5f5ee,
    school: 0xf0b94d,
    station: 0x61b9d4,
    workshop: 0xd17b50
  };
  const color = colors[type] || 0xffffff;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      frontWidth + 0.12,
      0.12,
      0.1
    ),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      emissive: color,
      emissiveIntensity: 0.15
    })
  );
  frame.position.set(
    0,
    1.28,
    -depth / 2 - 0.17
  );
  group.add(frame);
}

function addCafeAwning(group, width, depth) {
  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.85, 4.5),
      0.12,
      0.8
    ),
    new THREE.MeshStandardMaterial({
      color: 0xd85f46,
      roughness: 0.7
    })
  );
  awning.position.set(
    0,
    2.05,
    -depth / 2 - 0.42
  );
  awning.rotation.x = -0.12;
  awning.castShadow = true;
  group.add(awning);
}

function addGymEntrance(group, width, depth) {
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.7, 3.5),
      0.45,
      0.12
    ),
    new THREE.MeshStandardMaterial({
      color: 0x00e6c8,
      emissive: 0x00e6c8,
      emissiveIntensity: 0.8
    })
  );
  sign.position.set(
    0,
    2.45,
    -depth / 2 - 0.18
  );
  group.add(sign);
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.55, 2.7),
      0.12,
      0.18
    ),
    new THREE.MeshStandardMaterial({
      color: 0x111b1c,
      roughness: 0.3
    })
  );
  bar.position.set(
    0,
    1.62,
    -depth / 2 - 0.18
  );
  group.add(bar);
}

function addClinicEntrance(group, width, depth) {
  const crossMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xff3344,
    emissiveIntensity: 0.25
  });
  const vertical = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.7, 0.12),
    crossMaterial
  );
  vertical.position.set(
    0,
    2.35,
    -depth / 2 - 0.2
  );
  group.add(vertical);
  const horizontal = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.14, 0.12),
    crossMaterial
  );
  horizontal.position.copy(
    vertical.position
  );
  group.add(horizontal);
}

function addLibraryEntrance(group, width, depth) {
  for (let i = -1; i <= 1; i++) {
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.1,
        0.1,
        1.9,
        10
      ),
      new THREE.MeshStandardMaterial({
        color: 0xe4d7c5,
        roughness: 0.75
      })
    );
    column.position.set(
      i * 0.9,
      1.05,
      -depth / 2 - 0.28
    );
    group.add(column);
  }
}

function addBankEntrance(group, width, depth) {
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(
      Math.min(width * 0.7, 3.6),
      0.18,
      1.15
    ),
    new THREE.MeshStandardMaterial({
      color: 0x334d5b,
      roughness: 0.5
    })
  );
  canopy.position.set(
    0,
    2.25,
    -depth / 2 - 0.55
  );
  canopy.castShadow = true;
  group.add(canopy);
}

function addRoofEquipment(group, width, height, depth, type, darkMaterial) {
  if (height < 3.5) return;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.8,
      0.5,
      0.65
    ),
    darkMaterial
  );
  box.position.set(
    width * 0.22,
    height + 0.38,
    depth * 0.12
  );
  group.add(box);
  if (type === "apartment" || type === "bank") {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.35,
        0.35,
        0.75,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0x62686c,
        roughness: 0.65,
        metalness: 0.2
      })
    );
    tank.position.set(
      -width * 0.2,
      height + 0.5,
      depth * 0.1
    );
    group.add(tank);
  }
}

function addWallLights(renderer, group, width, height, depth, type) {
  const colors = {
    market: 0xffc84a,
    cafe: 0xff895d,
    gym: 0x00e6c8,
    library: 0xa984ff,
    clinic: 0xffffff,
    bank: 0x5dbbff,
    school: 0xffc75d,
    station: 0x6edbff,
    workshop: 0xff875c
  };
  if (!colors[type]) return;
  const material = new THREE.MeshStandardMaterial({
    color: colors[type],
    emissive: colors[type],
    emissiveIntensity: 0.9
  });
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 10, 10),
    material
  );
  lamp.position.set(
    width / 2 - 0.35,
    1.65,
    -depth / 2 - 0.16
  );
  group.add(lamp);
  const light = new THREE.PointLight(
    colors[type],
    0.45,
    4
  );
  light.position.copy(
    lamp.position
  );
  group.add(light);
  if (renderer.dynamicLights) {
    renderer.dynamicLights.push(light);
  }
}
