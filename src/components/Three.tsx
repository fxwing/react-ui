/* eslint-disable no-debugger */
import * as THREE from "three";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Tabs, type TabsProps } from "antd";
import WebGL from "three/addons/capabilities/WebGL.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
THREE.Cache.enabled = true;

function Base() {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initThree();
  }, []);

  function initThree() {
    const scene = new THREE.Scene();
    const { width, height } = containerRef.current!.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({
      canvas: containerRef.current!,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material); //纹理

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // 材质
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);

    scene.add(line);
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    if (WebGL.isWebGLAvailable()) {
      requestAnimationFrame(animate);
    } else {
      const warning = WebGL.getWebGLErrorMessage();
      containerRef.current!.appendChild(warning);
    }
  }

  return (
    <>
      <canvas className="w-full h-full" ref={containerRef}></canvas>
    </>
  );
}

const Text: React.FC<PropsWithChildren> = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const { clientWidth, clientHeight } = container!;

    let camera, cameraTarget, scene, renderer;

    let group, textMesh1, textMesh2, textGeo, materials;

    let firstLetter = true;

    let text = "three.js",
      bevelEnabled = true,
      font = undefined,
      fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
      fontWeight = "bold"; // normal bold

    const depth = 20,
      size = 70,
      hover = 30,
      curveSegments = 4,
      bevelThickness = 2,
      bevelSize = 1.5;

    const mirror = true;

    const fontMap = {
      helvetiker: 0,
      optimer: 1,
      gentilis: 2,
      "droid/droid_sans": 3,
      "droid/droid_serif": 4,
    };

    const weightMap = {
      regular: 0,
      bold: 1,
    };

    const reverseFontMap: string[] = [];
    const reverseWeightMap: string[] = [];

    for (const i in fontMap) reverseFontMap[fontMap[i]] = i;
    for (const i in weightMap) reverseWeightMap[weightMap[i]] = i;

    let targetRotation = 0;
    let targetRotationOnPointerDown = 0;

    let pointerX = 0;
    let pointerXOnPointerDown = 0;

    let windowHalfX = clientHeight / 2;

    let fontIndex = 1;

    init();

    function init() {
      // CAMERA

      camera = new THREE.PerspectiveCamera(
        30,
        clientWidth / clientHeight,
        1,
        1500
      );
      camera.position.set(0, 0, 1);

      cameraTarget = new THREE.Vector3(0, 150, 0);

      // SCENE

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 250, 1400);

      // LIGHTS

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
      dirLight.position.set(0, 0, 1).normalize();
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
      pointLight.color.setHSL(Math.random(), 1, 0.5);
      pointLight.position.set(0, 100, 90);
      scene.add(pointLight);

      materials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
      ];

      group = new THREE.Group();
      group.position.y = 100;

      scene.add(group);

      loadFont();

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.5,
          transparent: true,
        })
      );
      plane.position.y = 100;
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      // RENDERER

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: container,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(clientWidth, clientHeight);
      renderer.setAnimationLoop(animate);

      //   debugger;

      // EVENTS

      container!.style.touchAction = "none";
      container!.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keypress", onDocumentKeyPress);
      document.addEventListener("keydown", onDocumentKeyDown);

      //

      const params = {
        changeColor: function () {
          pointLight.color.setHSL(Math.random(), 1, 0.5);
        },
        changeFont: function () {
          fontIndex++;

          fontName = reverseFontMap[fontIndex % reverseFontMap.length];

          loadFont();
        },
        changeWeight: function () {
          if (fontWeight === "bold") {
            fontWeight = "regular";
          } else {
            fontWeight = "bold";
          }

          loadFont();
        },
        changeBevel: function () {
          bevelEnabled = !bevelEnabled;

          refreshText();
        },
      };

      //

      const gui = new GUI();

      gui.add(params, "changeColor").name("change color");
      gui.add(params, "changeFont").name("change font");
      gui.add(params, "changeWeight").name("change weight");
      gui.add(params, "changeBevel").name("change bevel");
      gui.open();

      //

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      windowHalfX = clientWidth / 2;

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(clientWidth, clientHeight);
    }

    function onDocumentKeyDown(event) {
      if (firstLetter) {
        firstLetter = false;
        text = "";
      }

      const keyCode = event.keyCode;

      // backspace

      if (keyCode == 8) {
        event.preventDefault();

        text = text.substring(0, text.length - 1);
        refreshText();

        return false;
      }
    }

    function onDocumentKeyPress(event) {
      const keyCode = event.which;

      // backspace

      if (keyCode == 8) {
        event.preventDefault();
      } else {
        const ch = String.fromCharCode(keyCode);
        text += ch;

        refreshText();
      }
    }

    function loadFont() {
      const loader = new FontLoader();
      loader.load(
        "fonts/" + fontName + "_" + fontWeight + ".typeface.json",
        function (response) {
          font = response;
          refreshText();
        }
      );
    }

    function createText() {
      textGeo = new TextGeometry(text, {
        font: font,
        size: size,
        depth: depth,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled,
      });

      textGeo.computeBoundingBox();
      const centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      textMesh1 = new THREE.Mesh(textGeo, materials);

      textMesh1.position.x = centerOffset;
      textMesh1.position.y = hover;
      textMesh1.position.z = 0;

      textMesh1.rotation.x = 0;
      textMesh1.rotation.y = Math.PI * 2;

      group.add(textMesh1);

      if (mirror) {
        textMesh2 = new THREE.Mesh(textGeo, materials);

        textMesh2.position.x = centerOffset;
        textMesh2.position.y = -hover;
        textMesh2.position.z = depth;

        textMesh2.rotation.x = Math.PI;
        textMesh2.rotation.y = Math.PI * 2;

        group.add(textMesh2);
      }
    }

    function refreshText() {
      group.remove(textMesh1);
      if (mirror) group.remove(textMesh2);

      if (!text) return;

      createText();
    }

    function onPointerDown(event) {
      if (event.isPrimary === false) return;

      pointerXOnPointerDown = event.clientX - windowHalfX;
      targetRotationOnPointerDown = targetRotation;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      pointerX = event.clientX - windowHalfX;

      targetRotation =
        targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
    }

    function onPointerUp() {
      if (event.isPrimary === false) return;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }

    //

    function animate() {
      group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
      camera.lookAt(cameraTarget);
      renderer.clear();
      renderer.render(scene, camera);
    }
  }, []);
  return (
    <>
      <canvas className="w-full h-full" ref={containerRef}></canvas>
    </>
  );
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Base`,
    children: <Base />,
  },
  {
    key: "2",
    label: `文字`,
    children: <Text />,
  },
  {
    key: "3",
    label: `3`,
    children: <div>3</div>,
  },
];
export default function Three() {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <>
      <main className="w-screen flex-1">
        <Tabs
          destroyInactiveTabPane
          defaultActiveKey="2"
          items={items}
          onChange={onChange}
        />
      </main>
    </>
  );
}
