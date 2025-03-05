import { emptySplitApi as api } from "./emptyApi";
import Cookies from 'js-cookie';
import { TherapyGoalsState } from "../patients/detail/overview/TherapyGoals";
import { BodyPart } from "../patients/detail/data/Data";
import
{
    NewSessionData,
    ManualCompensationRecord,
    PredictionCompensationRecord
} from "../patients/detail/exercises/exerciseDetail_new/NewDataStructure";


export const addTagTypes = [
    "me",
    "clinics",
    "therapists",
    "exercise", //protocol and prescription
    "patients",
    "exerciseSessions",
    "usermodels",
    "appointments",
    "caregivers",
    "stateVariables",
] as const; //as const: 类型断言，将数组声明为只读数组，长度固定，元素类型不可变，元素类型为字面量类型

//retrieve the TherapistID from the cookie
export const getTherapistIDFromCookie = () =>
{
    // console.log("result of getting the therapistID:" + Cookies.get('TherapistID'));
    return Cookies.get('TherapistID');
};

export const getIdFromCookie = () =>
{

    // console.log("result of getting the therapistID:" + Cookies.get('_id'));
    return Cookies.get('_id');
};


const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getMe: build.query<GetMeApiResponse, GetMeApiArg>({
                query: () => ({ url: `/TherapistProfiles/me/${getTherapistIDFromCookie()}` }),
                providesTags: ["me"],
            }),
            // postMeLogout: build.mutation<PostMeLogoutApiResponse, PostMeLogoutApiArg>(
            //     {
            //         query: () => ({url: `/me/logout`, method: "POST"}),
            //         invalidatesTags: ["me"],
            //     }
            // ),
            /*getAdminClinics: build.query<
              GetAdminClinicsApiResponse,
              GetAdminClinicsApiArg
            >({
              query: () => ({ url: `/admin/clinics` }),
              providesTags: ["clinics", "therapists"],
            }),
            postAdminClinics: build.mutation<
              PostAdminClinicsApiResponse,
              PostAdminClinicsApiArg
            >({
              query: (queryArg) => ({
                url: `/admin/clinics`,
                method: "POST",
                body: queryArg.adminClinicsBody,
              }),
              invalidatesTags: ["clinics"],
            }),
            deleteAdminClinicsByClinicId: build.mutation<
              DeleteAdminClinicsByClinicIdApiResponse,
              DeleteAdminClinicsByClinicIdApiArg
            >({
              query: (queryArg) => ({
                url: `/admin/clinics/${queryArg.clinicId}`,
                method: "DELETE",
              }),
              invalidatesTags: ["clinics"],
            }),
            postAdminClinicsByClinicIdTherapists: build.mutation<
              PostAdminClinicsByClinicIdTherapistsApiResponse,
              PostAdminClinicsByClinicIdTherapistsApiArg
            >({
              query: (queryArg) => ({
                url: `/admin/clinics/${queryArg.clinicId}/therapists`,
                method: "POST",
                body: queryArg.newTherapist,
              }),
              invalidatesTags: ["therapists"],
            }),
            deleteAdminClinicsByClinicIdTherapistsAndTherapistId: build.mutation<
              DeleteAdminClinicsByClinicIdTherapistsAndTherapistIdApiResponse,
              DeleteAdminClinicsByClinicIdTherapistsAndTherapistIdApiArg
            >({
              query: (queryArg) => ({
                url: `/admin/clinics/${queryArg.clinicId}/therapists/${queryArg.therapistId}`,
                method: "DELETE",
              }),
              invalidatesTags: ["therapists"],
            }),*/
            getExerciseDataByAssessmentIdAndSessionId: build.query<
                GetExerciseDataByAssessmentIdAndSessionIdApiResponse,
                GetExerciseDataByAssessmentIdAndSessionIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/${queryArg.assessmentId}/${queryArg.sessionId}`,
                }),
                providesTags: ["exercise"],
            }),
            postExerciseDataPrediction: build.mutation<
                PostExerciseDataPredictionApiResponse,
                PostExerciseDataPredictionApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/prediction`,
                    method: "POST",
                    body: queryArg.prediction,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataPredictionLocalIntention: build.mutation<
                PostExerciseDataPredictionLocalIntentionApiResponse,
                PostExerciseDataPredictionLocalIntentionApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/prediction/localIntention`,
                    method: "POST",
                    body: queryArg.predictionInquiry,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataSessionInfoPerformance: build.mutation<
                PostExerciseDataSessionInfoPerformanceApiResponse,
                PostExerciseDataSessionInfoPerformanceApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/sessionInfo/performance`,
                    method: "POST",
                    body: queryArg.performanceRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataSessionInfoScore: build.mutation<
                PostExerciseDataSessionInfoScoreApiResponse,
                PostExerciseDataSessionInfoScoreApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/sessionInfo/score`,
                    method: "POST",
                    body: queryArg.scoreRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataTracking: build.mutation<
                PostExerciseDataTrackingApiResponse,
                PostExerciseDataTrackingApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/tracking`,
                    method: "POST",
                    body: queryArg.trackingRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataRgsinfo: build.mutation<
                PostExerciseDataRgsinfoApiResponse,
                PostExerciseDataRgsinfoApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/rgsinfo`,
                    method: "POST",
                    body: queryArg.rgsInfoRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataObjectEventsTargetCreated: build.mutation<
                PostExerciseDataObjectEventsTargetCreatedApiResponse,
                PostExerciseDataObjectEventsTargetCreatedApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/objectEvents/targetCreated`,
                    method: "POST",
                    body: queryArg.targetCreatedRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataObjectEventsTargetUpdated: build.mutation<
                PostExerciseDataObjectEventsTargetUpdatedApiResponse,
                PostExerciseDataObjectEventsTargetUpdatedApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/objectEvents/targetUpdated`,
                    method: "POST",
                    body: queryArg.targetUpdatedRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataEventStart: build.mutation<
                PostExerciseDataEventStartApiResponse,
                PostExerciseDataEventStartApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/event/start`,
                    method: "POST",
                    body: queryArg.startEventRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataEventFinish: build.mutation<
                PostExerciseDataEventFinishApiResponse,
                PostExerciseDataEventFinishApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/event/finish`,
                    method: "POST",
                    body: queryArg.finishEventRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataEventAbort: build.mutation<
                PostExerciseDataEventAbortApiResponse,
                PostExerciseDataEventAbortApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/event/abort`,
                    method: "POST",
                    body: queryArg.abortEventRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            postExerciseDataEventPause: build.mutation<
                PostExerciseDataEventPauseApiResponse,
                PostExerciseDataEventPauseApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/data/event/pause`,
                    method: "POST",
                    body: queryArg.pauseEventRequest,
                }),
                invalidatesTags: ["exercise"],
            }),
            getExerciseSummaryByUserIdAndSessionId: build.query<
                GetExerciseSummaryByUserIdAndSessionIdApiResponse,
                GetExerciseSummaryByUserIdAndSessionIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/exercise/summary/${queryArg.userId}/${queryArg.sessionId}`,
                }),
                providesTags: ["exercise"],
            }),
            postAuthLogin: build.mutation<
                PostAuthLoginApiResponse,
                PostAuthLoginApiArg
            >({
                query: (queryArg) => ({
                    url: `/auth/therapist/login`,
                    method: "POST",
                    //authLoginBody: {
                    //                 Email: email,
                    //                 Password: password
                    //             }
                    body: queryArg.authLoginBody,
                }),
                //在<Login/>组件中，点击Login按钮后，调用onLogin函数，然后调用loginMutation，
                // loginMutation调用postAuthLogin这个mutation，然后调用这个mutation的query函数，发送post请求
                //如果email和password正确，就会返回TherapistID和Token，然后被保存在cookies中
                async onQueryStarted(arg, { queryFulfilled })
                {
                    try
                    {
                        const { data } = await queryFulfilled;
                        const { TherapistID, Token, _id } = data;

                        console.log("here:", { data })
                        console.log("trying to save the data " + data.TherapistID);
                        // Save TherapistID and Token in cookies
                        const expireTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 2); //2 hours

                        Cookies.set('_id', _id, { expires: expireTime });
                        Cookies.set('TherapistID', TherapistID, { expires: expireTime }); //expires: 0.1 means the cookie will expire in 0.1 days
                        Cookies.set('Token', Token, { expires: expireTime });
                    } catch (error)
                    {
                        console.log("Authentication failed, Cookies of Therapist and Token not set", error);
                    }
                },
            }),
            getPatients: build.query<GetPatientsApiResponse, GetPatientsApiArg>({
                query: (queryArg) => ({
                    url: `/PatientProfiles/getPatientsOfOneTherapist/${getTherapistIDFromCookie()}`,
                    params: {
                        sortBy: queryArg.sortBy,
                        asc: queryArg.asc,
                        assigned: queryArg.assigned,
                    },
                }),
                providesTags: ["patients"],
            }),
            ///////////////////Yongzhi's code///////////////////////////////////////////////////////////////////////////

            getTherapistByTherapistID: build.query<GetTherapistByTherapistIdApiResponse, GetTherapistByTherapistIdApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/GetTherapistByTherapistID/${queryArg.therapistId}`,
                }),
                providesTags: ["therapists"],
            }),


            createTherapist: build.mutation<CreateTherapistApiResponse, CreateTherapistApiArg>({
                query: (queryArg) => ({
                    url: `/auth/therapist/register`,
                    method: "POST",
                    body: queryArg,
                }),
                invalidatesTags: ["therapists"],
            }),

            getActivityStatus: build.query<GetActivityStatusResponse, GetActivityStatusArg>({
                query: () => ({ url: `/Usermodels/activityStatus/${getTherapistIDFromCookie()}` }),
                providesTags: ["usermodels"],
            }),
            getAppointmentsByTherapistIdAndDate: build.query<GetAppointmentsByTherapistIdAndDateApiResponse, GetAppointmentsByTherapistIdAndDateApiArg>({
                query: (queryArg) => ({
                    url: `/Appointments/GetAppointmentsByTherapistIdAndDate/${getTherapistIDFromCookie()}`,
                    params: {
                        date: queryArg.StartDate,
                    },
                }),
                providesTags: ["appointments"],
            }),
            //Yingli
            postAppointmentsByTherapistIdAndDate: build.mutation<PostAppointmentsByTherapistIdAndDateApiResponse, PostAppointmentsByTherapistIdAndDateApiArg>({
                query: (queryArg) => ({
                    url: `/Appointments/${getTherapistIDFromCookie()}`,
                    method: "POST",
                    body: queryArg.Appointment
                }),
                invalidatesTags: ["appointments"],
            }),
            DeleteAppointmentsByAppointmentId: build.mutation<DeleteAppointmentsByAppointmentIdApiResponse, DeleteAppointmentsByAppointmentIdApiArg>({
                query: (queryArg) => ({
                    url: `/Appointments/${queryArg.ID}`,
                    method: "DELETE"
                }),
                invalidatesTags: ["appointments"],
            }),
            getOverview: build.query<GetOverviewApiResponse, GetOverviewApiArg>({
                query: () => ({ url: `/TherapistProfiles/GetOverview/${getTherapistIDFromCookie()}` }),
                providesTags: ["usermodels", "therapists", "exerciseSessions"],
            }),
            getActivePatients: build.query<GetPatientsApiResponse, GetPatientsApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/GetActivePatientsProfiles/${getTherapistIDFromCookie()}`,
                    params: {
                        sortBy: queryArg.sortBy,
                        asc: queryArg.asc,
                        assigned: queryArg.assigned,
                    },
                }),
                providesTags: ["patients", "therapists"],
            }),
            getInactivePatients: build.query<GetPatientsApiResponse, GetPatientsApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/GetInactivePatientsProfiles/${getTherapistIDFromCookie()}`,
                    params: {
                        sortBy: queryArg.sortBy,
                        asc: queryArg.asc,
                        assigned: queryArg.assigned,
                    },
                }),
                providesTags: ["patients", "therapists"],
            }),
            addPatientIntoActive: build.mutation<AddPatientIntoActiveApiResponse, AddPatientIntoActiveApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/AddPatientIntoActive/${getTherapistIDFromCookie()}`,
                    method: "POST",
                    body: queryArg,
                }),
                invalidatesTags: ["patients", "therapists", "usermodels"],
            }),

            GetLatestOnlineVariable: build.query<
                GetLatestOnlineVariableApiResponse,
                GetLatestOnlineVariableApiArg
            >({
                query: (queryArg) => ({ url: `/OnlineVariables/lastActivity/${queryArg.PatientID}` }),
                providesTags: ["exerciseSessions"],
            }),
            postPatients: build.mutation<PostPatientsApiResponse, PostPatientsApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/postPatientOfOneTherapist/${getTherapistIDFromCookie()}`,
                    method: "POST",
                    body: queryArg.userInfo,
                }),
                invalidatesTags: ["patients", "usermodels"],
            }
            ),



            updatePatients: build.mutation<UpdatePatientsApiResponse, UpdatePatientsApiArg>(
                {
                    query: (queryArg) => ({
                        url: `/TherapistProfiles/updatePatientOfOneTherapist/${getTherapistIDFromCookie()}`,
                        method: "PUT",
                        body: queryArg.userInfo,
                        params: {
                            PatientID: queryArg.PatientID
                        }
                    }),
                    invalidatesTags: ["patients", "usermodels"],
                }
            ),
            // deletePatientsByPatientId: build.mutation< //TODO:需要看后续需求更改
            //     DeletePatientsByPatientIdApiResponse,
            //     DeletePatientsByPatientIdApiArg
            // >({
            //     query: (queryArg) => ({
            //         url: `/PatientProfiles/deletePatient/${queryArg.patientId}`,
            //         method: "DELETE",
            //     }),
            //     invalidatesTags: ["patients"],
            // }),
            archivePatientsByPatientId: build.mutation<
                ArchivePatientsByPatientIdApiResponse,
                ArchivePatientsByPatientIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/archivePatient/${getTherapistIDFromCookie()}`,
                    method: "PUT",
                    params: {
                        PatientID: queryArg.patientId
                    }
                }),
                invalidatesTags: ["patients", "therapists"],
            }),

            getPatientsByPatientId: build.query<
                GetPatientsByPatientIdApiResponse,
                GetPatientsByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/PatientProfiles/patient/${queryArg.PatientID}` }),
                providesTags: ["patients"],
            }),
            getUsermodelByPatientId: build.query<
                GetUsermodelByPatientIdApiResponse,
                GetUsermodelByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/Usermodels/patientProfile/${queryArg.PatientID}` }),
                providesTags: ["usermodels", "caregivers"],
            }),

            postPatientsByPatientIdContactPerson: build.mutation<
                PostPatientsByPatientIdContactPersonApiResponse,
                PostPatientsByPatientIdContactPersonApiArg
            >({
                query: (queryArg) => ({
                    url: `/PatientProfiles/AddContactPerson/${queryArg.patientId}`,
                    method: "POST",
                    body: queryArg.patientIdContactPersonBody,
                }),
                invalidatesTags: ["patients", "usermodels", "caregivers"],
            }),

            getInactiveCaregivers: build.query<GetInactiveCaregiversApiResponse, GetInactiveCaregiversApiArg>({
                query: (queryArg) => ({
                    url: `/PatientProfiles/GetInactiveCaregivers/${queryArg.PatientID}`,
                    params: {
                        sortBy: queryArg.sortBy,
                    },
                }),
                providesTags: ["caregivers", "patients"],
            }),
            addCaregiverIntoActive: build.mutation<AddCaregiverIntoActiveApiResponse, AddCaregiverIntoActiveApiArg>({
                query: (queryArg) => ({
                    url: `/PatientProfiles/AddCaregiverIntoActive/${queryArg.PatientID}`,
                    method: "PUT",
                    params: {
                        CaregiverID: queryArg.CaregiverID
                    },
                }),
                invalidatesTags: ["caregivers", "patients", "usermodels"],
            }),

            getCaregiverByEmail: build.query<GetCaregiverByEmailApiResponse, GetCaregiverByEmailApiArg>({
                query: (queryArg) => ({
                    url: `/PatientProfiles/GetCaregiverByEmail/${queryArg.patientID}/${queryArg.caregiverEmail}`,
                }),
                providesTags: ["caregivers"],
            }),
            updateContactPersonByPatientId: build.mutation<
                updateContactPersonByPatientIdApiResponse,
                updateContactPersonByPatientIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/PatientProfiles/UpdateContactPerson/${queryArg.patientId}`,
                    method: "PUT",
                    body: queryArg.patientIdContactPersonBody,
                }),
                invalidatesTags: ["caregivers"],
            }),
            removeCaregiverFromActive: build.mutation<RemoveCaregiverFromActiveApiResponse, RemoveCaregiverFromActiveApiArg>({
                query: (queryArg) => ({
                    url: `/PatientProfiles/RemoveCaregiverFromActive/${queryArg.PatientID}`,
                    method: "PUT",
                    params: {
                        CaregiverID: queryArg.CaregiverID
                    },
                }),
                invalidatesTags: ["caregivers", "patients", "usermodels"],
            }),

            getExerciseCompletionRate: build.query<  //获取患者的训练完成率Exercise Completion Rate
                ExerciseCompletionRate,
                getExerciseCompletionRateApiArg
            >({
                query: (queryArg) => ({ url: `/OnlineVariables/trainingStatus/${queryArg.PatientID}` }),
                providesTags: ["exerciseSessions"],
            }),

            getPatientPrescriptions: build.query< //获取患者的训练完成率Exercise Completion Rate
                getPatientPrescriptionsApiResponse,
                getPatientPrescriptionsApiArg
            >({
                //Gets all prescriptions for today
                query: (queryArg) => ({ url: `/Prescriptions/patient_exercises/${queryArg.PatientID}` }),
                providesTags: ["exerciseSessions"],
            }),
            getTodaysExercisesStatus: build.query< //patients-overview-Today's Exercises
                getTodaysExercisesStatusApiResponse,
                getTodaysExercisesStatusApiArg
            >({
                query: (queryArg) => ({ url: `/Prescriptions/GetTodaysExercisesStatus/${queryArg.sessionIDs.join(",")}` }),
                providesTags: ["exerciseSessions", "exercise"],
            }),
            getMoodAssessments: build.query< //patients-overview-Patient mood
                getMoodAssessmentsApiResponse,
                getMoodAssessmentsApiArg
            >({
                query: (queryArg) => ({ url: `/Assessments/MoodAndDate/${queryArg.PatientID}` }),
                providesTags: ["exerciseSessions"],
            }),
            getPatientsByPatientIdExerciseSessions: build.query< //patients-overview-Activity time
                GetPatientsByPatientIdExerciseSessionsApiResponse,
                GetPatientsByPatientIdExerciseSessionsApiArg
            >({
                query: (queryArg) => ({
                    url: `/OnlineVariables/GetAllExerciseSessionsByPatientId/${queryArg.PatientID}`,
                }),
                providesTags: ["exerciseSessions"],
            }),

            getPatientsByPatientIdData: build.query<
                GetPatientsByPatientIdDataApiResponse,
                GetPatientsByPatientIdDataApiArg
            >({
                query: (queryArg) => ({ url: `/StateVariables/GetStateVariablesByPatientID/${queryArg.PatientID}` }),
                providesTags: ["stateVariables"],
            }),

            updateTherapyGoalsByPatientId: build.mutation<
                updateTherapyGoalsByPatientIdApiResponse,
                updateTherapyGoalsByPatientIdApiArg
            >({
                query: (queryArg) =>
                {
                    const { PatientID, ...newbody } = queryArg;
                    return {
                        url: `/Usermodels/updateTherapyGoals/${queryArg.PatientID}`,
                        method: "PUT",
                        body: newbody,
                    }
                },
                invalidatesTags: ["usermodels"],
            }),


            updateNotesByPatientId: build.mutation<
                updateNotesByPatientIdApiResponse,
                updateNotesByPatientIdApiArg
            >({
                query: (queryArg) => ({
                    // url: `/Usermodels/updateNotes/${queryArg.PatientID}`,
                    url: `/Usermodels/updateNotes/${queryArg.PatientID}`,
                    method: "PUT",
                    body: queryArg,
                }),
                invalidatesTags: ["usermodels"],
            }),


            getPrescriptionsAndExerciseSessionsByPatientId: build.query<
                GetPrescriptionsAndExerciseSessionsByPatientIdApiResponse,
                GetPrescriptionsAndExerciseSessionsByPatientIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/Prescriptions/GetPrescriptionsAndExerciseSessionsByPatientId/${queryArg.PatientID}`,
                    params: queryArg.TimeSpan,
                }),
                providesTags: ["exerciseSessions", "exercise"],
            }),


            getAllExerciseProtocols: build.query<
                GetAllExerciseProtocolsApiResponse,
                GetAllExerciseProtocolsApiArg
            >({
                query: (queryArg) => ({ url: `/RehybProtocols/GetAllExerciseProtocols` }),
                providesTags: ["exercise"],
            }),

            getAllExerciseProtocolsByPatientId: build.query<
                GetAllExerciseProtocolsByPatientIdApiResponse,
                GetAllExerciseProtocolsByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/RehybProtocols/GetAllExerciseProtocolsByPatientId/${queryArg.PatientID}` }),
                providesTags: ["exercise"],
            }),

            getDefaultRehybSetupAndFreeToPlayProtocols: build.query<
                GetDefaultRehybSetupAndFreeToPlayProtocolsApiResponse,
                GetDefaultRehybSetupAndFreeToPlayProtocolsApiArg
            >({
                query: (queryArg) => ({ url: `/Usermodels/GetDefaultRehybSetupAndFreeToPlayProtocols/${queryArg.PatientID}` }),
                providesTags: ["usermodels"],
            }),

            updateFreeToPlayProtocolsByPatientId: build.mutation<
                updateFreeToPlayProtocolsByPatientIdApiResponse,
                updateFreeToPlayProtocolsByPatientIdApiArg
            >({
                query: (queryArg) =>
                {
                    const { PatientID, ...newbody } = queryArg;
                    return {
                        url: `/Usermodels/updateFreeToPlayProtocols/${queryArg.PatientID}`,
                        method: "PUT",
                        body: newbody,
                    }
                },
                invalidatesTags: ["usermodels"],
            }),


            updateExercisePlan: build.mutation< //patients-Exercise Plan
                UpdateExercisePlanApiResponse,
                UpdateExercisePlanApiArg
            >({
                query: (queryArg) =>
                {
                    const { PatientID, ...newbody } = queryArg;
                    return {
                        url: `/Prescriptions/UpdateExercisePlan/${queryArg.PatientID}`,
                        method: "POST",
                        body: newbody,
                    }
                },
                invalidatesTags: ["exercise"],
            }),

            postPatientsByPatientIdManualAssessment: build.mutation< //patients-patient's data-Manual Assessment-原本的学生代码，懒得改了:)
                PostPatientsByPatientIdManualAssessmentApiResponse,
                PostPatientsByPatientIdManualAssessmentApiArg
            >({
                query: (queryArg) => ({
                    url: `/StateVariables/manualAssessment/${queryArg.patientId}`,
                    method: "POST",
                    body: queryArg.patientIdManualAssessmentBody,
                }),
                invalidatesTags: ["stateVariables"],
            }),

            deleteOneVariableByPatientIdAndDate: build.mutation<
                DeleteOneVariableByPatientIdAndDateApiResponse,
                DeleteOneVariableByPatientIdAndDateApiArg
            >({
                query: (queryArg) => ({
                    url: `/StateVariables/deleteOneVariable/${queryArg.patientId}`,
                    method: "DELETE",
                    params: {
                        date: queryArg.date,
                        variable: queryArg.variable
                    }
                }),
                invalidatesTags: ["stateVariables"],
            }),

            postManualAssessmentByPatientId: build.mutation< //patients-patient's data-Manual Assessment
                PostManualAssessmentByPatientIdApiResponse,
                PostManualAssessmentByPatientIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/StateVariables/manualAssessmentNew/${queryArg.patientId}`,
                    method: "POST",
                    body: queryArg.body,
                }),
                invalidatesTags: ["stateVariables"],
            }),

            deleteManualAssessmentByPatientIdAndDate: build.mutation<
                DeleteManualAssessmentByPatientIdAndDateApiResponse,
                DeleteManualAssessmentByPatientIdAndDateApiArg
            >({
                query: (queryArg) => ({
                    url: `/StateVariables/deleteOneVariableNew/${queryArg.patientId}`,
                    method: "POST",
                    body: queryArg.body,
                }),
                invalidatesTags: ["stateVariables"],
            }),

            getExerciseSessionDetail: build.query<GetExerciseSessionDetailApiResponse, GetExerciseSessionDetailApiArg>({
                //Exercise Plan-Exercise Session Detail - Yuxuan Zhang's code
                query: (queryArg) => ({
                    url: `/OnlineVariables/GetExerciseSessionDetail/${queryArg.PatientID}`,
                    params: {
                        SessionID: queryArg.SessionID
                    }
                }),
                providesTags: ["exerciseSessions"],
            }),

            skipPlannedPrescription: build.mutation<SkipPlannedPrescriptionApiResponse, SkipPlannedPrescriptionApiArg>({
                query: (queryArg) => ({
                    url: `/TherapistProfiles/SkipPlannedPrescription/${getTherapistIDFromCookie()}`,
                    method: `PUT`,
                }),
                invalidatesTags: ["exerciseSessions", "exercise"],
            }),


            /////////////////////////End of Yongzhi's Code//////////////////////////////////////////////////////////////////

            postPatientsByPatientIdExerciseSessions: build.mutation<
                PostPatientsByPatientIdExerciseSessionsApiResponse,
                PostPatientsByPatientIdExerciseSessionsApiArg
            >({
                query: (queryArg) => ({
                    url: `/patients/${queryArg.patientId}/exerciseSessions`,
                    method: "POST",
                    body: queryArg.patientIdExerciseSessionsBody,
                }),
                invalidatesTags: ["exerciseSessions"],
            }),
            getPatientsByPatientIdExerciseSessionsAndExerciseSessionId: build.query<
                GetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiResponse,
                GetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/patients/${queryArg.PatientID}/exerciseSessions/${queryArg.exerciseSessionId}`,
                }),
                providesTags: ["exerciseSessions"],
            }),
            deletePatientsByPatientIdExerciseSessionsAndExerciseSessionId:
                build.mutation<
                    DeletePatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiResponse,
                    DeletePatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiArg
                >({
                    query: (queryArg) => ({
                        url: `/OnlineVariables/exerciseDelete/${queryArg.PatientID}/${queryArg.SessionID}`,
                        method: "DELETE",
                    }),
                    invalidatesTags: ["exerciseSessions"],
                }),


            // getPatientsAtDate: build.query<GetPatientsAtDateApiResponse, GetPatientsAtDateApiArg>({
            //     query: (date) => ({
            //         url: `/PatientProfiles/PatientsAtDate/${getTherapistIDFromCookie()}`,
            //         params: {
            //             date: date.toISOString().split('T')[0], //将date转换成字符串
            //         },
            //     }),
            //     providesTags: ["patients"],
            // }),


            getOnlineVariableAssessmentByPatientId: build.query<
                GetOnlineVariableAssessmentByPatientIdApiResponse,
                GetOnlineVariableAssessmentByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/Usermodels/patientProfile/${queryArg.PatientID}` }),
                providesTags: ["patients"],
            }),
            getOnlineVariableSessionByPatientId: build.query<
                GetOnlineVariableSessionByPatientIdApiResponse,
                GetOnlineVariableSessionByPatientIdApiArg
            >({
                query: (queryArg) => ({ url: `/OnlineVariables/patient/${queryArg.PatientID}` }),
                providesTags: ["patients"],
            }),
            GetPrescriptionByPrescriptionID: build.query<
                GetPrescriptionByPrescriptionIDApiResponse,
                GetPrescriptionByPrescriptionIDApiArg
            >({
                query: (queryArg) => ({ url: `/Prescriptions/prescriptions_prescription/${queryArg.PrescriptionID}` }),
                providesTags: ["patients"],
            }),

            getRehybProtocols: build.query<
                getRehybProtocolsApiResponse,
                getRehybProtocolsApiArg
            >({
                query: (queryArg) => ({ url: `/RehybProtocols/RehybProtocols/${queryArg.ProtocolID}` }),
                providesTags: ["patients"],
            }),


            getPatientAllPrescriptions: build.query<
                Prescription,
                getPatientPrescriptionsApiArg
            >({
                //gets all time prescriptions of patient
                query: (queryArg) => ({ url: `/Prescriptions/patient_exercises_all/${queryArg.PatientID}` }),
                providesTags: ["patients"],
            }),
            PostProtocolsBasedOnInterest: build.mutation<
                PostProtocolsBasedOnInterestResponse,
                PostProtocolsBasedOnInterestArg
            >({
                query: (queryArg) => ({
                    url: `/RehybProtocols/interest_matching_list`,
                    method: "POST",
                    body: queryArg.InterestTags,
                }),
                invalidatesTags: ["patients"],
            }),

            GetAllThePatientsAndCaregivers: build.query<
                GetAllThePatientsAndCaregiversResponse,
                GetAllThePatientsAndCaregiversArg>({
                    query: (queryArg) => ({
                        url: `/TherapistProfiles/getAllThePatientsAndCaregivers/${queryArg.TherapistID}`,
                    }),
                    providesTags: ["patients"],

                })

        }),
        overrideExisting: false,
    });
