"use client";
import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdArrowDropup,
} from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";

const gallery = [
  {
    id: 1,
    imageUrL: "./Images/FA.png",
    path: "https://3d-project2.vercel.app/",
  },
  {
    id: 2,
    imageUrL: "./Images/tech.png",
    path: "https://www.accommodation.network/",
  },
  {
    id: 3,
    imageUrL: "./Images/market.png",
    path: "https://sweet-praline-474c1a.netlify.app/#home",
  },
  {
    id: 4,
    imageUrL: "./Images/admin.png",
    path: "https://funny-maamoul-5e654c.netlify.app/",
  },
];

const social = [
  {
    id: 1,
    imageUrl:
      "https://image.lexica.art/full_webp/6eb33523-bef3-4d73-bd4c-4852ca78f913",
    link: "abraralrawi99@gmail.com",
    type: "email",
  },
  {
    id: 2,
    imageUrl:
      "https://th.bing.com/th/id/OIP.rIONbwiwOm_V37ef5VAyDwHaFj?rs=1&pid=ImgDetMain",
    link: "https://github.com/abrar997",
    type: "github",
  },
  {
    id: 3,
    imageUrl:
      "https://th.bing.com/th/id/OIP.3hP93aOo5roAzOy5F6loFwHaEK?rs=1&pid=ImgDetMain",
    link: "https://www.linkedin.com/in/abrar-muthana-658027205/",
    type: "linkedin",
  },
];
export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // space to render action
  const sceneRef = useRef<BABYLON.Scene | null>(null); // action
  const engineRef = useRef<BABYLON.Engine | null>(null); //engine for action

  useEffect(() => {
    async function renderSceneFunction() {
      await new Promise((resolve) => setTimeout(resolve, 5000));
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

  const createScene = async () => {
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
      new BABYLON.Vector3(4, 4, 5.8),
      scene
    );
    camera.checkCollisions = true;
    camera.speed = 0.6;
    camera.minZ = 0.01;
    camera.keysUp.push(87);
    camera.keysDown.push(13);
    camera.keysLeft.push(18);
    camera.keysRight.push(15);
    camera.keysUpward.push(12);
    const cameraCanvas = scene.getEngine().getRenderingCanvas(); //connect camera with engine and canvas and scene
    camera.attachControl(cameraCanvas, true); // who control camera direction
    camera.setTarget(new BABYLON.Vector3(2, 3.2, 3.3)); // camera should looks for
    scene.gravity.y = -0.08;
    //camera border
    const x = 14;
    const y = -8;
    const z = 14;

    const FreeCamera = new BABYLON.DeviceOrientationCamera(
      "",
      new BABYLON.Vector3(4, 4, 5.8),
      scene
    );
    FreeCamera.attachControl(scene);
    FreeCamera.setTarget(new BABYLON.Vector3(2, 3.2, 3.3)); // camera should looks for

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

    const moveCamera = (
      direction: "forward" | "backward" | "left" | "right"
    ) => {
      const moveVector = new BABYLON.Vector3(0, 0, 0);
      switch (direction) {
        case "forward":
          moveVector.addInPlace(camera.getDirection(BABYLON.Axis.Z).scale(2));
          break;
        case "backward":
          moveVector.subtractInPlace(
            camera.getDirection(BABYLON.Axis.Z).scale(2)
          );
          break;
        case "left":
          moveVector.subtractInPlace(
            camera.getDirection(BABYLON.Axis.X).scale(2)
          );
          break;
        case "right":
          moveVector.addInPlace(camera.getDirection(BABYLON.Axis.X).scale(2));
          break;
      }
      camera.position.addInPlace(moveVector);
    };

    const setupButtons = () => {
      document
        .getElementById("moveForwardButton")
        ?.addEventListener("click", () => moveCamera("forward"));
      document
        .getElementById("moveBackwardButton")
        ?.addEventListener("click", () => moveCamera("backward"));
      document
        .getElementById("moveLeftButton")
        ?.addEventListener("click", () => moveCamera("left"));
      document
        .getElementById("moveRightButton")
        ?.addEventListener("click", () => moveCamera("right"));
    };
    setupButtons();

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
    groundTexture.diffuseTexture = new BABYLON.Texture(
      "https://images.unsplash.com/photo-1495195129352-aeb325a55b65?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
    ground.checkCollisions = true;
    groundTexture.parallaxScaleBias = 1.2;

    const sofa = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "sofa.glb",
      scene
    );
    sofa.meshes[0].scaling = new BABYLON.Vector3(3.5, 5.2, 3.2);
    sofa.meshes[0].position = new BABYLON.Vector3(-4.2, 0, 0);

    const sofaTable = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "table.glb",
      scene
    );
    sofaTable.meshes[0].position = new BABYLON.Vector3(-4, 0, -0.5);
    sofaTable.meshes[0].position.y = -2;
    sofaTable.meshes[0].scaling = new BABYLON.Vector3(2.8, 2, 2);

    const plantSofaTable = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "plantSofa.glb",
      scene
    );
    plantSofaTable.meshes[0].position = new BABYLON.Vector3(-4, -0.5, -3.5);
    plantSofaTable.meshes[0].scaling = new BABYLON.Vector3(3.2, 3.3, 3.2);

    const border = new BABYLON.HighlightLayer("", scene);
    const highlighterColor = BABYLON.Color3.Green();

    const remote = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "remote.glb",
      scene
    );
    remote.meshes[0].position = new BABYLON.Vector3(-3.5, -0.5, -3.5);
    remote.meshes[0].rotation = new BABYLON.Vector3(0, 0.4, 0);
    remote.meshes[0].scaling = new BABYLON.Vector3(0.002, 0.002, 0.002);
    const remoteMesh = remote.meshes[0].getChildMeshes()[0] as BABYLON.Mesh;
    remote.meshes[0].getChildMeshes()[0].actionManager =
      new BABYLON.ActionManager();

    remote.meshes[0].getChildMeshes()[0].actionManager?.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function () {
          border.addMesh(remoteMesh, highlighterColor);
        }
      )
    );
    remote.meshes[0].getChildMeshes()[0].actionManager?.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function () {
          border.removeMesh(remoteMesh);
        }
      )
    );
    remote.meshes[0].getChildMeshes()[0].actionManager?.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function () {
          if (video.video.paused) {
            video.video.play();
          } else {
            video.video.pause();
          }
        }
      )
    );

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
    tv.meshes[0].position = new BABYLON.Vector3(-4.2, -0.4, -6.5);
    const planeTv = BABYLON.MeshBuilder.CreatePlane(
      "",
      { size: 3.2, height: 1.5 },
      scene
    );
    planeTv.rotation = new BABYLON.Vector3(0, 3.15, 0);
    planeTv.position = new BABYLON.Vector3(-4.15, 1.05, -6.42);
    const planeMaterial = new BABYLON.StandardMaterial("");
    planeTv.material = planeMaterial;
    planeMaterial.backFaceCulling = false;
    const video = new BABYLON.VideoTexture("", "./videos/video.mp4", scene);
    planeMaterial.diffuseTexture = video;
    planeMaterial.emissiveColor = BABYLON.Color3.White();
    video.video.muted = true;

    const resume = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "book.glb",
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

    const light1 = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "light.glb"
    );

    light1.meshes[0].position = new BABYLON.Vector3(-4, 4.6, -9.4);
    light1.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
    light1.meshes[0].scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);
    const light2 = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "light.glb"
    );

    light2.meshes[0].position = new BABYLON.Vector3(6, 4.6, -9.4);
    light2.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
    light2.meshes[0].scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);

    const door = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "door.glb"
    );

    door.meshes[0].position = new BABYLON.Vector3(-7.9, 2.1, 1.5);
    door.meshes[0].scaling = new BABYLON.Vector3(3.6, 3.8, 3.6);

    const shelf = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "shelf.glb"
    );

    shelf.meshes[0].position = new BABYLON.Vector3(7.7, 4.4, 0);
    shelf.meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);

    const office = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "desk2.glb",
      scene
    );
    office.meshes[0].scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
    office.meshes[0].rotation = new BABYLON.Vector3(0, -7.87, 0);
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

        if (index === 0) {
          childMaterial.diffuseColor = BABYLON.Color3.Black();
        } else if (index === 4) {
          const baseTexture = new BABYLON.Texture(item.imageUrl, scene);
          const texture = baseTexture as BABYLON.Texture;
          childMaterial.diffuseTexture = texture;
          texture.uScale = -1;
          texture.vScale = 1;
          childMaterial.emissiveColor = BABYLON.Color3.FromHexString("#fdf4ee");
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

        officeScreen.meshes[0].getChildMeshes()[4].actionManager =
          new BABYLON.ActionManager();

        const screenChild =
          officeScreen.meshes[0].getChildMeshes()[4] as BABYLON.Mesh;

        officeScreen.meshes[0]
          .getChildMeshes()[4]
          .actionManager?.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOverTrigger,
              function () {
                border.addMesh(screenChild, highlighterColor);
              }
            )
          );

        officeScreen.meshes[0]
          .getChildMeshes()[4]
          .actionManager?.registerAction(
            new BABYLON.ExecuteCodeAction(
              BABYLON.ActionManager.OnPointerOutTrigger,
              function () {
                border.removeMesh(screenChild);
              }
            )
          );
      });
      officeScreen.meshes[0].getChildMeshes()[4].actionManager?.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          function () {
            if (item.type === "email") {
              window.location.href = `mailto:${item.link}`;
            } else {
              window.location.href = item.link;
            }
          }
        )
      );
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
    imageFrame.meshes[0].getChildMeshes().forEach((childMesh, index) => {
      const childMaterial = new BABYLON.StandardMaterial(
        `childMaterial${index}`
      );
      childMesh.material = childMaterial;
      if (index === 3) {
        childMaterial.emissiveColor = BABYLON.Color3.White();
        const plane = BABYLON.MeshBuilder.CreatePlane(
          "plane",
          { width: 5, height: 3.3 },
          scene
        );

        const material = new BABYLON.StandardMaterial("planeMaterial", scene);
        const texture = new BABYLON.DynamicTexture(
          "planeTexture",
          { width: 512, height: 256 },
          scene
        );
        plane.material = material;
        material.diffuseTexture = texture;
        material.emissiveColor = BABYLON.Color3.White();
        material.emissiveTexture = new BABYLON.Texture(
          "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D"
        );

        const context2D = texture.getContext();
        context2D.fillStyle = "#fff";
        context2D.stroke;
        context2D.strokeStyle = "teal";
        context2D.strokeRect(2, 3, 4, 5);

        context2D.font = "bold 40px Arial";
        context2D.fillText(
          "Abrar Muthana Rakea",
          50,
          texture.getSize().height / 2
        );
        context2D.font = "28px Arial";
        context2D.fillText(
          "Frontend developer",
          130,
          texture.getSize().height / 2 + 50
        );
        texture.update();
        plane.position = new BABYLON.Vector3(0, 4, 7.75);
        plane.rotation = new BABYLON.Vector3(0, 0.029, 0);
        material.backFaceCulling = true;

        plane.actionManager = new BABYLON.ActionManager();
        plane.actionManager?.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            function () {
              border.addMesh(plane, highlighterColor);
            }
          )
        );
        plane.actionManager?.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            function () {
              border.removeMesh(plane);
            }
          )
        );

        plane.actionManager?.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            function () {
              const fileUrl = "./pdf/resume.pdf";
              const fileName = "resume.pdf";
              const link = document.createElement("a");
              link.href = fileUrl;
              link.download = fileName;
              link.click();
            }
          )
        );
      } else if (index === 0) {
        childMaterial.emissiveColor = BABYLON.Color3.FromHexString("#56422e");
        childMaterial.diffuseColor = BABYLON.Color3.Black();
      }
    });

    imageFrame.meshes[0].getChildMeshes()[0].actionManager =
      new BABYLON.ActionManager();

    const plant = await BABYLON.SceneLoader.ImportMeshAsync(
      null,
      "./Models/",
      "plant2.glb"
    );
    plant.meshes[0].position = new BABYLON.Vector3(6.5, 0, 7);
    plant.meshes[0].position.y = -2;
    plant.meshes[0].scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
    gallery.map(async (item, index) => {
      // wall door frames
      const smallFrames = await BABYLON.SceneLoader.ImportMeshAsync(
        null,
        "./Models/",
        "frame2.glb"
      );
      smallFrames.meshes[0].position = new BABYLON.Vector3(-4.9, 3.1, 4.5);
      smallFrames.meshes[0].rotation = new BABYLON.Vector3(0, 1.55, 0);
      smallFrames.meshes[0].scaling = new BABYLON.Vector3(3, 2, 2);

      smallFrames.meshes[0].getChildMeshes().forEach((childMesh, index) => {
        const childMaterial = new BABYLON.StandardMaterial(
          `childMaterial${index}`
        );
        childMesh.material = childMaterial;

        if (index == 3) {
          const baseTexture = new BABYLON.Texture(item.imageUrL, scene);
          const texture = baseTexture as BABYLON.Texture;
          texture.uScale = -1.53;
          texture.vScale = -1;
          childMaterial.diffuseTexture = texture;
          childMaterial.emissiveColor = BABYLON.Color3.White();
        } else {
          childMaterial.emissiveColor = BABYLON.Color3.FromHexString("#fdf4ee");
          childMaterial.diffuseTexture = new BABYLON.Texture("./Images/w.png");
        }
      });

      if (index === 0) {
        smallFrames.meshes[0].position = new BABYLON.Vector3(-7.5, 4.6, -3.9);
      } else if (index === 1) {
        smallFrames.meshes[0].position = new BABYLON.Vector3(-7.5, 4.6, -2);
      } else if (index === 2) {
        smallFrames.meshes[0].position = new BABYLON.Vector3(-7.5, 2.9, -3.9);
      } else {
        smallFrames.meshes[0].position = new BABYLON.Vector3(-7.5, 2.9, -2);
      }
      smallFrames.meshes[0].getChildMeshes()[3].actionManager =
        new BABYLON.ActionManager();
      const frameMesh =
        smallFrames.meshes[0].getChildMeshes()[3] as BABYLON.Mesh;
      smallFrames.meshes[0].getChildMeshes()[3].actionManager?.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          function () {
            border.addMesh(frameMesh, highlighterColor);
          }
        )
      );
      smallFrames.meshes[0].getChildMeshes()[3].actionManager?.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          function () {
            border.removeMesh(frameMesh);
          }
        )
      );
      smallFrames.meshes[0].getChildMeshes()[3].actionManager?.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          function () {
            window.location.href = item.path;
          }
        )
      );
    });

    scene.collisionsEnabled = true;
    return scene;
  };
  return (
    <div>
      <div>
        <div className="relative h-screen">
          <canvas
            ref={canvasRef}
            className="h-full w-full outline-none touch-none"
          />
          <div className="absolute md:bottom-3 bottom-16 flex left-6 md:left-11 gap-4 items-end uppercase">
            <div className="flex flex-col gap-1 items-center">
              <button
                className="bg-[#83807F] md:text-xl text-xl text-white"
                id="moveForwardButton"
              >
                <IoMdArrowDropup />
              </button>
              <div className="flex gap-1">
                <button
                  className="bg-[#83807F] md:text-xl text-xl text-white"
                  id="moveLeftButton"
                >
                  <IoMdArrowDropleft />
                </button>
                <button
                  className="bg-[#83807F] md:text-xl text-xl text-white"
                  id="moveBackwardButton"
                >
                  <MdOutlineArrowDropDown />
                </button>
                <button
                  id="moveRightButton"
                  className="bg-[#83807F] md:text-xl text-xl text-white"
                >
                  <IoMdArrowDropright />
                </button>
              </div>
              <p className="lg:text-[8px] text-[12px] text-[#83807F]">
                Click to move
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
