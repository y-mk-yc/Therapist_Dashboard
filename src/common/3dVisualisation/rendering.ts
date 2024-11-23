import {MutableRefObject, RefObject} from "react";
import {
    AmbientLight, AxesHelper,
    Color,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Scene,
    SphereGeometry,
    Vector3,
    WebGL1Renderer
} from "three/src/Three";
// @ts-ignore
import modelUrl from "./character-rigged.glb";
import { degToRad } from "three/src/math/MathUtils";
import * as R from "rambda";
import { createWorkerFactory, WorkerCreator } from "@shopify/react-web-worker";

export type Joints = 'SHFE' | 'SFE' | 'EFE' | 'SIE'
// export type Joints = 'SHFE' | 'SFE' | 'EFE' | 'SIE'| 'SAA'

export const shoulderLocation = new Vector3(0.7, 4.8, 0.2)
export const calculateElbowLocation = (sfe: number, shfe: number,) => {
    const ARM_LENGTH = 1
    const shfeRad = degToRad(-shfe - 90)
    const sfeRad = degToRad(sfe + 90)
    const shoulderCopy = (new Vector3()).copy(shoulderLocation)
    return shoulderCopy
        .add(new Vector3(
            Math.sin(shfeRad) * Math.cos(sfeRad) * ARM_LENGTH,
            Math.sin(sfeRad) * ARM_LENGTH,
            Math.cos(shfeRad) * Math.cos(sfeRad) * ARM_LENGTH)
        )
}

export const calculateElbowRotation = (sfeDeg: number, shfeDeg: number) => {
    return {
        xAngle: -sfeDeg,
        yAngle: -shfeDeg - 90,
        zAngle: 0
    }
}

type ArmState = Record<Joints, number>
export const drawPersonAndInit = (canvasRef: RefObject<HTMLCanvasElement>, minMaxRanges: ArmRanges, animationFrameIdRef: MutableRefObject<number | null>) => {
    if (!canvasRef.current) return;
    const { height, width } = canvasRef.current.getBoundingClientRect();

    const scene = new Scene();
    scene.background = new Color(0xF2F4FB); //设置Canvas背景色，与Patient's Data Page的背景色一致
    const camera = new PerspectiveCamera(45, width / height, 0.1, 1000); //设置相机参数
    camera.position.set(0, 10, 10); //设置相机初始位置
    camera.lookAt(new Vector3(0, 0, -5)); //设置相机初始方向
    // camera.
    const renderer = new WebGL1Renderer({ canvas: canvasRef.current });
    renderer.setSize(width, height);


    //这块代码作用是添加鼠标控制，可以通过鼠标控制模型的旋转
    let controls: any = undefined
    import("three/examples/jsm/controls/OrbitControls").then(({ OrbitControls }) => {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new Vector3(0, 3, 0);
        // controls.addEventListener('change', function () {
        //     // 浏览器控制台查看相机位置变化
        //     console.log('camera.position',camera.position);
        // });
    })



    //将人偶模型加载到场景中
    let object: Object3D
    import("three/examples/jsm/loaders/GLTFLoader").then(({ GLTFLoader }) => {
        const loader = new GLTFLoader()
        loader.load(modelUrl, (gltf) => {
            // object.customDepthMaterial = material
            object = gltf.scene
            const newMaterial = new MeshStandardMaterial({ color: 0xffffff }); //设置人偶模型颜色
            object.traverse((o) => {
                // @ts-ignore
                o.material = newMaterial;
            });

            // object.rotateY(Math.PI)
            scene.add(gltf.scene);
        }, undefined, (error) => console.error(error));
    })


    //添加光照，白色光照，强度为1，位置在(0, 2, 20)，在100的范围内有效
    const light = new PointLight(0xffffff, 1, 100);
    light.position.set(0, 2, 20);
    scene.add(light);
    const aLight = new AmbientLight(0xffffff, 0.2); //添加环境光，颜色为白色，强度为0.2
    scene.add(aLight);

    const armRotations: ArmState = { //设置为病人相应ROM的最小值
        SHFE: minMaxRanges.SHFE[0],
        SFE: minMaxRanges.SFE[0],
        EFE: minMaxRanges.EFE[0],
        SIE: minMaxRanges.SIE[0],
    }

    const animate = () => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        if (object) {  //这个if 这里初始化的角度调整暂时没看懂 TODO
            // First, rotate horizontally
            const SHFErad = degToRad(-armRotations.SHFE - 20)
            const SFErad = degToRad(-armRotations.SFE + 90)
            const SIErad = degToRad(-armRotations.SIE)
            object.getObjectByName("upper_armL")!.rotation.set(0, 0, 0)
            object.getObjectByName("upper_armL")!.rotateOnWorldAxis(new Vector3(1, 0, 0), SFErad); // Rotate on the world axis
            object.getObjectByName("upper_armL")!.rotateY(SIErad);// Rotate on the local axis Y of the object
            object.getObjectByName("upper_armL")!.rotateOnWorldAxis(new Vector3(0, 0, 1), SHFErad)

            object.getObjectByName("forearmL")!.setRotationFromAxisAngle(
                new Vector3(0, 0, 1),
                degToRad(-armRotations.EFE + 20)
            )
        }
        controls?.update();
        renderer.render(scene, camera);
    }

    animate();
    return [renderer, camera, scene, armRotations ] as const;
    //整个函数的作用是初始化3D场景，加载人偶模型，设置光照，设置相机，设置鼠标控制，设置动画
}