export { injectedRtkApi as rehybApi };
export type GetMeApiResponse = /** status 200  */ UserDocument;

export type UserDocument = {
    Name: string;
    Email: string;
    Password: string;
    Phone: string;
    Picture: string;
    ActivePatients: string[];
    ArchivedPatients: string[];
    TherapistID: string;
    ClinicID: string;
};

export type GetMeApiArg = void;
// export type PostMeLogoutApiResponse = unknown;
// export type PostMeLogoutApiArg = void;
/*export type GetAdminClinicsApiResponse =
  // status 200   
  InlineResponse2001[];
export type GetAdminClinicsApiArg = void;
export type PostAdminClinicsApiResponse = unknown;
export type PostAdminClinicsApiArg = {
  adminClinicsBody: AdminClinicsBody;
};
export type DeleteAdminClinicsByClinicIdApiResponse = unknown;
export type DeleteAdminClinicsByClinicIdApiArg = {
  clinicId: number;
};
export type PostAdminClinicsByClinicIdTherapistsApiResponse = unknown;
export type PostAdminClinicsByClinicIdTherapistsApiArg = {
  clinicId: number;
  newTherapist: NewTherapist;
};
export type DeleteAdminClinicsByClinicIdTherapistsAndTherapistIdApiResponse =
  unknown;
export type DeleteAdminClinicsByClinicIdTherapistsAndTherapistIdApiArg = {
  clinicId: number;
  therapistId: number;
};*/
// export type GetPatientsAtDateApiArg = Date;
// export type GetPatientsAtDateApiResponse = /** status 200  */ InlineResponse2004;

