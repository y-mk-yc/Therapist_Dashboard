import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GUI from 'lil-gui';
import { Frame, LabeledZone, FrameData } from '../TestData/LabelingDataStructure';
import { findLabeledZoneForCurrentFrame } from './LabeledHuman';


interface Props {
  data: Frame[];
  currentFrame: number;
  parentRef: React.RefObject<HTMLDivElement>
}

export const Avatar: React.FC<Props> = ({ data, currentFrame, parentRef }) => {
  // console.log('avatar:', parentRef.current);//

  // if (!parentRef.current) return null;
  // const { height, width } = parentRef.current.getBoundingClientRect();
/*
  const [showModelState, setShowModelState] = useState(true);
  const [showSkeletonState, setShowSkeletonState] = useState(true);


  const mountRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);

  const currentFrameRef = useRef(currentFrame);
  const dataRef = useRef(data);

  const animateIdRef = useRef<number | null>(null);


  useEffect(() => {
    dataRef.current = data;
    console.log('Avatar data length:', dataRef.current.length);
  }, [data]);


  useEffect(() => {
    currentFrameRef.current = currentFrame;
    console.log('Avatar:', currentFrameRef.current);
  }, [currentFrame]);


  useEffect(() => {


    if (!parentRef.current) return;
    const { height, width } = parentRef.current.getBoundingClientRect();



    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let model: THREE.Group;
    let skeleton: THREE.SkeletonHelper;
    let Hips: THREE.Object3D | undefined;
    let Spine: THREE.Object3D | undefined;
    let leftShoulder: THREE.Object3D | undefined;
    let leftArm: THREE.Object3D | undefined;
    let leftForeArm: THREE.Object3D | undefined;
    let leftHand: THREE.Object3D | undefined;
    let rightArm: THREE.Object3D | undefined;
    let panel: GUI | undefined;
    let currentFrameData: FrameData;



    const init = () => {
      camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
      camera.position.set(0, 1, 3);


      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      light.position.set(0, 1, 0);
      scene.add(light);

      const modelUrl = '/Xbot.glb';

      console.log(modelUrl);

      const loader = new GLTFLoader();
      loader.load(
        // 'https://threejs.org/examples/models/gltf/Xbot.glb',
        modelUrl,

        function (gltf) {
          model = gltf.scene;

          Hips = model.getObjectByName('mixamorigHips');
          Spine = model.getObjectByName('mixamorigSpine');
          leftShoulder = model.getObjectByName('mixamorigLeftShoulder');
          leftArm = model.getObjectByName('mixamorigLeftArm');
          leftForeArm = model.getObjectByName('mixamorigLeftForeArm');
          leftHand = model.getObjectByName('mixamorigLeftHand');

          rightArm = model.getObjectByName('mixamorigRightArm');

          scene.add(model);

          model.visible = showModelState;
          skeleton = new THREE.SkeletonHelper(model);
          skeleton.visible = showSkeletonState;
          scene.add(skeleton);

          if (Hips && Spine && leftShoulder && leftArm && leftForeArm && leftHand) {
            Hips.rotation.order = 'ZXY';
            Spine.rotation.order = 'ZYX';
            leftShoulder.rotation.order = 'XYZ';
            leftArm.rotation.order = 'ZXY';
            leftForeArm.rotation.order = 'ZYX';
          }

        },
        undefined,
        function (error) {
          console.error(error);
        }
      );

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.outputEncoding = THREE.sRGBEncoding;
      mountRef.current?.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1, 0);
      controls.update();
      renderer.render(scene, camera);
    };

    // const onWindowResize = () => {
    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(width, height);
    // };
    const onWindowResize = () => {
      if (parentRef.current) {
        const { height, width } = parentRef.current.getBoundingClientRect();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };


    function degreesToRadians(degrees: number): number {
      return degrees * Math.PI / 180;
    }

    const animate = () => {
      // requestAnimationFrame(animate);



      if (!mountRef.current) {
        return;
      }

      // console.log(animateIdRef.current)
      const animateId = requestAnimationFrame(animate);
      animateIdRef.current = animateId;


      if (dataRef.current && Hips && Spine && leftShoulder && leftArm && leftForeArm && leftHand && rightArm) {

        currentFrameData = dataRef.current[currentFrameRef.current].data;
        console.log(currentFrameRef.current, dataRef.current.length, currentFrameData.shoulder_flex_l)

        Hips.rotation.x = degreesToRadians(-currentFrameData.pelvis_list);
        Hips.rotation.y = degreesToRadians(currentFrameData.pelvis_rotation - 90);
        Hips.rotation.z = degreesToRadians(-currentFrameData.pelvis_tilt);


        Hips.position.x = currentFrameData.pelvis_tx * (-70);
        Hips.position.y = currentFrameData.pelvis_ty * 70;
        Hips.position.z = -8 + currentFrameData.pelvis_tz * (-70);

        Spine.rotation.z = degreesToRadians(currentFrameData.back_tilt);
        Spine.rotation.y = degreesToRadians(currentFrameData.back_list);
        Spine.rotation.x = degreesToRadians(-currentFrameData.back_rotation);
        leftShoulder.rotation.y = degreesToRadians(currentFrameData.clv_rot_l);
        leftShoulder.rotation.z = degreesToRadians(-currentFrameData.clv_lift_l);


        leftArm.rotation.z = degreesToRadians(currentFrameData.shoulder_add_l - 90);
        leftArm.rotation.x = degreesToRadians(-(currentFrameData.shoulder_rot_l));
        leftArm.rotation.y = degreesToRadians(-(currentFrameData.shoulder_flex_l));


        leftForeArm.rotation.y = degreesToRadians(-currentFrameData.elbow_flexion_l);
        leftForeArm.rotation.x = degreesToRadians(currentFrameData.pro_sup_l - 30);
        leftHand.rotation.z = degreesToRadians(-12 + currentFrameData.wrist_flex_l);
        leftHand.rotation.y = degreesToRadians(currentFrameData.wrist_dev_l + 10);

        rightArm.rotation.z = degreesToRadians(75);
      }



      renderer.render(scene, camera);

    };


    const createPanel = (container: HTMLElement) => {

      if (!container) return;

      const panel = new GUI({ container: container });

      const settings = {
        'show model': showModelState,
        'show skeleton': showSkeletonState,
      };

      panel.add(settings, 'show model').onChange(showModel);
      panel.add(settings, 'show skeleton').onChange(showSkeleton);


      return panel;
    };

    const showModel = (visibility: boolean) => {
      if (model) {
        model.visible = visibility;
        setShowModelState(visibility);
      }
    };

    const showSkeleton = (visibility: boolean) => {
      if (skeleton) {
        skeleton.visible = visibility;
        setShowSkeletonState(visibility);
      }
    };


    // if (!parentRef.current) return;
    // const { height, width } = parentRef.current.getBoundingClientRect();


    animateIdRef.current = null;

    if (!guiRef.current) return;
    init();

    panel = createPanel(guiRef.current);
    animate();

    return () => {
      if (renderer) {
        renderer.dispose();
      }
      // console.log(renderer.domElement);

      window.removeEventListener('resize', onWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
      if (panel) {
        panel.destroy();
      }


      if (animateIdRef.current) {
        cancelAnimationFrame(animateIdRef.current);
        console.log(animateIdRef.current, mountRef.current, "cancelAnimationFrame");

        animateIdRef.current = null;
        console.log(animateIdRef.current);
      }

    };
  }, []);

  return <div className="w-full h-full relative" >
    <div ref={mountRef} ></div>
    <div ref={guiRef} className='absolute top-0 right-0'>
    </div>
  </div>;
  */
  return <>Deprecated Avatar</>;
};