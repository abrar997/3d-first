"use client";
import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
const social = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8",
    link: "",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    link: "",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8",
    link: "",
  },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // space to render action
  const sceneRef = useRef<BABYLON.Scene | null>(null); // action
  const engineRef = useRef<BABYLON.Engine | null>(null); //engine for action

  useEffect(() => {
    async function renderSceneFunction() {
      if (canvasRef.current) {
        engineRef.current = new BABYLON.Engine(canvasRef.current);
        sceneRef.current = await createScene();
      }

      engineRef.current?.runRenderLoop(() => {
        if (sceneRef.current) sceneRef.current?.render();
      });
    }

    renderSceneFunction();

    return () => {
      if (engineRef.current) engineRef.current.dispose();
    };
  }, [canvasRef, social, engineRef.current]);

  const createScene = async function () {
    const engine = engineRef.current;
    if (!engine) return null;
    const scene = new BABYLON.Scene(engine);

    const light = new BABYLON.HemisphericLight(
      "",
      new BABYLON.Vector3(0, 0.1, 0),
      scene
    );
    light.specular = BABYLON.Color3.FromHexString("#46230a");
    light.intensity = 0.8;
    const camera = new BABYLON.UniversalCamera(
      "",
      new BABYLON.Vector3(2, 4, -5),
      scene
    );
    camera.rotation = new BABYLON.Vector3(0, 0, 0);
    camera.checkCollisions = true;
    camera.speed = 0.3;
    camera.minZ = 0.01;
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(68);
    camera.keysRight.push(65);
    camera.keysUpward.push(32);
    const cameraCanvas = scene.getEngine().getRenderingCanvas(); //connect camera with engine and canvas and scene
    camera.attachControl(cameraCanvas, true); // who control camera direction
    camera.setTarget(BABYLON.Vector3.Zero()); // camera should looks for
    scene.gravity.y = -0.08;
    //camera border
    const x = 14;
    const y = 14;
    const z = 14;

    function clampCameraPosition() {
      const cameraPosition = camera.position;
      //take half space for x,y,z
      const halfX = x / 2;
      const halfY = y / 2;
      const halfZ = z / 2;
      cameraPosition.x = Math.max(-halfX, Math.min(halfX, cameraPosition.x));
      cameraPosition.y = Math.max(-halfY, Math.min(halfY, cameraPosition.y));
      cameraPosition.z = Math.max(-halfZ, Math.min(halfZ, cameraPosition.z));
    }
    scene.registerBeforeRender(() => {
      clampCameraPosition();
    });

    const room = BABYLON.MeshBuilder.CreateBox(
      "",
      {
        size: 16,
        faceColors: [
          new BABYLON.Color4(0.1, 0, 0),
          new BABYLON.Color4(0.1, 0, 0),
          new BABYLON.Color4(0.1, 0, 0),
          new BABYLON.Color4(0.1, 0, 0),
          new BABYLON.Color4(0.1, 0, 0),
        ],
      },
      scene
    );
    const roomMaterial = new BABYLON.StandardMaterial("");
    room.material = roomMaterial;
    roomMaterial.backFaceCulling = false;
    (roomMaterial.diffuseColor = BABYLON.Color3.FromHexString("#463225")),
      (roomMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        scene
      ));
    roomMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    room.checkCollisions = true;

    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      {
        width: 26,
        height: 28,
        subdivisions: 400,
      },
      scene
    );
    ground.position.y = -2;

    const groundTexture = new BABYLON.StandardMaterial("ground");
    ground.material = groundTexture;
    // groundTexture.diffuseColor = BABYLON.Color3.Black();
    // groundTexture.diffuseColor = BABYLON.Color3.FromHexString("#221a0c");
    // groundTexture.diffuseColor = BABYLON.Color3.FromHexString("#eee");
    groundTexture.diffuseTexture = new BABYLON.Texture(
      "https://images.unsplash.com/photo-1495195129352-aeb325a55b65?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
    ground.checkCollisions = true;
    groundTexture.parallaxScaleBias = 1.2;

    const sofa = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "sofa2.glb",
      scene
    );
    sofa.meshes[0].scaling = new BABYLON.Vector3(3.5, 5.2, 3.2);
    sofa.meshes[0].position = new BABYLON.Vector3(-4.2, 0, 0);

    const sofaTable = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "table2.glb",
      scene
    );
    sofaTable.meshes[0].position = new BABYLON.Vector3(-4, 0, -1);
    sofaTable.meshes[0].position.y = -2;
    sofaTable.meshes[0].scaling = new BABYLON.Vector3(2.8, 2, 2);

    const plantSofaTable = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "plantSofa.glb",
      scene
    );
    plantSofaTable.meshes[0].position = new BABYLON.Vector3(-4, -0.5, -4.1);
    // plantSofaTable.meshes[0].position.y = -4;
    plantSofaTable.meshes[0].scaling = new BABYLON.Vector3(3.2, 3.3, 3.2);

    const remote = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "remote.glb",
      scene
    );
    remote.meshes[0].position = new BABYLON.Vector3(-3.5, -0.5, -4.1);
    remote.meshes[0].rotation = new BABYLON.Vector3(0, 0.4, 0);
    // remote.meshes[0].position.y = -4;
    remote.meshes[0].scaling = new BABYLON.Vector3(0.002, 0.002, 0.002);

    const tvTable = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "tvTable3.glb",
      scene
    );

    tvTable.meshes[0].scaling = new BABYLON.Vector3(3, 3, 5.6);
    tvTable.meshes[0].position = new BABYLON.Vector3(-4, -0, -1.6);
    tvTable.meshes[0].rotation = new BABYLON.Vector3(0, -0, 0);
    tvTable.meshes[0].position.y = -2;

    const tv = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "tv.glb",
      scene
    );
    tv.meshes[0].scaling = new BABYLON.Vector3(1, 1, 1);
    tv.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
    tv.meshes[0].position = new BABYLON.Vector3(-4.2, -0.3, -6.5);

    const resume = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "resume.glb",
      scene
    );
    resume.meshes[0].scaling = new BABYLON.Vector3(22, 22, 22);
    resume.meshes[0].rotation = new BABYLON.Vector3(0, 0.9, 0);
    resume.meshes[0].position = new BABYLON.Vector3(-1.6, -1, -7.4);

    const resumeChildren = resume.meshes[0].getChildMeshes();
    resumeChildren.forEach((item, index) => {
      const childTexture = new BABYLON.StandardMaterial(`${index}`);
      item.material = childTexture;
      if (index === 1) {
        childTexture.diffuseTexture = new BABYLON.Texture(
          "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        );
      } else {
        childTexture.diffuseTexture = new BABYLON.Texture("./Images/w.png");
        childTexture.diffuseColor = BABYLON.Color3.Black();
      }
    });

    const plant = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "plant2.glb"
    );
    plant.meshes[0].position = new BABYLON.Vector3(7, 0, 7);
    plant.meshes[0].position.y = -2;
    plant.meshes[0].scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);

    const door = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "door.glb"
    );

    door.meshes[0].position = new BABYLON.Vector3(-7.9, 2.1, 1.5);
    // door.meshes[0].rotation = new BABYLON.Vector3(3.2, 3.27, 0);
    // door.meshes[0].position.y = -2;
    door.meshes[0].scaling = new BABYLON.Vector3(3.6, 3.8, 3.6);

    const office = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "desk2.glb",
      scene
    );
    office.meshes[0].scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
    office.meshes[0].rotation = new BABYLON.Vector3(0, -7.9, 0);
    office.meshes[0].position = new BABYLON.Vector3(7.7, 0, -5);
    office.meshes[0].position.y = -2;

    social.map(async (item) => {
      const officeScreen = await BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./Models/",
        "smallScreen.glb",
        scene
      );
      officeScreen.meshes[0].scaling = new BABYLON.Vector3(0.016, 0.016, 0.016);
      officeScreen.meshes[0].rotation = new BABYLON.Vector3(0, 4.7, 0);

      officeScreen.meshes[0].getChildMeshes().forEach((childMesh, index) => {
        const childMaterial = new BABYLON.StandardMaterial(
          `childMaterial${index}`
        );
        childMesh.material = childMaterial;
        console.log("office", officeScreen.meshes[0].getChildMeshes());

        if (index === 0) {
          childMaterial.diffuseColor = BABYLON.Color3.Black();
        } else if (index === 4) {
          const baseTexture = new BABYLON.Texture(item.imageUrl, scene);
          const texture = baseTexture as BABYLON.Texture;
          childMaterial.diffuseTexture = texture;
          texture.uScale = -1;
          childMaterial.emissiveColor = BABYLON.Color3.White();
        } else if (index === 3) {
          childMaterial.diffuseColor = BABYLON.Color3.Black();
        }

        if (item.id === 1) {
          officeScreen.meshes[0].position = new BABYLON.Vector3(6.6, 0, -6.6);
          officeScreen.meshes[0].position.y = 0.3;
          officeScreen.meshes[0].rotation = new BABYLON.Vector3(0, 5.5, 0);
        } else if (item.id === 2) {
          officeScreen.meshes[0].position = new BABYLON.Vector3(7, 0, -5.2);
          officeScreen.meshes[0].position.y = 0.3;
          officeScreen.meshes[0].rotation = new BABYLON.Vector3(0, 4.7, 0);
        } else if (item.id === 3) {
          officeScreen.meshes[0].position = new BABYLON.Vector3(6.6, 0, -3.8);
          officeScreen.meshes[0].position.y = 0.3;
          officeScreen.meshes[0].rotation = new BABYLON.Vector3(0, 4.2, 0);
        }

        officeScreen.meshes[0].getChildMeshes()[3].actionManager =
          new BABYLON.ActionManager();

        const image =
          officeScreen.meshes[0].getChildMeshes()[3] as BABYLON.Mesh;

        officeScreen.meshes[0]
          .getChildMeshes()[3]
          .actionManager?.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOverTrigger,
              function () {}
            )
          );

        officeScreen.meshes[0]
          .getChildMeshes()[3]
          .actionManager?.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOutTrigger,
              function () {}
            )
          );

        officeScreen.meshes[0]
          .getChildMeshes()[3]
          .actionManager?.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPickTrigger,
              function () {
                window.location.href = item.link;
              }
            )
          );
      });
    });

    const officeChair = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "chair3.glb",
      scene
    );
    officeChair.meshes[0].scaling = new BABYLON.Vector3(0.035, 0.04, 0.035);
    officeChair.meshes[0].rotation = new BABYLON.Vector3(0, 7.9, 0);
    officeChair.meshes[0].position = new BABYLON.Vector3(4, 0, -5.3);
    officeChair.meshes[0].position.y = -2;

    const imageFrame = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "frame3.glb",
      scene
    );

    imageFrame.meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
    imageFrame.meshes[0].scaling = new BABYLON.Vector3(2, 4.6, 10.5);
    imageFrame.meshes[0].position = new BABYLON.Vector3(0, 4, 7.8);
    console.log(imageFrame.meshes[0].getChildMeshes());

    imageFrame.meshes[0].getChildMeshes().forEach((childMesh, index) => {
      const childMaterial = new BABYLON.StandardMaterial(
        `childMaterial${index}`
      );
      childMesh.material = childMaterial;
      if (index === 3) {
        const dynamicTexture = new BABYLON.DynamicTexture(
          "DynamicTexture",
          { width: 512, height: 256 },
          scene
        );

        const font = " bold 50px serif";
        const backgroundColor = "white";

        const newTextPosition = {
          y: dynamicTexture.getSize().height / 2 + 20,
        };
        dynamicTexture.drawText(
          "Abrar Muthana Rakea",
          null,
          newTextPosition.y,
          font,
          "#48240a",
          backgroundColor,
          true
        );

        const plane = BABYLON.CreatePlane("", { width: 5, height: 3.3 });
        const planeMaterial = new BABYLON.StandardMaterial("");
        plane.material = planeMaterial;
        plane.position = new BABYLON.Vector3(0, 4, 7.75);
        plane.rotation = new BABYLON.Vector3(0, 0.03, 0);
        planeMaterial.diffuseTexture = dynamicTexture;
        childMaterial.emissiveColor = BABYLON.Color3.Gray();
        planeMaterial.emissiveColor = BABYLON.Color3.Gray();
        plane.receiveShadows = true;
        childMaterial.backFaceCulling = false;
      } else if (index === 0) {
        childMaterial.diffuseTexture = new BABYLON.Texture(
          "https://images.unsplash.com/photo-1602223878762-aff830f9e307?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        );
        childMaterial.emissiveColor = BABYLON.Color3.Black();
      }
    });

    scene.collisionsEnabled = true;
    return scene;
  };

  return (
    <div>
      <canvas ref={canvasRef} className="h-full w-full outline-none" />
    </div>
  );
}
