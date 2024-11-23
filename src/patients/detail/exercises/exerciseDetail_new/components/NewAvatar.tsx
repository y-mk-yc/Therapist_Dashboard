import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SessionData, MovementRecord } from '../DataStructure';

interface Props {
    data: MovementRecord[];
    currentFrame: number;
    parentRef: React.RefObject<HTMLDivElement>;
}

export const NewAvatar: React.FC<Props> = ({ data, currentFrame, parentRef }) => {
    const [showModelState, setShowModelState] = useState(true);
    const [showSkeletonState, setShowSkeletonState] = useState(true);

    const mountRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Group | null>(null); // Keep a reference to the model
    const hipsRef = useRef<THREE.Object3D | undefined>();
    const leftArmRef = useRef<THREE.Object3D | undefined>();
    const leftForeArmRef = useRef<THREE.Object3D | undefined>();
    const rightArmRef = useRef<THREE.Object3D | undefined>();
    const rightForeArmRef = useRef<THREE.Object3D | undefined>();

    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!parentRef.current) return;

        const { height, width } = parentRef.current.getBoundingClientRect();

        const init = () => {
            const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10);
            camera.position.set(0, 1, 3);
            cameraRef.current = camera;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            sceneRef.current = scene;

            const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
            light.position.set(0, 1, 0);
            scene.add(light);

            const modelUrl = '/Xbot.glb';
            const loader = new GLTFLoader();
            loader.load(modelUrl, function (gltf) {
                const model = gltf.scene;
                modelRef.current = model;

                hipsRef.current = model.getObjectByName('mixamorigHips');
                leftArmRef.current = model.getObjectByName('mixamorigLeftArm');
                leftForeArmRef.current = model.getObjectByName('mixamorigLeftForeArm');
                rightArmRef.current = model.getObjectByName('mixamorigRightArm');
                rightForeArmRef.current = model.getObjectByName('mixamorigRightForeArm');

                model.visible = showModelState;
                scene.add(model);

                const skeleton = new THREE.SkeletonHelper(model);
                skeleton.visible = showSkeletonState;
                scene.add(skeleton);

                if (rendererRef.current) {
                    rendererRef.current.render(scene, camera);
                }
            });

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            renderer.outputEncoding = THREE.sRGBEncoding;
            mountRef.current?.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 1, 0);
            controls.update();

            window.addEventListener('resize', () => {
                if (!parentRef.current) {
                    return;
                }
                const { height, width } = parentRef.current.getBoundingClientRect();
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });

            renderer.render(scene, camera);
        };

        init();

        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (mountRef.current) {
                mountRef.current.removeChild(rendererRef.current?.domElement as Node);
            }
        };
    }, [parentRef]);

    // Sync model with the current frame when it updates
    useEffect(() => {
        if (!modelRef.current || !hipsRef.current || !leftArmRef.current || !leftForeArmRef.current || !rightArmRef.current || !rightForeArmRef.current) return;
        if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;

        const currentFrameData = data[currentFrame];
        // Apply rotations based on the current frame data
        // Note that exoskeleton joints are dependent on each other in the following order: SHFE->SFE->SIE->EFE
        // Angle configuration of exoskeleton:
        // - Arm stretched out to the side: SHFE = -90; Arm stretched out to the front: SHFE=0
        // - Arm pointing to the floor: SFE = 0; Arm elevated: SFE=90
        // - Elbow stretched out: EFE = 0; Elbow bent: EFE = 90
        // - 
        // Also note that SIE is applied to elbow because even though it's a shoulder movement the corresponding 
        // exoskeleton joint is located at the elbow

        //if(paretic_side == "right"){}
        leftArmRef.current.rotation.y = -THREE.MathUtils.degToRad(0)-THREE.MathUtils.degToRad(90);  //SHFE
        leftArmRef.current.rotation.z = THREE.MathUtils.degToRad(0)-THREE.MathUtils.degToRad(90); //SFE
        leftForeArmRef.current.rotation.x = THREE.MathUtils.degToRad(0)-THREE.MathUtils.degToRad(90); //SIE
        leftForeArmRef.current.rotation.y = -THREE.MathUtils.degToRad(0); //EFE
        rightArmRef.current.rotation.y = THREE.MathUtils.degToRad(currentFrameData.SHFE)+THREE.MathUtils.degToRad(90); //SHFE
        rightArmRef.current.rotation.z = -THREE.MathUtils.degToRad(currentFrameData.SFE)+THREE.MathUtils.degToRad(90); //SFE
        rightForeArmRef.current.rotation.x = THREE.MathUtils.degToRad(currentFrameData.SIE)-THREE.MathUtils.degToRad(90); //SIE
        rightForeArmRef.current.rotation.y = THREE.MathUtils.degToRad(currentFrameData.EFE); //EFE

        /*else{
          leftArmRef.current.rotation.y = -THREE.MathUtils.degToRad(currentFrameData.SHFE)-THREE.MathUtils.degToRad(90);  //SHFE
          leftArmRef.current.rotation.z = THREE.MathUtils.degToRad(currentFrameData.SFE)-THREE.MathUtils.degToRad(90); //SFE
          leftForeArmRef.current.rotation.x = THREE.MathUtils.degToRad(currentFrameData.SIE)-THREE.MathUtils.degToRad(90); //SIE
          leftForeArmRef.current.rotation.y = -THREE.MathUtils.degToRad(currentFrameData.EFE); //EFE
          rightArmRef.current.rotation.y = THREE.MathUtils.degToRad(0)+THREE.MathUtils.degToRad(90); //SHFE
          rightArmRef.current.rotation.z = -THREE.MathUtils.degToRad(0)+THREE.MathUtils.degToRad(90); //SFE
          rightForeArmRef.current.rotation.x = THREE.MathUtils.degToRad(0)-THREE.MathUtils.degToRad(90); //SIE
          rightForeArmRef.current.rotation.y = THREE.MathUtils.degToRad(0); //EFE
      
        }*/
        
        // Render the updated scene
        rendererRef.current.render(sceneRef.current, cameraRef.current);

    }, [currentFrame, data]);

    return (
        <div className="w-full h-full relative">
            <div ref={mountRef}></div>
            <div className='absolute top-0 right-0' />
        </div>
    );
};