export type GetExerciseDataByAssessmentIdAndSessionIdApiResponse =
/** status 200 OK */ AssessmentSessionResponse;
export type GetExerciseDataByAssessmentIdAndSessionIdApiArg = {
    assessmentId: string;
    sessionId: string;
};
export type PostExerciseDataPredictionApiResponse = unknown;
export type PostExerciseDataPredictionApiArg = {
    prediction: Prediction;
};
export type PostExerciseDataPredictionLocalIntentionApiResponse =
/** status 200 OK */ InlineResponse2002;
export type PostExerciseDataPredictionLocalIntentionApiArg = {
    predictionInquiry: PredictionInquiry;
};
export type PostExerciseDataSessionInfoPerformanceApiResponse = unknown;
export type PostExerciseDataSessionInfoPerformanceApiArg = {
    performanceRequest: PerformanceRequest;
};
export type PostExerciseDataSessionInfoScoreApiResponse = unknown;
export type PostExerciseDataSessionInfoScoreApiArg = {
    scoreRequest: ScoreRequest;
};
export type PostExerciseDataTrackingApiResponse = unknown;
export type PostExerciseDataTrackingApiArg = {
    trackingRequest: TrackingRequest;
};
export type PostExerciseDataRgsinfoApiResponse = unknown;
export type PostExerciseDataRgsinfoApiArg = {
    rgsInfoRequest: RgsInfoRequest;
};
export type PostExerciseDataObjectEventsTargetCreatedApiResponse = unknown;
export type PostExerciseDataObjectEventsTargetCreatedApiArg = {
    targetCreatedRequest: TargetCreatedRequest;
};
export type PostExerciseDataObjectEventsTargetUpdatedApiResponse = unknown;
export type PostExerciseDataObjectEventsTargetUpdatedApiArg = {
    targetUpdatedRequest: TargetUpdatedRequest;
};
export type PostExerciseDataEventStartApiResponse = unknown;
export type PostExerciseDataEventStartApiArg = {
    startEventRequest: StartEventRequest;
};
export type PostExerciseDataEventFinishApiResponse = unknown;
export type PostExerciseDataEventFinishApiArg = {
    finishEventRequest: FinishEventRequest;
};
export type PostExerciseDataEventAbortApiResponse = unknown;
export type PostExerciseDataEventAbortApiArg = {
    abortEventRequest: AbortEventRequest;
};
export type PostExerciseDataEventPauseApiResponse = unknown;
export type PostExerciseDataEventPauseApiArg = {
    pauseEventRequest: PauseEventRequest;
};
export type GetExerciseSummaryByUserIdAndSessionIdApiResponse =
/** status 200 OK */ ExerciseSummaryResponse;
export type GetExerciseSummaryByUserIdAndSessionIdApiArg = {
    /** User ID */
    userId: string;
    /** Session ID */
    sessionId: string;
};
export type PostAuthLoginApiResponse = {
    /** status 200 If login succeeds */
    _id: string,
    TherapistID: string;
    Token: string;
}
export type PostAuthLoginApiArg = {
    authLoginBody: AuthLoginBody;
};
export type GetPatientsApiResponse = /** status 200  */ Patient[];
export type GetPatientsApiArg = {
    sortBy: "Name" | "lastTraining" | "ActivityStatus";
    asc: boolean;
    assigned: boolean;
};


