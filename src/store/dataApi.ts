import { dataSplitApi as api } from "./emptyApi";
export const addTagTypes = [
    "handData"
] as const;

const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes
    })
    .injectEndpoints({
        endpoints: (build) => ({
            postPatientsHand: build.mutation<PostPatientsHandApiResponse, PostPatientsHandApiArg>({
                query: (queryArg) => ({
                    url: `/data/handSate/${queryArg.PatientID}`,
                    method: "POST",
                    body: queryArg.handCondition,
                }),
                invalidatesTags: ["handData"],
            }
            ),
            putPatientsHand: build.mutation<PutPatientsHandApiResponse, PutPatientsHandApiArg>({
                query: (queryArg) => ({
                    url: `/data/updateHandState/${queryArg.PatientID}`,
                    method: "PUT",
                    body: queryArg.handState,
                }),
                invalidatesTags: ["handData"],
            }
            ),
            getHandUsermodelByPatientId: build.query<
                GetHandUsermodelByPatientIdApiResponse,
                GetHandUsermodelByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/data/userState/${queryArg.PatientID}` }),
                providesTags: ["handData"],
            }),
            getLastestSessionByPatientId: build.query<
                GetLastestSessionByPatientIdApiResponse,
                GetLastestSessionByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/data/jointExecise/latest/${queryArg.PatientID}` }),
                providesTags: ["handData"],
            }),
            getStateOfAJointbyPatientId: build.query<
                GetStateOfAJointByPatientIdApiResponse,
                GetStateOfAJointByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/data/stateOfAJoint/${queryArg.PatientID}/${queryArg.joint}/${queryArg.period}` }),
                providesTags: ["handData"],
            }),


        }),
        overrideExisting: false,
    })


export const {
    useGetHandUsermodelByPatientIdQuery,
    usePostPatientsHandMutation,
    usePutPatientsHandMutation,
    useGetLastestSessionByPatientIdQuery,
    useGetStateOfAJointbyPatientIdQuery
} = injectedRtkApi

export type PostPatientsHandApiResponse = unknown /** status 200  */;
export type PostPatientsHandApiArg = {
    handCondition: HandsCondition;
    PatientID: string;
};

export type PutPatientsHandApiResponse = unknown /** status 200  */;
export type PutPatientsHandApiArg = {
    handState: UserState;
    PatientID: string;
}

export type HandsCondition = {
    affected: string[];
    affectedTime: Date
};
export type GetHandUsermodelByPatientIdApiResponse = UserState;// /** status 200  */ UserState;
export type GetHandUsermodelByPatientIdApiArg = {
    PatientID: string;
};

export type ROM = {
    max?: number; // Optional
    min?: number; // Optional
};

export type JointMovement = {
    movements: Record<string, Record<string, ROM>>;
};

export type MilestoneClass = {
    Right: JointMovement;
    Left: JointMovement;
};

export type UserState = {
    PatientID: string;
    AffectedHand: string[]; // Generic array (can be typed further based on expected structure)
    Milestone: MilestoneClass;
};


export type Range = {
    max?: number;
    min?: number;
};

export type ROMofSession = {
    Yrotation?: Range;
    Xrotation?: Range;
    Zrotation?: Range;
};

export type Joints = {
    Yrotation?: number;
    Xrotation?: number;
    Zrotation?: number;
    rom?: ROMofSession;
    state?: string;
};

export type JointExerciseState = {
    PatientID: string;
    Duration: string;
    // Pain: number;
    Right?: Record<string, Joints>;
    Left?: Record<string, Joints>;
};


export type GetLastestSessionByPatientIdApiResponse = JointExerciseState;// /** status 200  */ UserState;
export type GetLastestSessionByPatientIdApiArg = {
    PatientID: string;
};

export type GetStateOfAJointByPatientIdApiResponse = unknown// /** status 200  */ UserState;
export type GetStateOfAJointByPatientIdApiArg = {
    PatientID: string;
    joint: string,
    period: string
};

export type RomData = {
    time: Date,
    romFE: number,

    romDB: number
}

export type GripStrengthData = {
    time: Date,
    strength: number
}
export type MovementPrecisionData = {
    time: Date,
    spatialDeviation: number,
    completionAccuracy: number,
    trajectoryComparison: number,
    precision: number
}
export type MovementAccuracyData = {
    time: Date,
    accuracy: number,
}
export type MovementSpeedData = {
    time: Date,
    speed: number,
}

export type FingerCoordinationData = {
    time: Date,
    coordination: number,
    //• Average Transition Time: The average time (in seconds) taken to switch between fingers or from one hand to the other during the task. Faster, smoother transitions indicate better coordination.
    ATT: number //Avg Transition Time (s)
    // Transition Variability (CV %): The coefficient of variation of the inter-finger or inter-hand transition times. Lower variability suggests more consistent, coordinated movements.
    TV: number
    //• Coordination Error Count: The number of errors specifically related to coordination (for example, failures to alternate correctly between hands or mis-timed movements) rather than general accuracy errors.
    CEC: number
}

export type FingerIndependenceData = {
    time: Date,
    independence: number,
}
export type DexterityData = {
    time: Date,
    dexterity: number,
}

export type PainData = {
    time: Date,
    severity: number,
    location: number
}





export type HandMetrics = Record<string, HandMetricsData>;

export type HandMetricsData = {
    Rom: RomData[];
    GripStrength: GripStrengthData[];
    // MovementAccuracy: MovementAccuracyData[];
    MovementSpeed: MovementSpeedData[];
    FingerCoordination: FingerCoordinationData[];
    FingerIndependence: FingerIndependenceData[];
    Dexterity: DexterityData[];
    Pain: PainData[];
    Precision: MovementPrecisionData[];
};



export { injectedRtkApi as dataApi };



export const WeekData: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday
    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 40 },
        { time: new Date(2024, 8, 25), strength: 38 },
        { time: new Date(2024, 8, 26), strength: 45 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 50 },
        { time: new Date(2024, 8, 29), strength: 48 },
    ],
    // MovementAccuracy: [
    //     { time: new Date(2024, 8, 23), accuracy: 0.20 },
    //     { time: new Date(2024, 8, 24), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 25), accuracy: 0.42 },
    //     { time: new Date(2024, 8, 26), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 27), accuracy: 0.58 },
    //     { time: new Date(2024, 8, 28), accuracy: 0.54 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],
    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },
    ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]
};


export const MonthData: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday
    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 40 },
        { time: new Date(2024, 8, 25), strength: 38 },
        { time: new Date(2024, 8, 26), strength: 45 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 50 },
        { time: new Date(2024, 8, 29), strength: 48 },
    ],
    // MovementAccuracy: [
    //     { time: new Date(2024, 8, 23), accuracy: 0.20 },
    //     { time: new Date(2024, 8, 24), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 25), accuracy: 0.42 },
    //     { time: new Date(2024, 8, 26), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 27), accuracy: 0.58 },
    //     { time: new Date(2024, 8, 28), accuracy: 0.54 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],
    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },
    ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]
};


export const AllTimeData: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday
    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 40 },
        { time: new Date(2024, 8, 25), strength: 38 },
        { time: new Date(2024, 8, 26), strength: 45 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 50 },
        { time: new Date(2024, 8, 29), strength: 48 },
    ],
    // MovementAccuracy: [{ time: new Date(2024, 8, 23), accuracy: 0.20 },
    // { time: new Date(2024, 8, 24), accuracy: 0.35 },
    // { time: new Date(2024, 8, 25), accuracy: 0.42 },
    // { time: new Date(2024, 8, 26), accuracy: 0.35 },
    // { time: new Date(2024, 8, 27), accuracy: 0.58 },
    // { time: new Date(2024, 8, 28), accuracy: 0.54 },
    // { time: new Date(2024, 8, 29), accuracy: 0.61 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],
    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },
    ],
    // Precision: [
    //     { time: new Date(2024, 8, 23), spatialDeviation: 2, completionAccuracy: 1, trajectoryComparison: 2 },
    //     { time: new Date(2024, 8, 24), spatialDeviation: 1, completionAccuracy: 3, trajectoryComparison: 3 },
    //     { time: new Date(2024, 8, 25), spatialDeviation: 3, completionAccuracy: 3, trajectoryComparison: 1 },
    //     { time: new Date(2024, 8, 26), spatialDeviation: 3, completionAccuracy: 2, trajectoryComparison: 4 },
    //     { time: new Date(2024, 8, 27), spatialDeviation: 4, completionAccuracy: 4, trajectoryComparison: 5 },
    //     { time: new Date(2024, 8, 28), spatialDeviation: 2, completionAccuracy: 4, trajectoryComparison: 4 },
    //     { time: new Date(2024, 8, 29), spatialDeviation: 5, completionAccuracy: 5, trajectoryComparison: 5 },
    // ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]


};

export const WeekDataFinger: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday
    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 30 },
        { time: new Date(2024, 8, 25), strength: 28 },
        { time: new Date(2024, 8, 26), strength: 55 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 60 },
        { time: new Date(2024, 8, 29), strength: 28 },
    ],
    // MovementAccuracy: [
    //     { time: new Date(2024, 8, 23), accuracy: 0.20 },
    //     { time: new Date(2024, 8, 24), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 25), accuracy: 0.42 },
    //     { time: new Date(2024, 8, 26), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 27), accuracy: 0.58 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],

    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },
    ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]
};


export const MonthDataFinger: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday

    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 40 },
        { time: new Date(2024, 8, 25), strength: 38 },
        { time: new Date(2024, 8, 26), strength: 45 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 50 },
        { time: new Date(2024, 8, 29), strength: 48 },
    ],
    // MovementAccuracy: [
    //     { time: new Date(2024, 8, 23), accuracy: 0.20 },
    //     { time: new Date(2024, 8, 24), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 25), accuracy: 0.42 },
    //     { time: new Date(2024, 8, 26), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 27), accuracy: 0.58 },
    //     { time: new Date(2024, 8, 28), accuracy: 0.54 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],
    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },

    ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]
};


export const AllTimeDataFinger: HandMetricsData = {
    Rom: [
        { time: new Date(2024, 8, 23), romFE: 1, romDB: 1 }, // Monday
        { time: new Date(2024, 8, 24), romFE: 2, romDB: 2 }, // Tuesday
        { time: new Date(2024, 8, 25), romFE: 2, romDB: 5 }, // Wednesday
        { time: new Date(2024, 8, 27), romFE: 2, romDB: 1 }, // Friday
        { time: new Date(2024, 8, 28), romFE: 4, romDB: 4 }, // Saturday
        { time: new Date(2024, 8, 29), romFE: 5, romDB: 3 }, // Sunday
    ],
    GripStrength: [
        { time: new Date(2024, 8, 24), strength: 40 },
        { time: new Date(2024, 8, 25), strength: 38 },
        { time: new Date(2024, 8, 26), strength: 45 },
        { time: new Date(2024, 8, 27), strength: 42 },
        { time: new Date(2024, 8, 28), strength: 50 },
        { time: new Date(2024, 8, 29), strength: 48 },
        { time: new Date(2024, 10, 24), strength: 40 },
        { time: new Date(2024, 11, 25), strength: 38 },
    ],
    // MovementAccuracy: [
    //     { time: new Date(2024, 8, 23), accuracy: 0.20 },
    //     { time: new Date(2024, 8, 24), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 25), accuracy: 0.42 },
    //     { time: new Date(2024, 8, 26), accuracy: 0.35 },
    //     { time: new Date(2024, 8, 27), accuracy: 0.58 },
    //     { time: new Date(2024, 8, 28), accuracy: 0.54 },
    //     { time: new Date(2024, 8, 29), accuracy: 0.61 },
    //     { time: new Date(2024, 10, 28), accuracy: 0.74 },
    //     { time: new Date(2024, 11, 29), accuracy: 0.81 },
    // ],
    MovementSpeed: [
        { time: new Date(2024, 9, 30, 8, 30), speed: 45.2 },
        { time: new Date(2024, 9, 1, 9, 15), speed: 47.8 },
        { time: new Date(2024, 9, 2, 10, 45), speed: 50.1 },
        { time: new Date(2024, 9, 3, 11, 20), speed: 48.9 },
        { time: new Date(2024, 9, 4, 12, 0), speed: 51.3 },
        { time: new Date(2024, 9, 5, 14, 10), speed: 53.5 },
        { time: new Date(2024, 9, 6, 16, 30), speed: 55.0 },
    ],
    FingerCoordination: [
        { time: new Date(2024, 8, 23), coordination: 3, ATT: 1.2, TV: 15, CEC: 2 },
        { time: new Date(2024, 8, 24), coordination: 4, ATT: 1.1, TV: 12, CEC: 1 },
        { time: new Date(2024, 8, 25), coordination: 2, ATT: 1.5, TV: 18, CEC: 3 },
        { time: new Date(2024, 8, 26), coordination: 5, ATT: 1.0, TV: 10, CEC: 0 },
        { time: new Date(2024, 8, 27), coordination: 4, ATT: 1.2, TV: 14, CEC: 1 },
        { time: new Date(2024, 8, 28), coordination: 5, ATT: 1.0, TV: 9, CEC: 0 },
        { time: new Date(2024, 8, 29), coordination: 3, ATT: 1.3, TV: 16, CEC: 2 },
    ],
    FingerIndependence: [
        { time: new Date(2024, 8, 23), independence: 3 },
        { time: new Date(2024, 8, 24), independence: 4 },
        { time: new Date(2024, 8, 25), independence: 2 },
        { time: new Date(2024, 8, 26), independence: 5 },
        { time: new Date(2024, 8, 27), independence: 4 },
        { time: new Date(2024, 8, 28), independence: 5 },
        { time: new Date(2024, 8, 29), independence: 3 },
    ],
    Dexterity: [
        { time: new Date(2024, 8, 23), dexterity: 1 },
        { time: new Date(2024, 8, 24), dexterity: 2 },
        { time: new Date(2024, 8, 25), dexterity: 2 },
        { time: new Date(2024, 8, 26), dexterity: 3 },
        { time: new Date(2024, 8, 27), dexterity: 2 },
        { time: new Date(2024, 8, 28), dexterity: 4 },
        { time: new Date(2024, 8, 29), dexterity: 5 },
    ],
    Pain: [
        { time: new Date(2024, 8, 23), severity: 3, location: 1 },
        { time: new Date(2024, 8, 24), severity: 4, location: 2 },
        { time: new Date(2024, 8, 25), severity: 2, location: 3 },
        { time: new Date(2024, 8, 26), severity: 5, location: 4 },
        { time: new Date(2024, 8, 27), severity: 3, location: 5 },
        { time: new Date(2024, 8, 28), severity: 1, location: 6 },
        { time: new Date(2024, 8, 29), severity: 2, location: 7 },
        { time: new Date(2024, 10, 28), severity: 1, location: 6 },
        { time: new Date(2024, 11, 29), severity: 2, location: 7 },
    ],
    Precision: [
        { time: new Date(2024, 8, 23), spatialDeviation: 8.4, completionAccuracy: 60, trajectoryComparison: 70, precision: 1 },
        { time: new Date(2024, 8, 24), spatialDeviation: 7.2, completionAccuracy: 65, trajectoryComparison: 72, precision: 1 },
        { time: new Date(2024, 8, 25), spatialDeviation: 9.5, completionAccuracy: 58, trajectoryComparison: 65, precision: 2 },
        { time: new Date(2024, 8, 26), spatialDeviation: 8.8, completionAccuracy: 62, trajectoryComparison: 75, precision: 1 },
        { time: new Date(2024, 8, 27), spatialDeviation: 10.1, completionAccuracy: 55, trajectoryComparison: 60, precision: 3 },
        { time: new Date(2024, 8, 28), spatialDeviation: 8.3, completionAccuracy: 67, trajectoryComparison: 80, precision: 4 },
        { time: new Date(2024, 8, 29), spatialDeviation: 9.7, completionAccuracy: 50, trajectoryComparison: 55, precision: 2 }
    ]
}
