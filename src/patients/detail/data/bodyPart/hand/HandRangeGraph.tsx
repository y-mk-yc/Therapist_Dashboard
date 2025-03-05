import { ReactNode } from "react";
import { RangeData } from "../../../../../common/graphs/rangeGraph/RangeGraph";
import { RangeGraphWrapper } from "../RangeGraphWrapper";
import { LineChart, Line } from 'recharts';
import LineGraphWrapper from "../LineGraphWrapper";
import { DexterityData, FingerCoordinationData, FingerIndependenceData, GripStrengthData, MovementAccuracyData, MovementPrecisionData, MovementSpeedData, PainData, RomData } from "../../../../../store/dataApi";
import hand_number from './hand_number.png'
export const JointFlexionExtnesion = (props: { data: RangeData, period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    return <RangeGraphWrapper
        title={`${props.title} Flexion/Extension`}
        data={props.data}
        period={props.period}
    />
}

export const JointAdducationAbduction = (props: { data: RangeData, period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    return <RangeGraphWrapper
        title={`${props.title} Adduction/Abduction`}
        data={props.data}
        period={props.period}
    />
}

export const ROM = (props: { data: RomData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent =
        `1 - Joint can only move within 0%-20% of its minimum to maximum range.
2 - Joint can only move within 20%-40% of its minimum to maximum range.
3 - Joint can only move within 40%-60% of its minimum to maximum range.
4 - Joint can only move within 60%-80% of its minimum to maximum range.
5 - Joint can move within 80%-100% of its minimum to maximum range.`;

    return <LineGraphWrapper
        title={`${props.title} Range of Motion(ROM)`}
        data={props.data}
        period={props.period} keys={['romFE', 'romDB']}
        legend={['Flexion/Extension', 'Abduction/Adduction']}
        tip={tipContent} leftYaxis={""} />
}

// Strength of every finger
export const GripStrength = (props: { data: GripStrengthData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent =
        `1 - Unable to hold or squeeze objects. No functional grip strength.
2 - Can hold light objects briefly but struggles with sustained grip or heavier items..
3 - Can grip and hold everyday objects (e.g., a cup, phone) but may have difficulty with firm grips.
4 - Can grip firmly, carry moderate-weight objects, and perform most tasks without struggle.
5 - Excellent grip strength with full control, able to firmly grasp and carry heavy objects with ease.`;
    return <LineGraphWrapper
        title={`${props.title} Grip Strength`}
        data={props.data}
        period={props.period} keys={['strength']} leftYaxis={""}
        tip={tipContent} />
}
export const MovementPrecision = (props: { data: MovementPrecisionData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - Very poor precision. Struggles to perform basic gestures or actions accurately.
    - Gesture-Based: Unable to point, swipe, or make intentional hand signs.
    - Action-Based: Difficulty holding or manipulating objects with control.

2 - Low precision. Can perform simple gestures and actions but with noticeable inaccuracy.
    - Gesture-Based: Can point or swipe but with hesitation or misalignment.
    - Action-Based: Can hold objects but struggles with small, precise movements like buttoning a shirt.

3 - Moderate precision. Can execute common gestures and actions but may lack consistency.
    - Gesture-Based: Can swipe, tap, or perform simple signs with occasional misalignment.
    - Action-Based: Can write, use utensils, or handle tools but with some difficulty in fine movements.

4 - High precision. Can perform most gestures and actions accurately and efficiently.
    - Gesture-Based: Can point, swipe, and make precise gestures with confidence.
    - Action-Based: Can handle small objects, type on a keyboard, or perform detailed tasks with minimal error.

5 - Excellent precision. Full control over gestures and actions, executing with speed and accuracy.
    - Gesture-Based: Can perform complex gestures (e.g., sign language, controlled touchscreen use) with ease.
    - Action-Based: Can perform intricate tasks (e.g., threading a needle, playing a musical instrument) with high accuracy.
`;

    return <LineGraphWrapper
        title={`${props.title} Precision`}
        data={props.data}
        period={props.period} keys={['spatialDeviation', 'completionAccuracy', 'trajectoryComparison', 'precision']}
        height={300}
        rightYaxis="CA(%)/TC(%)"
        leftYaxis="SD(mm)"
        tip={tipContent}
        legend={['Spatial Deviation', 'Completion Accuracy', 'Trajectory Comparison', 'Precision']}
    />
}
// Strength of every finger
// export const MovementAccuracy = (props: { data: MovementAccuracyData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
// {
//     const tipContent = `
// 1 - Very poor accuracy. Significant difficulty in controlling movement, often missing intended targets.
//     - Struggles to reach or touch specific objects.
//     - High degree of unintended movement or tremors.

// 2 - Low accuracy. Can complete basic movements but with noticeable misalignment.
//     - Often overshoots or undershoots targets.
//     - Difficulty performing controlled, steady motions.

// 3 - Moderate accuracy. Can perform most movements with reasonable control.
//     - Can reach and grasp objects with some inconsistency.
//     - Occasionally makes minor errors in direction or force.

// 4 - High accuracy. Can perform precise movements with good consistency.
//     - Reaches and manipulates objects with minimal errors.
//     - Can make smooth, controlled adjustments to movement.

// 5 - Excellent accuracy. Fully controlled, precise, and consistent movement.
//     - Can perform intricate tasks (e.g., threading a needle, precise touchscreen use).
//     - Movements are fluid, targeted, and well-executed.
// `;

//     return <LineGraphWrapper
//         title={`${props.title} Accuracy`}
//         data={props.data}
//         period={props.period} keys={['accuracy']} leftYaxis={""}
//         allowDecimals={true}
//         tip={tipContent} />

// }

export const MovementSpeed = (props: { data: MovementSpeedData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - Very slow. Movement is extremely delayed and sluggish.
    - Takes significant time to start and complete an action.
    - Noticeable hesitation and lack of fluidity.

2 - Slow. Can move but at a reduced speed compared to normal.
    - Actions take longer than expected.
    - Somewhat delayed response in movement initiation.

3 - Moderate speed. Movement is functional but not quick.
    - Can perform everyday tasks at a reasonable pace.
    - Slight delay in reaction time or transition between movements.

4 - Fast. Can move quickly and efficiently with minimal delay.
    - Performs actions smoothly and without noticeable hesitation.
    - Good reaction speed and transition between movements.

5 - Very fast. Highly responsive and rapid movement.
    - Immediate reaction and fluid execution of tasks.
    - Can perform quick, repetitive actions with precision.
`;

    return <LineGraphWrapper
        title={`${props.title} Speed`}
        data={props.data}
        period={props.period} keys={['speed']} leftYaxis={""}
        tip={tipContent} />
}

export const FingerCoordination = (props: { data: FingerCoordinationData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - Very poor coordination. Fingers move awkwardly with minimal control.
    - Struggles to perform even simple finger movements.
    - Frequent unintentional movement or lack of independent finger control.

2 - Low coordination. Can perform basic movements but with noticeable difficulty.
    - Difficulty controlling individual fingers independently.
    - Struggles with fine motor tasks like buttoning a shirt or picking up small objects.

3 - Moderate coordination. Can perform most finger movements but with some effort.
    - Can use fingers independently but may lack smoothness.
    - Occasional mistakes in fine motor tasks (e.g., typing with minor errors).

4 - High coordination. Can control fingers precisely with minimal errors.
    - Moves fingers smoothly and independently.
    - Performs fine motor tasks like playing an instrument or typing efficiently.

5 - Excellent coordination. Highly precise, controlled, and independent finger movement.
    - Can perform intricate tasks requiring fine dexterity.
    - Skilled in activities like fast typing, playing piano, or handling small objects with precision.
`;

    return <LineGraphWrapper
        title={`${props.title} Coordination`}
        data={props.data}
        period={props.period} keys={['coordination']} leftYaxis={"coordination/ATT/CEC"} rightYaxis="TV"
        tip={tipContent}
    />
}

export const FingerIndependence = (props: { data: FingerIndependenceData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - Very poor independence. Fingers move together involuntarily.
    - Struggles to move a single finger without affecting others.
    - Significant difficulty with tasks requiring individual finger control.

2 - Low independence. Can move fingers separately but with noticeable effort.
    - Some unintended movement in adjacent fingers.
    - Struggles with tasks like playing musical notes or touch-typing.

3 - Moderate independence. Can control individual fingers but with some limitations.
    - Can perform everyday tasks that require separate finger movement.
    - May have slight difficulty with precision tasks like playing an instrument or fast typing.

4 - High independence. Fingers move independently with minimal unintended movement.
    - Can perform fine motor tasks that require precise individual finger control.
    - Can play musical instruments at an intermediate level or type accurately.

5 - Excellent independence. Full control over each finger individually.
    - Can perform highly skilled tasks requiring precise individual finger movement.
    - Examples include professional musicianship, sign language fluency, or advanced dexterity tasks.
`;

    return <LineGraphWrapper
        title={`${props.title} Independence`}
        data={props.data}
        period={props.period} keys={['independence']} leftYaxis={"coordination/ATT/CEC"} rightYaxis="TV"
        tip={tipContent}
    />
}

export const Dexterity = (props: { data: DexterityData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - Very poor dexterity. Severe difficulty in manipulating objects.
    - Movements are slow, clumsy, and uncoordinated.
    - Struggles with even basic fine motor tasks like holding a spoon.

2 - Low dexterity. Can handle simple objects but struggles with precision tasks.
    - Noticeable awkwardness and lack of control.
    - Tasks like buttoning a shirt or using a smartphone are difficult.

3 - Moderate dexterity. Can perform most daily tasks but with occasional difficulty.
    - Functional but lacks speed or precision.
    - Can write, type, and use utensils but may experience some clumsiness.

4 - High dexterity. Can manipulate objects with precision and minimal effort.
    - Smooth, controlled, and efficient hand movements.
    - Can perform fine motor tasks like playing an instrument or tying shoelaces effortlessly.

5 - Excellent dexterity. Exceptional speed, precision, and fluidity in movement.
    - Can perform intricate, high-speed, and highly controlled movements.
    - Examples include professional musicianship, surgeons, and expert-level crafting.
`;

    return <LineGraphWrapper
        title={`${props.title} Dexterity`}
        data={props.data}
        period={props.period} keys={['dexterity']} leftYaxis={""}
        tip={tipContent} />
}

export const Pain = (props: { data: PainData[], period: 'Week' | 'Month' | 'AllTime', title: string | null }) =>
{
    const tipContent = `
1 - No pain. No discomfort or limitations in movement.
    - Can perform all activities freely.

2 - Mild pain. Occasional discomfort but does not interfere with function.
    - Can complete tasks but may feel slight strain or irritation.
    - Pain is present but manageable without adjustments.

3 - Moderate pain. Noticeable pain that affects movement.
    - Can still perform most tasks but with some discomfort.
    - May need to pause or adjust movements to avoid worsening pain.

4 - Severe pain. Significant discomfort that limits function.
    - Struggles to complete tasks due to pain.
    - Movement is restricted, and relief is frequently needed.

5 - Extreme pain. Intolerable pain preventing any movement.
    - Even slight movement causes severe pain.
    - Cannot perform any tasks involving the affected area.
`;

    return <>

        <LineGraphWrapper
            title={`${props.title} Pain`}
            data={props.data}
            period={props.period} keys={['severity', 'location']} min={0} max={10} leftYaxis={"Pain"}
            tip={tipContent} />
        <div className="w-full p-12 justify-center items-center">

            <img src={hand_number} alt="User avatar" loading={'lazy'} className="w-full" />
        </div>
    </>
}