export type PostPatientsApiResponse = {
    PatientID: string
} ///** status 200  */ Patient;
export type PostPatientsApiArg = {
    userInfo: UserInfo;
};



export type UpdatePatientsApiResponse = /** status 200  */ Patient;
export type UpdatePatientsApiArg = {
    PatientID: string;
    userInfo: UserInfo;
};

export type GetPatientsByPatientIdApiResponse = /** status 200  */ Patient;
export type GetPatientsByPatientIdApiArg = {
    PatientID: string;
};
export type GetUsermodelByPatientIdApiResponse = /** status 200  */ UserModel;
export type GetUsermodelByPatientIdApiArg = {
    PatientID: string;
};



export type GetOnlineVariableAssessmentByPatientIdApiResponse = /** status 200  */ OnlineVariableAssessment;
export type GetOnlineVariableAssessmentByPatientIdApiArg = {
    PatientID: string;
};
export type GetOnlineVariableSessionByPatientIdApiResponse = /** status 200  */ OnlineVariableSession;
export type GetOnlineVariableSessionByPatientIdApiArg = {
    PatientID: string;
};
export type GetPrescriptionByPrescriptionIDApiResponse = Prescription;
export type GetPrescriptionByPrescriptionIDApiArg = {
    PrescriptionID: string;
}


export type DeletePatientsByPatientIdApiResponse = unknown;
export type DeletePatientsByPatientIdApiArg = {
    patientId: string;
};
export type ArchivePatientsByPatientIdApiResponse = unknown;
export type ArchivePatientsByPatientIdApiArg = {
    patientId: string;
};
export type GetPatientsByPatientIdDataApiResponse =
/** status 200  */ StateVariable;
export type GetPatientsByPatientIdDataApiArg = {
    PatientID: string;
};

export type getExerciseCompletionRateApiResponse = {
    week: ExerciseStatusCounts;
    month: ExerciseStatusCounts;
    allTime: ExerciseStatusCounts;
}
export type getExerciseCompletionRateApiArg = {
    PatientID: string;
}
export type ExerciseCompletionRate = {
    week: ExerciseStatusCounts;
    month: ExerciseStatusCounts;
    allTime: ExerciseStatusCounts;
};
export type ExerciseStatusCounts = {
    Finished: number;
    Unfinished: number;
    Skipped: number;
    Planned: number;
    total: number;
};
export type getRehybProtocolsApiResponse = {
    ProtocolDocument: ProtocolDocument;
}
export type getRehybProtocolsApiArg = {
    ProtocolID: string;
}
export type ProtocolDocument = {
    _id: string;
    ProtocolID: string;
    ProtocolName: string;
    ProtocolDescription: string;
    TherapyFocus: {
        ROM: boolean;
        Strength: boolean;
        Endurance: boolean;
        ShoulderAA: boolean;
        ShoulderFE: boolean;
        ShoulderIE: boolean;
        ElbowFE: boolean;
        WristPS: boolean;
        Index: boolean;
    };
    InterestTags: InterestTags
    Thumbnail: string;
};

export type Prescription = { //已检查
    PrescriptionID: string;
    Date: string; // ISO Date String
    PatientID: string;
    ProtocolID: string;
    SessionID: string;
    Duration: number; // Assuming this is in minutes
    Difficulty: number; // Assuming this is a numeric scale
    ReHybSetup: string;
    ToDelete?: boolean;
    //Status: 'Skipped' | 'Completed' | 'Planned' | 'In Progress'; // Add other possible statuses if necessary
};
export type EditablePrescription = Prescription & {
    Editable: boolean;
}
export type getPatientPrescriptionsApiArg = {
    PatientID: string;
}
export type getPatientPrescriptionsApiResponse = string[];

export type getMoodAssessmentsApiResponse = { //patients-overview-Patient mood
    moodAll: MoodData; //[{Mood: string, Date: string}]
    moodInSevenDays: MoodData;
}
export type getMoodAssessmentsApiArg = { //patients-overview-Patient mood
    PatientID: string;
}
export type GetLatestOnlineVariableApiResponse = {
    PatientID: string,
    SessionID: string,
    Status: "Finished" | "Unfinished" | "Skipped" | "Planned",
    Date: string
} | { Message: string };
export type GetLatestOnlineVariableApiArg = {
    PatientID: string;
}

