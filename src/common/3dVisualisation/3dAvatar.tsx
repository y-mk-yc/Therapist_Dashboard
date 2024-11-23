import { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { useParams } from "react-router-dom";
import
{
    useGetPatientsByPatientIdDataQuery,
    MinMaxObject,
    useGetUsermodelByPatientIdQuery,
    ROM
} from "../../store/rehybApi";
import { ArmRanges, } from "./rendering";
import { TimeSlider } from "../../patients/detail/data/common/TimeSlider";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';

const keyOfROM = ['AngleShoulderHFE', 'AngleShoulderAA', 'AngleShoulderFE', 'AngleShoulderIE', 'AngleElbowFE', 'AngleWristPS', 'AngleIndexFE'] as const;

// Your Min and Max Ranges for your arm function
export const getArmRanges: (cutOffDate: Date) => ArmRanges = (cutOffDate) =>
{
    const { patientId } = useParams();
    const { data } = useGetPatientsByPatientIdDataQuery({ PatientID: patientId! });
    const getROMValue = (key: typeof keyOfROM[number]): [number, number] =>
    {
        if (!data?.Physical?.ROM[key] || data?.Physical?.ROM[key].length === 0)
        {
            //no data available
            return [0, 0];
        } else
        {
            //find the last entry before the cut off date
            const entryBeforeCutOffDate = data.Physical.ROM[key].filter((entry) =>
            {
                return new Date(entry.Date) <= cutOffDate;
            });
            if (entryBeforeCutOffDate.length === 0)
            {
                return [0, 0];
            } else
            {
                const lastEntry = entryBeforeCutOffDate.reduce((latest, current) =>
                {
                    const latestDate = new Date(latest.Date);
                    const currentDate = new Date(current.Date);
                    return (currentDate > latestDate) ? current : latest;
                })
                return [Math.floor(lastEntry.Min ?? 0), Math.ceil(lastEntry.Max ?? 0)];
            }

        }
    };
    return {
        SHFE: getROMValue("AngleShoulderHFE"),
        SFE: getROMValue("AngleShoulderFE"),
        EFE: getROMValue("AngleElbowFE"),
        SIE: getROMValue("AngleShoulderIE"),
        // SAA: getROMValue("AngleShoulderAA"),
    };
};

export const getArmRangesGoal = (goal: 'longTerm' | 'shortTerm'): ArmRanges =>
{
    const { patientId } = useParams();
    const { data } = useGetUsermodelByPatientIdQuery({ PatientID: patientId! });
    const ROMdata = goal === 'longTerm'
        ? data?.TherapyGoals?.LongTerm?.Quantification?.Physical?.ROM
        : data?.TherapyGoals?.ShortTerm?.Quantification?.Physical?.ROM;

    return ROMdata ? {
        SHFE: [ROMdata.AngleShoulderHFE?.Min ?? 0, ROMdata.AngleShoulderHFE?.Max ?? 0],
        SFE: [ROMdata.AngleShoulderFE?.Min ?? 0, ROMdata.AngleShoulderFE?.Max ?? 0],
        EFE: [ROMdata.AngleElbowFE?.Min ?? 0, ROMdata.AngleElbowFE?.Max ?? 0],
        SIE: [ROMdata.AngleShoulderIE?.Min ?? 0, ROMdata.AngleShoulderIE?.Max ?? 0],
    } : {
        SHFE: [0, 0],
        SFE: [0, 0],
        EFE: [0, 0],
        SIE: [0, 0],
    };
}
//Gray area represents the theoretical reachable range based on the long-term goal,
// while the green area represents the actual reachable range based on the current ROM data.


const getAllExistingDates = () =>
{
    const { patientId } = useParams();
    const { data } = useGetPatientsByPatientIdDataQuery({ PatientID: patientId! });
    let allDates: string[] = [];

    const romTypes = ["AngleShoulderHFE", "AngleShoulderFE", "AngleElbowFE", "AngleShoulderIE"];

    romTypes.forEach((type) =>
    {
        if (data?.Physical?.ROM?.[type as keyof ROM])
        {
            allDates.push(...data.Physical.ROM[type as keyof ROM].map((entry: MinMaxObject) =>
            {
                const date = new Date(entry.Date);
                date.setHours(23, 59, 59, 999);
                return date.toISOString();
            }));
        }
    });

    // All dates sorted from oldest to newest
    allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Remove duplicates
    return Array.from(new Set(allDates)).map(item => new Date(item));
};

const degToRad = (degrees: number) => degrees * (Math.PI / 180);

function Model(props: { goal: ArmRanges, currentRange: ArmRanges })
{
    // Function to calculate the ranges based on the input data, converting degrees to radians
    const calculateRanges = (range: ArmRanges) => ({
        SHFE: [degToRad(range.SHFE[0]), degToRad(range.SHFE[1])],
        SFE: [degToRad(range.SFE[0]), degToRad(range.SFE[1])],
        SIE: [degToRad(range.SIE[0]), degToRad(range.SIE[1])],
        EFE: [degToRad(range.EFE[0]), degToRad(range.EFE[1])]
    });

    //use memo to avoid unnecessary recalculation
    const currentAngles = useMemo(() => calculateRanges(props.currentRange), [props.currentRange]);
    const goalAngles = useMemo(() => calculateRanges(props.goal), [props.goal]);

    const group = useRef(null);
    const gltf = useGLTF('/PointCloudAvatar.glb');

    // State to hold dynamically calculated arm lengths
    const [armLengths, setArmLengths] = useState<{ l1: number; l2: number } | null>(null); // Initialize as null to detect when it's ready
    const [handPositions, setHandPositions] = useState<THREE.Vector3[]>([]);
    const [goalPositions, setGoalPositions] = useState<THREE.Vector3[]>([]);

    // Function to calculate hand position based on joint angles
    function calculateHandPosition(shoulderWorldPos: THREE.Vector3, horizontalFlexion: number, verticalFlexion: number, shoulderRotation: number, elbowFlexion: number)
    {
        const { l1, l2 } = armLengths!; // Get dynamically calculated arm lengths

        // Create transformation matrices based on joint angles
        const shoulderMatrix = new THREE.Matrix4().makeRotationY(horizontalFlexion - degToRad(90));  // Add 90° offset to transform from exoskeleton coordinate frames to avatar coordinate frames
        const verticalRotationMatrix = new THREE.Matrix4().makeRotationZ(verticalFlexion - degToRad(90));  // Substract 90° offset to transform from exoskeleton coordinate frames to avatar coordinate frames
        shoulderMatrix.multiply(verticalRotationMatrix);
        const rotationMatrix = new THREE.Matrix4().makeRotationX(-shoulderRotation + degToRad(90));  // Invert direction and add 90° offset to transform from exoskeleton coordinate frames to avatar coordinate frames
        shoulderMatrix.multiply(rotationMatrix);

        // Calculate the elbow position relative to the shoulder
        const p_elbow = new THREE.Vector3(l1, 0, 0).applyMatrix4(shoulderMatrix);

        // Elbow Flexion/Extension (Z-axis rotation, keep as is to match avatar)
        const elbowMatrix = new THREE.Matrix4().makeRotationY(elbowFlexion);  // Elbow angles are the same between exoskeleton and avatar
        const p_forearm = new THREE.Vector3(l2, 0, 0).applyMatrix4(elbowMatrix).applyMatrix4(shoulderMatrix);

        // The hand position is relative to the shoulder's world position
        const handPosition = new THREE.Vector3().addVectors(shoulderWorldPos, p_elbow).add(p_forearm);

        return handPosition;
    }

    // Generate hand positions based on joint angle ranges
    function generateHandPositions(shoulderWorldPos: THREE.Vector3, shfe: number[], sfe: number[], sie: number[], efe: number[])
    {
        const positions = [];
        const step = degToRad(20);

        // Use transformed angles based on exoskeleton-coordinate frames mapped to avatar coordinate frames
        for (let horizontalFlexion = shfe[0]; horizontalFlexion <= shfe[1]; horizontalFlexion += step)
        {
            for (let verticalFlexion = sfe[0]; verticalFlexion <= sfe[1]; verticalFlexion += step)
            {
                for (let shoulderRotation = sie[0]; shoulderRotation <= sie[1]; shoulderRotation += step)
                {
                    for (let elbowFlexion = efe[0]; elbowFlexion <= efe[1]; elbowFlexion += step)
                    {
                        positions.push(calculateHandPosition(shoulderWorldPos, horizontalFlexion, verticalFlexion, shoulderRotation, elbowFlexion));
                    }
                }
            }
        }
        return positions;
    }

    // Effect to handle arm length calculation and hand position generation
    useEffect(() =>
    {
        if (gltf.scene)
        {
            const rightShoulder = gltf.scene.getObjectByName('RightArm');
            const leftShoulder = gltf.scene.getObjectByName('LeftArm');
            const rightElbow = gltf.scene.getObjectByName('RightForeArm');
            const rightWrist = gltf.scene.getObjectByName('RightHand');
            const rightFinger = gltf.scene.getObjectByName('RightHandMiddle1');

            if (rightShoulder && leftShoulder)
            {
                // Apply a rotation to the shoulder joints to make the arms hang down
                const armRotation = degToRad(90); // Rotate 90 degrees around the X-axis to bring arms down
                rightShoulder.rotation.x = armRotation;
                leftShoulder.rotation.x = armRotation;
            }

            if (rightShoulder && rightElbow && rightWrist && rightFinger)
            {
                // Get the world position of the shoulder, elbow, and wrist
                const shoulderWorldPos = new THREE.Vector3();
                const elbowWorldPos = new THREE.Vector3();
                const wristWorldPos = new THREE.Vector3();
                const fingerWorldPos = new THREE.Vector3();

                rightShoulder.getWorldPosition(shoulderWorldPos);
                rightElbow.getWorldPosition(elbowWorldPos);
                rightWrist.getWorldPosition(wristWorldPos);
                rightFinger.getWorldPosition(fingerWorldPos);

                // Multiply the positions by 10 to account for the 0.1 scale
                shoulderWorldPos.multiplyScalar(10);
                elbowWorldPos.multiplyScalar(10);
                wristWorldPos.multiplyScalar(10);
                fingerWorldPos.multiplyScalar(10);

                // Calculate the distances between the joints to get arm segment lengths
                const upperArmLength = shoulderWorldPos.distanceTo(elbowWorldPos);
                const forearmLength = elbowWorldPos.distanceTo(wristWorldPos) + wristWorldPos.distanceTo(fingerWorldPos);

                // Update the state with the calculated arm lengths
                setArmLengths({
                    l1: upperArmLength,
                    l2: forearmLength,
                });
            }
        }
    }, [gltf.scene]);

    useFrame(() =>
    {
        if (!(armLengths && gltf.scene)) return;

        const rightShoulder = gltf.scene.getObjectByName('RightArm');
        if (rightShoulder)
        {
            const shoulderWorldPos = new THREE.Vector3();
            rightShoulder.getWorldPosition(shoulderWorldPos);
            shoulderWorldPos.multiplyScalar(10);  // Multiply by 10 to account for the 0.1 scale

            const newROMPositions = generateHandPositions(shoulderWorldPos, currentAngles.SHFE, currentAngles.SFE, currentAngles.SIE, currentAngles.EFE);
            setHandPositions(newROMPositions);

            const newGoalPositions = generateHandPositions(shoulderWorldPos, goalAngles.SHFE, goalAngles.SFE, goalAngles.SIE, goalAngles.EFE);
            function vectorsAreApproxEqual(v1: THREE.Vector3, v2: THREE.Vector3, tolerance = 0.001)
            {
                return v1.distanceTo(v2) < tolerance;
            }
            // Filter out positions that are also contained in newROMPositions
            const filteredGoalPositions = newGoalPositions.filter(goalPos =>
                !newROMPositions.some(romPos => vectorsAreApproxEqual(romPos, goalPos))
            );
            setGoalPositions(filteredGoalPositions); // Store the filtered goal positions in state
        }
    });

    return (
        <group ref={group} dispose={null} scale={[0.1, 0.1, 0.1]}>
            <primitive object={gltf.scene} />
            {handPositions.map((pos, index) => (
                <mesh key={index} position={[pos.x, pos.y, pos.z]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshBasicMaterial
                        color={0x00ff00}
                        transparent={true}
                        opacity={0.3}
                        depthWrite={false}       // Disable depth writing to prevent color accumulation
                        depthTest={true}         // Enable depth testing so objects render in correct order
                        blending={THREE.NormalBlending}
                    />
                </mesh>
            ))}
            {goalPositions.map((pos, index) => (
                <mesh key={`goal-${index}`} position={[pos.x, pos.y, pos.z]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshBasicMaterial
                        color={0x808080} // Grey
                        transparent={true}
                        opacity={0.1} // Slightly higher opacity for visibility
                        depthWrite={false}
                        depthTest={true}
                        blending={THREE.NormalBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}


export const Avatar = () =>
{
    const armRangesGoal = getArmRangesGoal('longTerm');

    const allDates = getAllExistingDates();
    const [selectedDate, setSelectedDate] = useState(0);
    const armRanges = getArmRanges(allDates[selectedDate]);
    const valueText = `${allDates[selectedDate].toLocaleDateString()}`;

    console.log("selectedDate", valueText);
    console.log("armRanges", armRanges);

    return <>
        <div className={'flex gap-2 items-center whitespace-nowrap'}>
            <h3>Reachability visualization</h3>
            <div className={'relative w-full'}>
                <AiOutlineInfoCircle className={'fill-primary cursor-help peer'} />
                <div className={`absolute bg-tertiary whitespace-normal hidden ` +
                    'px-4 py-1 text-text-dark rounded shadow-lg peer-hover:flex ' +
                    `border border-secondary2 `}>
                    The gray area represents the theoretical reachable range based on the long-term goal, while the
                    green area represents the actual reachable range based on the current ROM data.
                </div>
            </div>
        </div>
        <div className={'flex gap-8 flex-col max-w-full'}>
            <TimeSlider
                onChange={(newValue) => setSelectedDate(newValue)}
                value={selectedDate}
                max={allDates.length - 1}
                valueText={valueText}
            />

            <div className='flex-1 aspect-[3/4] rounded'>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 1.5]} fov={10} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.3} intensity={2} castShadow />
                    <Environment preset="sunset" background={false} />
                    <Suspense fallback={<Html>
                        <div>Loading...</div>
                    </Html>}>
                        <Model goal={armRangesGoal} currentRange={armRanges} />
                    </Suspense>
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} target={[0, 0.1, 0]} />
                </Canvas>
            </div>
        </div>
    </>
}