const sphericalToCart = (azimuthal: number, polar: number, r: number) => {
    const x = Math.sin(degToRad(azimuthal)) * Math.cos(degToRad(polar)) * r
    const z = Math.sin(degToRad(azimuthal)) * Math.sin(degToRad(polar)) * r
    const y = Math.cos(degToRad(azimuthal)) * r
    return { x, y, z }
}

export const clearObjectByName = (scene: Scene, names: string[]) => {
    const toRemove = scene.children.filter(child => names.includes(child.name));
    scene.remove(...toRemove)
}


export const getSpherePointsCoordinates = (
    rotation: { zAngle: number, yAngle: number, xAngle: number },
    r: number,
    rootLocation: Vector3,
    minMaxAzimuthal: [number, number],
    minMaxPolar: [number, number],
    density: number = 10,
    highlightAzimuthal?: [number, number],
    highlightPolar?: [number, number]
) => {
    const anglesAzimuthal = R.range(minMaxAzimuthal[0], minMaxAzimuthal[1] + 1).filter(num => num % density == 0)
    const anglesPolar = R.range(minMaxPolar[0], minMaxPolar[1] + 1).filter(num => num % density == 0)

    const positionsNormal: { position: Vector3, highlighted: boolean }[] = []
    for (const azimuthal of anglesAzimuthal) {
        for (const polar of anglesPolar) {
            const { x, y, z } = sphericalToCart(azimuthal, polar, r)
            const position = new Vector3(x, y, z)
            position.applyAxisAngle(new Vector3(1, 0, 0), degToRad(rotation.xAngle))
            position.applyAxisAngle(new Vector3(0, 1, 0), degToRad(rotation.yAngle))
            position.applyAxisAngle(new Vector3(0, 0, 1), degToRad(rotation.zAngle))
            position.add(rootLocation)


            const highlighted = (highlightPolar && highlightAzimuthal &&
                azimuthal >= highlightAzimuthal[0] &&
                azimuthal <= highlightAzimuthal[1] &&
                polar >= highlightPolar[0] &&
                polar <= highlightPolar[1]) ?? false

            positionsNormal.push({ position, highlighted })
        }
    }
    return positionsNormal
}

export const drawPointsSphere = (
    scene: Scene,
    rootLocation: Vector3,
    rotation: { zAngle: number, yAngle: number, xAngle: number },
    minMaxAzimuthal: [number, number],
    minMaxPolar: [number, number],
    r: number,
    colorReachable: string,
    colorUnreachable: string,
    name: string,
    highlightAzimuthal: [number, number],
    highlightPolar: [number, number],
    opacity: number = 1,
    pointR: number = 0.05,
    density: number = 10,
    drawRoot = true,
) => {
    // const distances = [0.5, 1, 1.5, 2, 2.2]
    const geometry = new SphereGeometry(pointR, 12, 12);
    const material = new MeshBasicMaterial({ color: colorUnreachable, transparent: opacity != 1, opacity: opacity });
    const highlightedMaterial = new MeshBasicMaterial({
        color: colorReachable,
        transparent: opacity != 1,
        opacity: opacity
    });

    getSpherePointsCoordinates(rotation, r, rootLocation, minMaxAzimuthal, minMaxPolar, density, highlightAzimuthal, highlightPolar)
        .forEach(point => {
            const sphere = new Mesh(geometry, point.highlighted ? highlightedMaterial : material);
            sphere.position.copy(point.position)
            sphere.name = name
            scene.add(sphere)
        })

    if (drawRoot) {
        const geometryCenter = new SphereGeometry(0.1, 16, 16);
        const materialCenter = new MeshBasicMaterial({ color: 0xff0000 });
        const sphereCenter = new Mesh(geometryCenter, materialCenter);
        sphereCenter.position.add(rootLocation)
        sphereCenter.name = name
        scene.add(sphereCenter);
    }
}