export type GetPatientsByPatientIdExerciseSessionsApiResponse =
/** status 200  */ OnlineVariableSession[];
export type GetPatientsByPatientIdExerciseSessionsApiArg = {
    PatientID: string;
};
export type PostPatientsByPatientIdExerciseSessionsApiResponse = unknown;
export type PostPatientsByPatientIdExerciseSessionsApiArg = {
    patientId: string;
    patientIdExerciseSessionsBody: PatientIdExerciseSessionsBody;
};
export type GetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiResponse =
/** status 200  */ ExerciseSessionDetail;
export type GetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiArg = {
    PatientID: string;
    exerciseSessionId: string;
};
export type DeletePatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiResponse =
    unknown;
export type DeletePatientsByPatientIdExerciseSessionsAndExerciseSessionIdApiArg =
    {
        PatientID: string;
        SessionID: string;
    };

export type GetOverviewApiResponse = /** status 200  */ InlineResponse2004;
export type GetOverviewApiArg = void;
export type GetActivityStatusResponse = /** status 200  */ ActivityStatusRes;
export type GetActivityStatusArg = void;

export type ActivityStatusRes = {
    Online: number;
    Exercising: number;
    Offline: number;
}

export type PostProtocolsBasedOnInterestResponse = /** status 200  */ RehybProtocol[];
export type PostProtocolsBasedOnInterestArg = { InterestTags: InterestTags; };

export type InterestTags = { //已检查
    Sports: boolean,
    Cooking: boolean,
    Household: boolean,
    Gardening: boolean,
    ADL: boolean,
    Nature: boolean,
    Competition: boolean,
    Other: boolean
};

export type RehybProtocol = {
    ProtocolID: string;
    ProtocolName: string;
    ProtocolDescription: string;
    TherapyFocus: TherapyFocus;
    InterestTags: InterestTags;
    Thumbnail: string;
};

/*
export type Admin = {
  id: number;
};
*/

export type Therapist = {
    name: string;
    id: number;
    role: string;
};


export type InlineResponse200 =
    | {
        Therapist?: Therapist;
    };/*
  | {
      //Admin: Admin;
    };*/
export type InlineResponse2001 = {
    name: string;
    id: number;
    therapists: Therapist[];
};
/*
export type AdminClinicsBody = {
  name: string;
};*/
export type NewTherapist = {
    email?: string;
    name: string;
    password: string;
    phoneNumber?: string;
};
export type AssessmentSessionResponseRangeOfMotionAngleSaa = {
    max?: number;
    min?: number;
};
export type AssessmentSessionResponseRangeOfMotion = {
    angleSaa?: AssessmentSessionResponseRangeOfMotionAngleSaa;
    angleSfe?: AssessmentSessionResponseRangeOfMotionAngleSaa;
    angleSie?: AssessmentSessionResponseRangeOfMotionAngleSaa;
    angleEfe?: AssessmentSessionResponseRangeOfMotionAngleSaa;
    angleWps?: AssessmentSessionResponseRangeOfMotionAngleSaa;
    angleImcpfe?: AssessmentSessionResponseRangeOfMotionAngleSaa;
};
export type AssessmentSessionResponse = {
    t?: string;
    rangeOfMotion?: AssessmentSessionResponseRangeOfMotion;
    duration?: number;
    difficulty?: number;
};
export type Prediction = {
    sessionID?: string;
    timestamp?: string;
    localIntention?: number[];
    spasticity?: boolean;
    muscleFatigue?: number;
    congnitiveFatigue?: number;
    movementCompensation?: number;
    pain?: boolean;
    mood?: string;
};
export type LocalIntentionLocalIntention = {
    value?: number[];
    timestamp?: string;
};
export type LocalIntention = {
    LocalIntention?: LocalIntentionLocalIntention;
};
export type LocalIntentionItem = {
    value?: number[];
    timestamp?: string;
};
export type LocalIntentionHistory = {
    LocalIntentionHistory?: LocalIntentionItem[];
};
export type InlineResponse2002 = LocalIntention | LocalIntentionHistory;
export type PredictionInquiry = {
    sessionID?: string;
    latest?: boolean;
};
export type PerformanceRequest = {
    sessionID?: string;
    t?: string;
    congnitivePerformance?: number;
    motorPerformance?: number;
};
export type ScoreRequest = {
    sessionID?: string;
    totalScore?: number;
    achievedScore?: number;
    maxScore?: number;
};
export type TrackingRequest = {
    t?: string;
    sessionID?: string;
    vpDoF?: number;
    hdpDoF?: number;
    hmpDoF?: number;
    hppDoF?: number;
    angleSaa?: number;
    angleSfe?: number;
    angleSie?: number;
    angleEfe?: number;
    angleWps?: number;
    angleImcpfe?: number;
    uTorqueSaa?: number;
    uTorqueSfe?: number;
    uTorqueSie?: number;
    uTorqueEfe?: number;
    uTorqueWps?: number;
    uTorqueImcpfe?: number;
    supportSaa?: number;
    supportSfe?: number;
    supportSie?: number;
    supportEfe?: number;
    supportWps?: number;
    supportImcpfe?: number;
    fesSupport?: number;
};
export type RgsInfoRequest = {
    sessionID?: string;
    rgsVersion?: string;
    rgsMode?: string;
    ircVersion?: string;
    logFileSpecificationVersion?: string;
    protocolID?: string;
    sessionDate?: string;
    localSessionTime?: string;
    timeZone?: string;
};
export type TargetCreatedRequest = {
    sessionID?: string;
    t?: string;
    id?: number;
    X?: number;
    Y?: number;
    Z?: number;
};
export type TargetUpdatedRequest = {
    sessionID?: string;
    t?: string;
    id?: number;
    isMissed?: boolean;
    angleSfe?: number;
    angleSaa?: number;
    angleSie?: number;
    angleEfe?: number;
    angleWps?: number;
    angleImcpfe?: number;
};
export type StartEventRequest = {
    sessionID?: string;
    t?: string;
};
export type FinishEventRequest = {
    sessionID?: string;
    t?: string;
};
export type AbortEventRequest = {
    sessionID?: string;
    t?: string;
    reason?: string;
};
export type PauseEventRequest = {
    sessionID?: string;
    timestampStart?: string;
    timestampEnd?: string;
};
export type ExerciseSummaryResponse = {
    startTime?: string;
    endTime?: string;
    status?: string;
    reason?: string;
    duration?: number;
    achievedScore?: number;
    maxScore?: number;
    highScore?: number;
};
export type AuthLoginBody = {
    Email: string;
    Password: string;
};
export type NewWeightMeasurement = {
    weight: number;
};
export type WeightMeasurement = NewWeightMeasurement & {
    date: string;
};
export type CognitiveMeasurementCognitiveImpairmentAssessment = {
    date?: string;
    value?: number;
};
export type CognitiveMeasurement = {
    cognitiveImpairmentAssessment: CognitiveMeasurementCognitiveImpairmentAssessment[];
    timeToFatigue: CognitiveMeasurementCognitiveImpairmentAssessment[];
    neglect: CognitiveMeasurementCognitiveImpairmentAssessment[];
    aphasia: CognitiveMeasurementCognitiveImpairmentAssessment[];
};
export type BasePatientPhysicalLevelHistory = {
    shoulder: number;
    elbow: number;
    wrist: number;
    hand: number;
};
export type BasePatientGoals = {
    shortTerm: string;
    longTerm: string;
    focus: string[];
};
export type NewAdlHistory = {
    total: number;
    hand: number;
    wrist: number;
    elbow: number;
    shoulder: number;
};
export type AdlHistory = {
    value: NewAdlHistory;
    timestamp: string;
};
export type BasePatient = {
    PatientID: String,
    Name: String,
    Email: string;
    Gender: string;
    Birthday: string;
    Height: number;
    Image: string;
    weightHistory: WeightMeasurement[];
    strokeDate: string;
    dominantArm: "RIGHT" | "LEFT";
    pareticSide: "RIGHT" | "LEFT";
    cognitiveLevelHistory: CognitiveMeasurement;
    physicalLevelHistory: BasePatientPhysicalLevelHistory[];
    strokeType: string;
    visionCorrection?: string;
    goals: BasePatientGoals;
    interests: string[];
    therapist: string;
    therapyStartDate?: string;
    ADLHistory: AdlHistory;
};
export type CompletionRate = {
    finished: number;
    unfinished: number;
    skipped: number;
};
/*export type ExerciseCompletionRate = {
  week: CompletionRate;
  month: CompletionRate;
  allTime: CompletionRate;
};*/
export type ExerciseSession = {
    SessionID: any;
    from: string;
    to?: string;
    // id: string;
    name: string;
    status: "Finished" | "Unfinished" | "Skipped" | "Planned";
};
export type MoodData = MoodEntry[];
export type MoodEntry = {
    Mood: string;
    Date: string;
};
export type ContactPerson = { //已处理
    Name: string;
    Gender: string;
    Email: string;
    Photo: string;
    CaregiverID?: string;
    // Password: string;
};
export type PatientTherapist = {
    name: string;
    id: string;
    image: string;
};
export type PatientNotes = {
    note: string;
    time: string;
    therapist: PatientTherapist;
};
export type Patient = { //已处理
    PatientID: string;
    Name: string;
    // Gender: 'Male' | 'Female'| 'Other';//?
    Email: string;
    // Birthday: string;
    Phone: string | null;
    Password: string;
    Biometrics: any | null;
    LoginMode: 'biometrics' | 'standard';
    Photo: any | null;
    Caregivers: string[]; //CaregiverID 的数组
    Therapists: string[]; //TherapistID 的数组
    ActivityStatus?: string;//Online/Offline
    lastTraining?: number
}

