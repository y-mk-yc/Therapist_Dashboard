import {
    Exercise, TherapyFocus,
    useGetPatientsByPatientIdDataQuery,
    useGetUsermodelByPatientIdQuery, useGetAllExerciseProtocolsByPatientIdQuery
} from "../../../store/rehybApi";
import {useParams} from "react-router-dom";
import {ReactNode, useState} from "react";
import {Loader} from "../../../common/Loader";
import {SearchBox, searchPredicate} from "../../../common/SearchBox";
import {AiOutlineDrag} from "react-icons/ai";
import {ExerciseCard} from "../../../common/ExerciseCard";
import {createRoot, Root} from "react-dom/client";
import {calculateCondition} from "../overview/CurrentCondition";

let dragImage: HTMLDivElement | null = null;
let dragRoot: Root | null = null;

export const ExerciseList = (props: {
    setDragged: (exercise: Exercise | null) => void,
    recommended: boolean,
    setRecommended: (value: boolean) => void
}) => {
    const {patientId} = useParams();
    const {
        data: usermodel,
        isLoading: isLoadingUM,
        isError: isErrorUM
    } = useGetUsermodelByPatientIdQuery({PatientID: patientId!});
    const {data, isLoading, isError} = useGetAllExerciseProtocolsByPatientIdQuery({
        PatientID: patientId!
    });
    const {
        data: SV,
        isLoading: isLoadingSV,
        isError: isErrorSV
    } = useGetPatientsByPatientIdDataQuery({PatientID: patientId!});

    const [search, setSearch] = useState('');


    // console.log(usermodel, SV)
    if (isLoading || isLoadingUM || isLoadingSV) return <Loader/>
    if (!data || isError || !usermodel || isErrorUM) return <span>Error loading exercises</span>

    const filteredProtocols = data.filter(protocol => {
        const interestTags = Object.entries(protocol.InterestTags)
            .filter(([_, value]) => value)
            .map(([key, _]) => key);
        const therapyFocus = Object.entries(protocol.TherapyFocus)
            .filter(([_, value]) => value)
            .map(([key, _]) => key);
        return searchPredicate(search, protocol.ProtocolName, protocol.ProtocolDescription, ...interestTags, ...therapyFocus);
    });

    const interests = Object.entries(usermodel.Interests!)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

    const interestsFilteredProtocols = filteredProtocols.filter(protocol => {
        const interestTags = Object.entries(protocol.InterestTags)
            .filter(([_, value]) => value)
            .map(([key, _]) => key);
        return interests.some(interest => interestTags.includes(interest));
    });

    let protocols: Exercise[];

    if (!SV || isErrorSV) {
        protocols = props.recommended ? interestsFilteredProtocols : filteredProtocols;
    } else {
        const conditionData = calculateCondition(SV, usermodel, 'longTerm');
        if (conditionData) {
            const {
                shoulderROMAA, shoulderROMFE, shoulderROMIE, shoulderEndurance, shoulderSpasticityAA,
                shoulderSpasticityFE, shoulderSpasticityIE, shoulderStrengthAA, shoulderStrengthFE, shoulderStrengthIE,
                elbowROMFE, elbowEndurance, elbowSpasticityFE, elbowStrengthFE,
                wristROMPS,
                handROMIndexFE, handEndurance, handSpasticity, handStrength,
                shoulderProgress, elbowProgress, wristProgress, handProgress,
                physicalProgress
            } = conditionData;
            const ROMs = [shoulderROMAA, shoulderROMFE, shoulderROMIE, elbowROMFE, wristROMPS, handROMIndexFE].filter(item => item !== undefined);
            const ROM = ROMs.length === 0 ? undefined : (ROMs as number[]).reduce((acc, cur) => acc + cur, 0) / ROMs.length;

            const Strengths = [shoulderStrengthAA, shoulderStrengthFE, shoulderStrengthIE, elbowStrengthFE, handStrength].filter(item => item !== undefined);
            const Strength = Strengths.length === 0 ? undefined : (Strengths as number[]).reduce((acc, cur) => acc + cur, 0) / Strengths.length;

            const Endurances = [shoulderEndurance, elbowEndurance, handEndurance].filter(item => item !== undefined);
            const Endurance = Endurances.length === 0 ? undefined : (Endurances as number[]).reduce((acc, cur) => acc + cur, 0) / Endurances.length;

            const ShoulderAAs = [shoulderROMAA, shoulderSpasticityAA, shoulderStrengthAA, shoulderEndurance].filter(item => item !== undefined);
            const ShoulderAA = ShoulderAAs.length === 0 ? undefined : (ShoulderAAs as number[]).reduce((acc, cur) => acc + cur, 0) / ShoulderAAs.length;

            const ShoulderFEs = [shoulderROMFE, shoulderSpasticityFE, shoulderStrengthFE, shoulderEndurance].filter(item => item !== undefined);
            const ShoulderFE = ShoulderFEs.length === 0 ? undefined : (ShoulderFEs as number[]).reduce((acc, cur) => acc + cur, 0) / ShoulderFEs.length;

            const ShoulderIEs = [shoulderROMIE, shoulderSpasticityIE, shoulderStrengthIE, shoulderEndurance].filter(item => item !== undefined);
            const ShoulderIE = ShoulderIEs.length === 0 ? undefined : (ShoulderIEs as number[]).reduce((acc, cur) => acc + cur, 0) / ShoulderIEs.length;

            const ElbowFE = elbowProgress;

            const WristPS = wristProgress;

            const Indexs = [handROMIndexFE, handEndurance, handSpasticity].filter(item => item !== undefined);
            const Index = Indexs.length === 0 ? undefined : (Indexs as number[]).reduce((acc, cur) => acc + cur, 0) / Indexs.length;
            //关于Index 和 Grasp 的值计算查看StateVariables数据库:handROMIndexFE对应ROM.AngleIndexFE,handStrength对应Strength.RequiredSupportGrip
            const Grasps = [handEndurance, handSpasticity, handStrength].filter(item => item !== undefined);
            const Grasp = Grasps.length === 0 ? undefined : (Grasps as number[]).reduce((acc, cur) => acc + cur, 0) / Grasps.length;

            const sortedFocus = [["ROM", ROM], ["Strength", Strength], ["Endurance", Endurance], ["ShoulderAA", ShoulderAA], ["ShoulderFE", ShoulderFE], ["ShoulderIE", ShoulderIE], ["ElbowFE", ElbowFE], ["WristPS", WristPS], ["Index", Index], ["Grasp", Grasp]]
                .filter(item => item[1] !== undefined).sort((a, b) => (a[1] as number) - (b[1] as number)) as [string, number][];
            // console.log(sortedFocus);

            // 创建一个新数组用于存放排序后的协议
            let sortedProtocols: Exercise[] = [];
            // 遍历sortedFocus数组
            sortedFocus.forEach(focus => {
                // 对于sortedFocus中的每个元素，检查每个协议的TherapyFocus是否包含该元素
                interestsFilteredProtocols.forEach(protocol => {
                    if (protocol.TherapyFocus[focus[0] as keyof TherapyFocus]) {
                        // 如果包含，将该协议添加到sortedProtocols数组中
                        sortedProtocols.push(protocol);
                    }
                });
            });
            // 由于一个协议可能匹配多个focus，需要去重
            sortedProtocols = sortedProtocols.filter((value, index, self) =>
                index === self.findIndex(item => item.ProtocolID === value.ProtocolID)
            );

            protocols = props.recommended ? sortedProtocols : filteredProtocols;
        } else {
            protocols = props.recommended ? interestsFilteredProtocols : filteredProtocols;
        }
    }

    return <>
        <div className='flex gap-4 justify-end'>
            <button onClick={() => props.setRecommended(true)}>
                <span className={`btn-text ${props.recommended ? 'font-semibold' : ''}`}>Recommended</span>
            </button>
            <button onClick={() => props.setRecommended(false)}>
                <span className={`btn-text ${!props.recommended ? 'font-semibold' : ''}`}>All Exercises</span>
            </button>
        </div>
        <SearchBox searchValue={search} setSearchValue={setSearch}/>
        <div className={'flex items-center gap-2'}>
            <AiOutlineDrag className={'flex-none fill-primary h-8 w-8'}/>
            <h3 className={`flex-1`}>Drag to add new exercise</h3>
        </div>
        <div className={'flex @6xl:flex-col gap-2 w-full overflow-y-scroll @6xl:h-screen'}>
            {protocols.length === 0 ? <div>No exercises</div> : protocols.map(
                (protocol, idx) =>
                    <div
                        draggable={true}
                        onDragStart={(event) => {
                            props.setDragged(protocol);
                            let image: ReactNode;
                            if (protocol.Thumbnail) {
                                image = <img className={'rounded w-32 aspect-[4/3]'} src={protocol.Thumbnail}
                                             alt={"Protocol Thumbnail"}/>;
                            } else {
                                image = <div
                                    className={'rounded w-32 aspect-[4/3] bg-primary flex items-center justify-center text-white'}>No
                                    thumbnail</div>;
                            }
                            dragImage = document.createElement('div');
                            dragImage.style.transform = "translate(-10000px, -10000px)";
                            dragImage.style.position = "absolute";
                            document.body.appendChild(dragImage);
                            event.dataTransfer.setDragImage((dragImage as Element), 64, 48);
                            //w-32，即宽度的一半128px/2, 高度的一半96px/2，因为图片的宽高比是4:3
                            dragRoot = createRoot(dragImage);
                            dragRoot.render(image);
                        }}
                        onDragEnd={() => {
                            props.setDragged(null);
                            if (dragImage && dragRoot) { //清除拖动时的图片,卸载dragRoot
                                dragRoot.unmount();
                                document.body.removeChild(dragImage);
                                dragImage = null;
                            }
                        }}
                        key={protocol.ProtocolID ?? idx}>
                        <ExerciseCard exercise={protocol}/>
                    </div>
            )}
        </div>
    </>;
}