export const createWorker = createWorkerFactory(() => import('./worker/worker'));

export const ARM_LENGTH = 1.3
export type Range = [number, number]
export type ArmRanges = Record<Joints, Range>
export const drawReachableCubes = async (
    scene: Scene,
    rangesGoal: ArmRanges,
    ranges: ArmRanges,
    name: string,
    worker: ReturnType<WorkerCreator<typeof import('./worker/worker')>>
) => {
    const ACCURACY = 0.4

    const points = await worker.generateReachablePoints(rangesGoal) //这个是根据stateVariables里面的ranges生成的
    const pointsToHighlight = await worker.generateReachablePoints(ranges) //这个是3DAvatar里面的highlight,即worker.generateReachablePoints(exercise.ranges)

    const [reachablePointSet, highlightPointSet] = await Promise.all([
        worker.workerCreatePointStrSet(points, ACCURACY),
        worker.workerCreatePointStrSet(pointsToHighlight, ACCURACY), //这个是3DAvatar里面的highlight,即worker.generateReachablePoints(exercise.ranges)
    ])

    const planeGeometry = new PlaneGeometry(ACCURACY, ACCURACY);
    const planeMaterialGrey = new MeshBasicMaterial({
        color: '#dcdcdc',
        side: DoubleSide,
        transparent: true,
        opacity: 0.4
    })

    const planeMaterialGreen = new MeshBasicMaterial({
        side: DoubleSide,
        color: '#32ff2b',
        transparent: true,
        opacity: 0.6
    })

    for (const point of reachablePointSet) {
        const material = (highlightPointSet.has(point)) ? planeMaterialGreen : planeMaterialGrey
        const coords = point.split(':')

        for (const centerAxis of ['x', 'y', 'z']) {
            for (const offset of [-1, 1]) {
                const plane = new Mesh(planeGeometry, material)

                // Skips inner walls
                // Very risky business here, floats might easily break it
                const neighbourCoors = [
                    +coords[0] + (centerAxis == 'x' ? offset * (ACCURACY) : 0),
                    +coords[1] + (centerAxis == 'y' ? offset * (ACCURACY) : 0),
                    +coords[2] + (centerAxis == 'z' ? offset * (ACCURACY) : 0),
                ].map(e => e.toFixed(2)).join(':')

                const bothHighlight = highlightPointSet.has(point) && highlightPointSet.has(neighbourCoors);
                //此点和邻居点都高亮
                const nextToHighlight = highlightPointSet.has(neighbourCoors);
                //此点的邻居点高亮
                const nextToReachableButNotHighlight = !highlightPointSet.has(point) && reachablePointSet.has(neighbourCoors);
                //高亮的点集没有此点，但是可达点集有此点
                if (bothHighlight || nextToHighlight || nextToReachableButNotHighlight) continue

                if (centerAxis == 'x') {
                    plane.rotateY(Math.PI / 2)
                } else if (centerAxis == 'y') {
                    plane.rotateX(Math.PI / 2)
                }

                plane.position.x = +coords[0] + (centerAxis == 'x' ? offset * (ACCURACY / 2) : 0)
                plane.position.y = +coords[1] + (centerAxis == 'y' ? offset * (ACCURACY / 2) : 0)
                plane.position.z = +coords[2] + (centerAxis == 'z' ? offset * (ACCURACY / 2) : 0)

                plane.name = name
                scene.add(plane)
            }
        }
    }
}

export const getHandLocation = (armState: ArmState) => {
    const elbowLocation = calculateElbowLocation(armState.SFE, armState.SHFE)
    const elbowRotation = calculateElbowRotation(armState.SFE, armState.SHFE)
    const { x, y, z } = sphericalToCart(armState.EFE, armState.SIE, ARM_LENGTH)
    const handPosition = new Vector3(x, y, z)
    handPosition.applyAxisAngle(new Vector3(1, 0, 0), degToRad(elbowRotation.xAngle))
    handPosition.applyAxisAngle(new Vector3(0, 1, 0), degToRad(elbowRotation.yAngle))
    handPosition.applyAxisAngle(new Vector3(0, 0, 1), degToRad(elbowRotation.zAngle))
    handPosition.add(elbowLocation)
    return handPosition
}