/*export type Patient = {//BasePatient & {
  PatientID: string;
  activityStatus: string;
  exerciseCompletionRate: ExerciseCompletionRate;
  exercises: ExerciseSession[];
  mood: MoodData;
  contactPeople: ContactPeopleData;
  notes: PatientNotes[];
};*/
export type OnlineVariableSession = {
    Type: string;
    SessionID: string; //Unique ID of that specific exercise session
    PatientID: string; //Unique ID that maps the Document to a specific patient
    AssessmentID: string;
    Prescription: boolean;
    RGSInfo: { //(Placeholder - not relevant for us) Some RGS-specific information
        RGSVersion: string;
        RGSMode: string;
        IRCVersion: string;
        LogFileSpecificationVersion: string;
        TimeZone: string;
    };
    ProtocolInfo: { //Unique ID that refers to the protocol which was played in this session.
        ProtocolID: string;
        Difficulty: number;
        Duration: number;
    };
    SessionInfo: {
        Status: "Finished" | "Unfinished" | "Skipped" | "Planned";
        ReHybSystem: string; //Indicates which ReHyb System setup was used during the session ( "DTU-Setup", "HP-1", "HP-2", "SL").
        Duration: number; //Actual Duration of the session in Minutes.
        Score: [{ t: string, value: number }]; //The score of the session at different time points.
        PatientRating: string;
    };
    Data: {
        CommonEvents: {
            ProtocolStart: string; //The Timestamp of when the exercise started.
            ProtocolPaused: ProtocolStartStop[]; //List of time windows (StartTime and EndTime) of when the game was paused and continued.
            ProtocolAborted: string; //The Timestamp of when the exercise was aborted (if applies).
            ProtocolAbortedReason: string; //The reason provided by the patient for aborting the exercise (if applies).
            ProtocolSkippedReason: string; //The reason provided by the patient for skipping the exercise (if applies).
            ProtocolFinished: string; //The Timestamp of when the exercise finished (if patient fully completes exercise).
            Difficulty: DifficultyAdjustment[]; //Array that tracks the dynamic difficulty adjustments by the game throughout the exercise (Timestamp + new difficulty).
        };
        TrackingRaw: {
            Movements: MovementData[]; //The tracked movements represented by the angle value of each joint in each degree of freedom supported by the ReHyb Exoskeleton.
            Torque: TorqueData[]; //The tracked total torque in Nm measured in each joint in each degree of freedom supported by the ReHyb Exoskeleton.
            ExoTorque: TorqueData[]; //The tracked support provided by the Exoskeleton (Torque in Nm) in each joint in each degree of freedom supported by the ReHyb Exoskeleton.
            FESSupport: FESSupportData[]; //(Not relevant for us) The support provided by the FES in mA.
        };
        UserStates: {
            LocalIntention?: ObjectEvent[]; //(Not relevant for us) The target position of a movement as aimed for by the patient. Either x,y,z coordinate or corresponding joint configuration of the current target position.
            Fatigue?: Array<{ //The current muscular fatigue level (in % from 0-1) as predicted by the fatigue estimation model.
                t: string;
                value: number;
            }>;
            Spasticity?: SpasticityData[]; //The data of the spasticity prediction model.
            MovementCompensation?: Array<ManualCompensationRecord | PredictionCompensationRecord>; //The current amount of movement compensation (in % from 0-1) as predicted by the compensatory movement prediction model.
            RGSScorePhysical?: number[]; //Not relevant for us
            RGSScoreCognitive?: number[]; //Not relevant for us
            CognitiveFatigue?: Array<{ //(Not relevant for us) The current cognitive fatigue level (in % from 0-1) as predicted by the cogn. fatigue estimation model.
                T: string;
                Value: number;
            }>;
            Pain?: PainData[]; //The severity of acute pain ("Slight", "Moderate", "Strong") as self-reported by the patient once potential pain was detected by the pain prediction model.
            //The location of acute pain ("Hand", "Wrist", "Forearm", "Elbow", "Upper arm", "Shoulder") as self-reported by the patient once potential pain was detected by the pain prediction model.
            Mood?: Array<{ //(Not relevant for us) The current mood during the exercise as predicted by the mood prediction model ("Negative", "Positive", "Neutral")
                T: string;
                Value: string;
            }>;
        };
        ObjectEvents: {
            TargetCreated: ObjectEventExcluded[]; //(Not relevant for us) Timestamp and position of a newly created in-game target that the patient is supposed to reach.
            TargetReached: ObjectEvent[]; //(Not relevant for us) Timestamp and position of patient's hand when he/she reached the target successfully. This gives us information about how accurately the patient managed to move their arm to the target position.
            TargetMissed: ObjectEvent[]; //(Not relevant for us) Timestamp and position of patient's hand when he/she missed the target. This gives us information about by how much the patient missed the target.
        };
        Recording: string; //URL
    };
    // Include any additional properties that may be part of the OnlineVariableSession model.
};

export type ProtocolStartStop = {
    t_start: string;
    t_end: string;
}

export type DifficultyAdjustment = {
    t: string;
    value: number;
};


export type MovementData = {
    t: number;
    SFE: number;
    SHFE: number;
    SIE: number;
    EFE: number;
    RE: number;
    A_trunk_Z: number;
    A_trunk_Y: number;
    A_trunk_X: number;
    G_trunk_Z: number;
    G_trunk_Y: number;
    G_trunk_X: number;
    M_trunk_Z: number;
    M_trunk_Y: number;
    M_trunk_X: number;
    A_arm_Z: number;
    A_arm_Y: number;
    A_arm_X: number;
    G_arm_Z: number;
    G_arm_Y: number;
    G_arm_X: number;
    M_arm_Z: number;
    M_arm_Y: number;
    M_arm_X: number;
    EFE_error: number;
    save: number;
    filename_count: number;

};

export type IMUData = {
    Accelerometer: XYZData;
    Gyroscope: XYZData;
    Magnetometer: XYZData;
};

export type XYZData = {
    X: number;
    Y: number;
    Z: number;
};

export type TorqueData = {
    T: string;
    ShoulderAA: number;
    ShoulderFE: number;
    ShoulderIE: number;
    ElbowFE: number;
};

export type FESSupportData = {
    T: string;
    PremitiveH: number;
    HCathode: number;
    HAnode: number;
    PremitiveE: number;
    ECathode: number;
    EAnode: number;
    PinchAmp: number;
    PowerAmp: number;
    HandAmp: number;
    EextAmp: number;
    Eext_flx: number;
};
export type ObjectEventExcluded = {
    T: string;
    X: number;
    Y: number;
    Z: number;
}
export type ObjectEvent = {
    t: string;
    target: number;
    value: number;
}
export type SpasticityData = {
    Shoulder: boolean;
    Elbow: boolean;
    Wrist: boolean;
    Hand: boolean
};

export type PainData = {
    T: string;
    Severity: number;
    Location: string;
}

//TODO: finish this one, once the structure of the data has been determined
export type OnlineVariableAssessment = {
    Type: string;
    AssessmentID: string;
    PatientID: string;
    Date: string; // assuming DateTimeTimestamp is a string
    ROM: {
        AngleShoulderAA: MinMaxObject;
        AngleShoulderFE: MinMaxObject;
        AngleShoulderHFE: MinMaxObject;
        AngleShoulderIFE: MinMaxObject;
        AngleElbowFE: MinMaxObject;
        AngleWristPS: MinMaxObject;
        AngleIndexFE: MinMaxObject;
    };
    FESCalibration: {
        SelectedCathodes: number[];
        SelectedAnodes: number[];
        Max: number;
        Min: number;
    };
    Spasticity: {
        ShoulderAA: ObjectsForAssesments[];
        ShoulderFE: ObjectsForAssesments[];
        ShoulderIE: ObjectsForAssesments[];
        ElbowFE: ObjectsForAssesments[];
        Hand: {
            Resistance: {
                Torque: number;
            };
        };
    };
    Mood: string;
};
export type ObjectsForAssesments = {
    Angle: number;
    Resistance: ResistanceObject[]
}
export type ResistanceObject = {
    Speed: string;
    Torque: number;
}
export type MinMaxObject = { //已检查
    Min: number;
    Max: number;
    Date: string;
}
export type StateVariable = { //TODO:AA 和 HFE的处理
    PatientID: string;
    Physical: {
        ADLScore: number;
        RGSScorePhysical: number;
        ROM: ROM;
        Strength: Strength;
        Spasticity: Spasticity;
        Endurance: Endurance;
        MovementCompensation: { Date: string, TotalCompensation: number }[];

    };
    //暂时还不清楚
    Cognitive: {
        MoCAScore: number;
        RGSScoreCognitive: number;
        CognitiveEndurance: number;
        PainTolerance: number;
        Depression: number;
        Aphasia: boolean;
        Neglect: boolean;
    };
}

export type ROM = {
    AngleShoulderAA: MinMaxObject[];
    AngleShoulderFE: MinMaxObject[];
    AngleShoulderHFE: MinMaxObject[];
    AngleShoulderIE: MinMaxObject[];
    AngleElbowFE: MinMaxObject[];
    AngleWristPS: MinMaxObject[];
    AngleIndexFE: MinMaxObject[];
};

export type Strength = {
    RequiredSupportShoulderAA: { Torque: number, Date: string }[];
    RequiredSupportShoulderFE: { Torque: number, Date: string }[];
    RequiredSupportShoulderHFE: { Torque: number, Date: string }[];
    RequiredSupportShoulderIE: { Torque: number, Date: string }[];
    RequiredSupportElbowFE: { Torque: number, Date: string }[];
    RequiredSupportGrip: { FESSupport: number, Date: string }[];
}


export type Spasticity = {
    ShoulderAA: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[];
    ShoulderFE: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[];
    ShoulderIE: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[];
    ShoulderHFE: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[];
    ElbowFE: {
        Date: string,
        Assessment: { Speed: string, Spasticity: { Angle: number, Torque: number }[] }[]
    }[];
    Hand: { Date: string, Torque: number }[];
};

export type Endurance = {
    Shoulder: { Date: string, TimeToFatigue: number }[];
    Elbow: { Date: string, TimeToFatigue: number }[];
    Hand: { Date: string, TimeToFatigue: number }[];
};

export type UserModel = { //已检查
    PatientID: string;
    DTVersion?: string;
    Age?: number;
    Birthday: string;
    Gender?: 'Male' | 'Female' | 'Other';
    DefaultReHybSetup: string;
    Weight?: number;
    Height?: number;
    TypeOfStroke?: string;
    TimeOfStroke?: string;
    PareticSide?: string;
    DominantSide?: string;
    CorrectedVision?: {
        Left: number;
        Right: number;
    };
    ReHybPersona?: number;
    Interests?: InterestTags;
    TherapyGoals?: {
        LongTerm: TherapyGoal;
        ShortTerm: TherapyGoal;
    };
    FreeToPlayProtocols?: string[];
    "redDModel"?: string;
    Contacts?: ContactPerson[];
    Notes?: Note[];
}


export type Note = { //已检查
    Date: string;
    Description: string;
    TherapistName: string;
    TherapistPicture: string;
}
export type TherapyGoal = { //已检查
    Description: string;
    Quantification: {
        Physical: {
            ROM: {
                AngleShoulderAA: MinMaxObject;
                AngleShoulderFE: MinMaxObject;
                AngleShoulderHFE: MinMaxObject;
                AngleShoulderIE: MinMaxObject;
                AngleElbowFE: MinMaxObject;
                AngleWristPS: MinMaxObject;
                AngleIndexFE: MinMaxObject;
            };
            // Strength: {
            //     MaxTorqueShoulderAA: number;
            //     MaxTorqueShoulderFE: number;
            //     MaxTorqueShoulderIE: number;
            //     MaxTorqueElbowFE: number;
            //     MaxGrip: number;
            // };
            Strength: {
                RequiredSupportShoulderAA: number;
                RequiredSupportShoulderFE: number;
                RequiredSupportShoulderHFE: number;
                RequiredSupportShoulderIE: number;
                RequiredSupportElbowFE: number;
                RequiredSupportGrip: number;
            }
            Spasticity: {
                ShoulderAA: number;
                ShoulderFE: number;
                ShoulderIE: number;
                ShoulderHFE: number;
                Elbow: number;
                Wrist: number;
                Hand: number;
            };
            Endurance: {
                Shoulder: number;
                Elbow: number;
                Wrist: number; //好像Endurance没有Wrist
                Hand: number;
            };
        };
        Cognitive: {
            CognitiveScore: number;
            CognitiveEndurance: number;
            Aphasia: boolean;
            Neglect: boolean;
        };
    };
}


export type UserInfo = {
    name?: string; //Therapist Dashboard when adding new patient,patient profile
    gender?: string; //Therapist Dashboard when adding new patient,user model
    email?: string; //Therapist Dashboard when adding new patient, patient profile
    phone?: string; //Therapist Dashboard when adding new patient, patient profile
    password?: string; //Therapist Dashboard when adding new patient, patient profile
    birthday?: string; //Therapist Dashboard when adding new patient, user model
    image?: string;  //Therapist Dashboard when adding new patient, patient profile
    weight?: number; //Therapist Dashboard when adding new patient, user model
    height?: number; //Therapist Dashboard when adding new patient, user model
    strokeDate?: string; //Therapist Dashboard when adding new patient, user model
    dominantArm?: "RIGHT" | "LEFT";
    pareticSide?: "RIGHT" | "LEFT"; //Therapist Dashboard when adding new patient, user model
    strokeType?: string;
    visionCorrection?: string; //Therapist Dashboard when adding new patient, user model
    note?: string; //Therapist Dashboard when adding new patient, user model
    interests?: string[]; //Therapist Dashboard when adding new patient, user model
    defaultReHybSetup?: string; //Therapist Dashboard when adding new patient, user model
};


export type PatientIdManualAssessmentBody = { //已检查
    variable: "SHFE" | "SFE" | "SIE" | "EFE" | "WPS" | "HOC";
    date: string;
} & (
        | {
            strength: number; //对应Muscle strength
        }
        | {
            angle: number; //对应Spasticity
            speed: number;
            torque: number;
        }
        | {
            timeToFatigue: number; //对应Endurance
        }
        | {
            minAngle: number; //对应ROM
            maxAngle: number;
        }
    );
export type PatientIdExerciseSessionsBody = {
    exerciseId: string;
    from: string;
    to: string;
    difficulty: number;
    rehybSetting: number;
};

export type TherapyFocus = {  //已检查
    ROM: boolean;
    Strength: boolean;
    Endurance: boolean;
    ShoulderAA: boolean;
    ShoulderFE: boolean;
    ShoulderIE: boolean;
    ElbowFE: boolean;
    WristPS: boolean;
    Index: boolean;
    Grasp: boolean;
};

export type ExerciseSessionDetail = ExerciseSession & {
    exercise: Exercise;
    timesPerfomed?: number;
    rating: number;
    score: number;
    pain: number[];
    spasticity: number[];
    phisicalFatigue: number[];
    cognitiveFatigue: number[];
};
export type InlineResponse2004Patient = {
    id: string;
    imgUrl: string;
    name: string;
};
export type InlineResponse2004PatientActivities = {
    exercise: ExerciseSession;
    patient: InlineResponse2004Patient;
};
export type InlineResponse2004 = {
    patientsExercising: number;
    patientsOnline: number;
    patientsOffline: number;
    patientActivities: InlineResponse2004PatientActivities[];
    calendar: string;
};

//Yingli
export type AppInfo = {
    Starts: Date,
    Ends: Date,
    PatientID: string,
    Name: string,
    Note: string | null,
    Title: string | null,
    Location: string | null,
    Address: string | null,
    Code: String | null,
}
export const {
    useGetMeQuery,
    // usePostMeLogoutMutation,
    /*
    useGetAdminClinicsQuery,
    usePostAdminClinicsMutation,
    useDeleteAdminClinicsByClinicIdMutation,
    usePostAdminClinicsByClinicIdTherapistsMutation,
    useDeleteAdminClinicsByClinicIdTherapistsAndTherapistIdMutation,*/
    useGetExerciseDataByAssessmentIdAndSessionIdQuery,
    usePostExerciseDataPredictionMutation,
    usePostExerciseDataPredictionLocalIntentionMutation,
    usePostExerciseDataSessionInfoPerformanceMutation,
    usePostExerciseDataSessionInfoScoreMutation,
    usePostExerciseDataTrackingMutation,
    usePostExerciseDataRgsinfoMutation,
    usePostExerciseDataObjectEventsTargetCreatedMutation,
    usePostExerciseDataObjectEventsTargetUpdatedMutation,
    usePostExerciseDataEventStartMutation,
    usePostExerciseDataEventFinishMutation,
    usePostExerciseDataEventAbortMutation,
    usePostExerciseDataEventPauseMutation,
    useGetExerciseSummaryByUserIdAndSessionIdQuery,
    usePostAuthLoginMutation,
    useGetPatientsQuery,

    usePostPatientsByPatientIdExerciseSessionsMutation,
    useGetPatientsByPatientIdExerciseSessionsAndExerciseSessionIdQuery,
    useDeletePatientsByPatientIdExerciseSessionsAndExerciseSessionIdMutation,


    useGetOnlineVariableAssessmentByPatientIdQuery,
    useGetOnlineVariableSessionByPatientIdQuery,
    useGetPrescriptionByPrescriptionIDQuery,

    useGetRehybProtocolsQuery,


    useGetPatientAllPrescriptionsQuery,
    usePostProtocolsBasedOnInterestMutation,

    //Yongzhi's code
    useGetTherapistByTherapistIDQuery, //根据id获取名字
    useCreateTherapistMutation,      //Sign Up
    useGetLatestOnlineVariableQuery, // Dashboard-Patients-session data&color
    usePostPatientsMutation,
    useUpdatePatientsMutation,
    useGetActivePatientsQuery,
    useGetInactivePatientsQuery,
    useAddPatientIntoActiveMutation,
    useGetPatientsByPatientIdQuery,
    useGetUsermodelByPatientIdQuery,   //根据patientID获得对应user model

    useArchivePatientsByPatientIdMutation,
    useGetActivityStatusQuery, //Dashboard-"Your Patients"
    useGetAppointmentsByTherapistIdAndDateQuery, //Dashboard-"Patients Today/Patients at 19/03/2024,etc."
    usePostAppointmentsByTherapistIdAndDateMutation,// Create new appointment
    useDeleteAppointmentsByAppointmentIdMutation,// Create new appointment

    useGetOverviewQuery, //Dashboard-"Patient activities"
    useUpdateNotesByPatientIdMutation, //patients-Overview-"Leave a note"
    useGetInactiveCaregiversQuery,  //patients-Overview-Existing Caregivers,
    usePostPatientsByPatientIdContactPersonMutation, //patients-Overview-Existing Caregivers-"Add Contact Person"
    useAddCaregiverIntoActiveMutation, //patients-Overview-Existing Caregivers-"Add existing Caregiver"
    useGetCaregiverByEmailQuery, //patients-Overview-Contact Person-"Edit Button"
    useUpdateContactPersonByPatientIdMutation, //patients-Overview-Contact Person-"Edit Button"
    useRemoveCaregiverFromActiveMutation, //patients-Overview-Existing Caregivers-"Remove Button"
    useGetExerciseCompletionRateQuery,  //patients-Overview-Exercise Completion Rate
    useGetPatientPrescriptionsQuery, //patients-Overview-Exercise Completion Rate
    useGetTodaysExercisesStatusQuery, //patients-overview-Today's Exercises
    useGetMoodAssessmentsQuery, //patients-overview-Patient Mood
    useGetPatientsByPatientIdExerciseSessionsQuery, //patients-overview-Activity time,根据patientID获得所有patient的exercise session
    useGetPatientsByPatientIdDataQuery, //patients-overview-Patient current condition，根据patientID获得对应State Variable
    useUpdateTherapyGoalsByPatientIdMutation, //patients-overview-Therapy Goals


    useGetAllExerciseProtocolsQuery, //Exercises-All exercises
    useGetAllExerciseProtocolsByPatientIdQuery, //patients-Exercise plan-All exercises likes and dislikes for a patient
    useGetPrescriptionsAndExerciseSessionsByPatientIdQuery, //patients-Exercise plan-Exercise Schedule
    useGetDefaultRehybSetupAndFreeToPlayProtocolsQuery, //patients-Exercise plan-Exercise Schedule
    useUpdateExercisePlanMutation, //patients-Exercise plan-Save
    useUpdateFreeToPlayProtocolsByPatientIdMutation, //patients-Exercise plan-Save
    usePostPatientsByPatientIdManualAssessmentMutation, //patients-patient's data-Manual Assessment
    useDeleteOneVariableByPatientIdAndDateMutation, //patients-patient's data-Manual Assessment - delete
    usePostManualAssessmentByPatientIdMutation, //patients-patient's data-Manual Assessment- 重写的方法，旧的懒得改
    useDeleteManualAssessmentByPatientIdAndDateMutation, //patients-patient's data-Manual Assessment - delete - 重写的方法，旧的懒得改
    useGetExerciseSessionDetailQuery, ////Exercise Plan-Exercise Session Detail - Yuxuan Zhang's code
    useSkipPlannedPrescriptionMutation, //切换到patient页面时，将planned的prescription变成skipped

    useGetAllThePatientsAndCaregiversQuery,


} = injectedRtkApi;
export type AddPatientIntoActiveApiResponse = Patient;
export type AddPatientIntoActiveApiArg = {
    PatientID: string;
};
// export type Appointment = {
//     AppointmentID: string;
//     TherapistID: string;
//     PatientID: string;
//     StartTime: string;
//     EndTime: string;
//     Photo: string;
//     Name: string;
//     AppointmentStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed";
// }

//export type GetAppointmentsByTherapistIdAndDateApiResponse = Appointment[];
export type GetAppointmentsByTherapistIdAndDateApiResponse = AppInfo[]; //any[]
export type GetAppointmentsByTherapistIdAndDateApiArg = {
    StartDate: string;
};
export type PostAppointmentsByTherapistIdAndDateApiResponse = unknown;
export type PostAppointmentsByTherapistIdAndDateApiArg = {
    Appointment: AppInfo
}
export type DeleteAppointmentsByAppointmentIdApiResponse = unknown;

export type DeleteAppointmentsByAppointmentIdApiArg = {
    ID: string
}
export type PostPatientsByPatientIdContactPersonApiResponse = unknown; //patients-Overview-"Add Contact Person"
export type PostPatientsByPatientIdContactPersonApiArg = {
    /** ID of the patient */
    patientId: string;
    patientIdContactPersonBody: PatientIdContactPersonBody;
};
export type PatientIdContactPersonBody = {
    name: string;
    gender: string;
    email: string;
    password: string;
    image: string;
    accessToData: Permission[];
    phone: string;
};
export type Permission = 'Strength' | 'ROM' | 'Fatigue' | 'CognitiveFatigue' | 'MentalHealth' | 'Neglect' | 'Aphasia';

export type updateNotesByPatientIdApiResponse = unknown;
export type updateNotesByPatientIdApiArg = {
    PatientID: string;
    note?: string;
    action: "Add" | "Delete";
    dateToDelete?: string;
    TherapistID?: string;
}

export type GetInactiveCaregiversApiResponse = ContactPerson[];
export type GetInactiveCaregiversApiArg = {
    PatientID: string;
    sortBy: string;
}

export type AddCaregiverIntoActiveApiResponse = unknown;
export type AddCaregiverIntoActiveApiArg = {
    PatientID: string;
    CaregiverID: string;
}

export type GetCaregiverByEmailApiResponse =
    ContactPerson & {
        Phone: string,
        AccessRights: Permission[];
    };
export type GetCaregiverByEmailApiArg = {
    patientID: string;
    caregiverEmail: string;
}

export type updateContactPersonByPatientIdApiResponse = unknown;
export type updateContactPersonByPatientIdApiArg = {
    /** ID of the patient */
    patientId: string;
    patientIdContactPersonBody: Omit<PatientIdContactPersonBody, 'password'> & {
        caregiverId: string,
        password?: string
    };
};

export type RemoveCaregiverFromActiveApiResponse = unknown;
export type RemoveCaregiverFromActiveApiArg = {
    PatientID: string;
    CaregiverID: string;
}

export type getTodaysExercisesStatusApiResponse = [{
    protocolName: string;
    sessionStatus: 'Finished' | 'Unfinished' | 'Skipped' | 'Planned';
}]

export type getTodaysExercisesStatusApiArg = {
    sessionIDs: string[];
}
export type updateTherapyGoalsByPatientIdApiResponse = unknown;
export type updateTherapyGoalsByPatientIdApiArg = {
    PatientID: string;
    Term: "ShortTerm" | "LongTerm";
    TherapyGoals: TherapyGoalsState;
}

export type Exercise = {
    ProtocolID: string;
    ProtocolName: string;
    ProtocolDescription: string;
    Thumbnail: string;
    InterestTags: InterestTags;
    TherapyFocus: TherapyFocus;
    LikeRate?: number;
};
export type GetAllExerciseProtocolsApiResponse = Exercise[];
export type GetAllExerciseProtocolsApiArg = void;

export type GetAllExerciseProtocolsByPatientIdApiResponse = Exercise[];
export type GetAllExerciseProtocolsByPatientIdApiArg = {
    PatientID: string;
};

export type GetPrescriptionsAndExerciseSessionsByPatientIdApiResponse = (OnlineVariableSession | Prescription)[];
export type GetPrescriptionsAndExerciseSessionsByPatientIdApiArg = {
    PatientID: string;
    TimeSpan: { StartDate: string, EndDate: string };
};

export type UpdateExercisePlanApiResponse = unknown;
export type UpdateExercisePlanApiArg = {
    PatientID: string;
    PendingToDelete: string[];
    EditablePrescriptions: EditablePrescription[];
};

export type CreateTherapistApiResponse = unknown;
export type CreateTherapistApiArg = {
    Email: string;
    Password: string;
    Name: string;
};

export type GetDefaultRehybSetupAndFreeToPlayProtocolsApiResponse = {
    DefaultReHybSetup: string;
    FreeToPlayProtocolIDs: string[];
};
export type GetDefaultRehybSetupAndFreeToPlayProtocolsApiArg = {
    PatientID: string;
};
export type updateFreeToPlayProtocolsByPatientIdApiResponse = unknown;
export type updateFreeToPlayProtocolsByPatientIdApiArg = {
    PatientID: string;
    FreeToPlayProtocolIDs: string[];
};

export type PostPatientsByPatientIdManualAssessmentApiResponse = unknown;
export type PostPatientsByPatientIdManualAssessmentApiArg = {
    /** ID of the patient */
    patientId: string;
    patientIdManualAssessmentBody: PatientIdManualAssessmentBody;
};
export type VariableType = Extract<PatientIdManualAssessmentBody, { variable: any }>["variable"];
export type DeleteOneVariableByPatientIdAndDateApiResponse = unknown;
export type DeleteOneVariableByPatientIdAndDateApiArg = {
    patientId: string;
    variable: VariableType;
    date: string;
}

export type PostManualAssessmentByPatientIdApiResponse = unknown;
export type PostManualAssessmentByPatientIdApiArg = {
    patientId: string;
    body: ManualAssessmentBody;
};
export type ManualAssessmentBody = {
    strengthGraph?: {
        strength?: number,
        date: string,
        variable: VariableType,
    },
    spasticityGraph?: {
        angle?: number,
        speed?: Speed,
        torque?: number,
        date: string,
        variable: VariableType,
    },
    enduranceGraph?: {
        timeToFatigue?: number,
        date: string,
        bodyPart: BodyPart,
    },
};
export type Speed = "Slow" | "Moderate" | "Fast";
export type DeleteManualAssessmentByPatientIdAndDateApiResponse = unknown;
export type DeleteManualAssessmentByPatientIdAndDateApiArg = {
    patientId: string;
    body: ManualAssessmentBody;
}

export type GetTherapistByTherapistIdApiResponse = /** status 200  */ UserDocument;
export type GetTherapistByTherapistIdApiArg = {
    therapistId: number;
};

export type GetExerciseSessionDetailApiResponse = NewSessionData; //TODO:可能要改
export type GetExerciseSessionDetailApiArg = {
    PatientID: string;
    SessionID: string;
}


export type SkipPlannedPrescriptionApiResponse = unknown;
export type SkipPlannedPrescriptionApiArg = unknown;


export type GetAllThePatientsAndCaregiversResponse = {
    ActivePatients: [{
        id: string,
        Name: string,
    }
    ],
    Caregivers: [{
        id: string,
        Name: string,
    }
    ]
};
export type GetAllThePatientsAndCaregiversArg = {
    TherapistID: string;
}