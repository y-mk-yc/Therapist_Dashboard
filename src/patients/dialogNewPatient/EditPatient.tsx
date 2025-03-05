import
{
    EmailRegex,
    LabelBox, LabeledAvatarFileInput, LabeledCheckboxGroup, LabeledConfirmPasswordInput,
    LabeledInput,
    LabeledNumberInput, LabeledPasswordEmailInput, LabeledPhoneInput,
    LabeledSelect,
    LabeledTextArea,
    LabeledToBase64FileInput, Placeholder
} from "../../common/Inputs";
import { divWrapper } from "../../common/styleUtils";
import React, { useState, useEffect } from "react";
import
{
    Patient,
    useUpdatePatientsMutation,
    UserInfo,
    useGetPatientsByPatientIdQuery,
    useGetUsermodelByPatientIdQuery,
    InterestTags
} from "../../store/rehybApi";
import { formatDate, parseYYYYMMDD } from "../../common/dateUtils";
import { Loader } from "../../common/Loader";
import SparkMD5 from "spark-md5";
// import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getUrl } from "../../urlPicker";

const baseUrl = getUrl('auth');


const Grid = divWrapper('grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(6,auto)] gap-x-6 gap-y-2')

export const EditPatient = (props: { patientToEdit: Patient, cancel: () => void }) =>
{
    const [updatePatient, { isLoading, isError }] = useUpdatePatientsMutation()
    const { data: patient } = useGetPatientsByPatientIdQuery({ PatientID: props.patientToEdit.PatientID })
    const { data: userModel } = useGetUsermodelByPatientIdQuery({ PatientID: props.patientToEdit.PatientID })

    const [patientData, setPatientData] =
        useState<Required<UserInfo>>
            ( //UserInfo的所有属性都是必须的
                {
                    name: '',
                    gender: 'Male',
                    email: '@',
                    phone: '',
                    password: '',
                    birthday: '',
                    image: '',
                    weight: 70,
                    height: 170,
                    strokeDate: '',
                    dominantArm: 'RIGHT',
                    pareticSide: 'RIGHT',
                    strokeType: 'Ischemic',
                    visionCorrection: '0/0',
                    note: '',
                    defaultReHybSetup: 'DTU-Setup',
                    interests: []
                }
            )
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() =>
    {
        if (patient && userModel)
        {
            setPatientData({
                name: patient.Name ?? '',
                gender: userModel.Gender ?? 'Male',
                email: patient.Email ?? '@',
                phone: patient.Phone ?? '',
                password: '',
                //将birthday转换为本地时间
                birthday: userModel.Birthday ? formatDate(new Date(userModel.Birthday)) : '',
                image: patient.Photo ?? '',
                weight: userModel.Weight ?? 70,
                height: userModel.Height ?? 170,
                //将TimeOfStroke转换为本地时间
                strokeDate: userModel.TimeOfStroke ? formatDate(new Date(userModel.TimeOfStroke)) : '',
                dominantArm: userModel.DominantSide === 'LEFT' ? 'LEFT' : 'RIGHT',
                pareticSide: userModel.PareticSide === 'LEFT' ? 'LEFT' : 'RIGHT',
                strokeType: userModel.TypeOfStroke ?? 'Ischemic',
                visionCorrection: userModel.CorrectedVision ? (userModel.CorrectedVision.Left + '/' + userModel.CorrectedVision.Right) : '0/0',
                note: '',
                defaultReHybSetup: userModel.DefaultReHybSetup ?? 'DTU-Setup',
                interests: userModel.Interests ? Object.keys(userModel.Interests).filter(key => (userModel.Interests as InterestTags)[key as keyof InterestTags]) : []
            });
            setIsEmailValid(EmailRegex.test(patient.Email ?? '@'));
        }
    }, [patient, userModel]);


    const [file, setFile] = useState<File | null>(null);
    const uploadAvatarFile = async () =>
    {
        if (!file) return;

        const md5 = new SparkMD5.ArrayBuffer();
        // 计算文件的MD5值
        const arrayBuffer = await file.arrayBuffer();
        md5.append(arrayBuffer);
        const fileMD5 = md5.end();

        // 创建Blob对象
        const blob = new Blob([arrayBuffer], { type: file.type });

        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', blob, file.name);
        formData.append('fileName', file.name);
        formData.append('fileMD5', fileMD5);

        try
        {
            const uploadFileresponse = await axios.post('/' + patientData.email, formData, {
                baseURL: baseUrl + `/TherapistProfiles/uploadAvatar`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(uploadFileresponse);
        } catch (error)
        {
            console.error('Error uploading file:', error);
        }
    };


    const createPatientDataSetter =
        (key: keyof UserInfo, isNumber: boolean = false) =>     //key只能是UserInfo的属性名，默认属性值是false
            (value: string | number) => setPatientData({
                ...patientData,                     //将patientData解构出来;isNumber为true，[key]的值是数字，否则是字符串
                [key]: isNumber ? +value : value    //如果isNumber为true，就是+value，否则就是value；将key参数作为属性名
            })

    //检查patientData对象中除image和notes属性外的所有字符串属性，如果所有这些属性都非空，就返回true，否则返回false
    const createEnabled =
        showNewPassword ?
            ((Object.keys(patientData) as (keyof typeof patientData)[])
                .reduce((prev, current) =>
                {
                    if (current === 'image' || current === 'note' || typeof patientData[current] !== 'string')
                    {
                        return prev;
                    }
                    return (typeof patientData[current] === 'string') && (patientData[current] as string).length > 0 && prev;
                }, true) && patientData.password === confirmPassword && !!patientData.phone && isEmailValid && isPasswordValid)
            :
            ((Object.keys(patientData) as (keyof typeof patientData)[])
                .reduce((prev, current) =>
                {
                    if (current === 'image' || current === 'note' || current === "password" || typeof patientData[current] !== 'string')
                    {
                        return prev;
                    }
                    return (typeof patientData[current] === 'string') && (patientData[current] as string).length > 0 && prev;
                }, true) && !!patientData.phone && isEmailValid);


    const onUpdate = async () =>
    {
        try
        {
            const { password, ...patientDataWithoutPassword } = patientData;
            const result = await updatePatient({
                PatientID: props.patientToEdit.PatientID,
                userInfo: {
                    ...patientDataWithoutPassword,
                    birthday: parseYYYYMMDD(patientData.birthday).toISOString(),    //转换为UTC时间
                    strokeDate: parseYYYYMMDD(patientData.strokeDate).toISOString(),
                    ...(showNewPassword && { password: patientData.password }),
                }
            })
            uploadAvatarFile();
            props.cancel()
        } catch (e)
        {
            console.error("Failed to update patient", e)
        }
    }
    // console.log("showNewPassword:", showNewPassword)
    // console.log("createEnabled", createEnabled)
    // console.log("isEmailValid", isEmailValid)
    // console.log("isPasswordValid", isPasswordValid)
    if (!patient || !userModel) return <Loader />


    if (isLoading)
        return <Loader />


    return <>
        <div className='card-outline'>
            <h5 className='mb-2'>Patient's detail</h5>
            <Grid>
                <LabeledInput
                    label={'Patient\'s name'} placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('name')} value={patientData.name}
                />
                <LabeledInput
                    type={'date'}
                    label={'Birthday'} placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('birthday')}
                    value={patientData.birthday}
                />
                <LabeledSelect
                    label={'Gender'} placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('gender')}
                    value={patientData.gender}
                    values={[
                        { text: 'Male', value: 'Male' },
                        { text: 'Female', value: 'Female' },
                        { text: 'Other', value: 'Other' },
                    ]} />
                <LabeledPhoneInput
                    label={'Phone'}
                    onValueSet={createPatientDataSetter('phone')}
                    value={patientData.phone}
                    international={true}
                    countryCallingCodeEditable={false}
                />
                <LabeledNumberInput
                    label={'Weight (kg)'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('weight', true)}
                    value={patientData.weight}
                />
                <LabeledNumberInput
                    label={'Height (cm)'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('height', true)}
                    value={patientData.height}
                />
                <LabeledPasswordEmailInput
                    type={'email'}
                    label={'Email'}
                    placeholder={'Enter email'}
                    onValueSet={createPatientDataSetter('email')}
                    value={patientData.email}
                    onIsValid={setIsEmailValid}
                />
                <LabeledToBase64FileInput
                    label={'Image'}
                    onValueSet={createPatientDataSetter('image')}
                    valueBase64={patientData.image}
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showNewPassword}
                        onChange={(e) => setShowNewPassword(e.target.checked)}
                    />
                    <span>Set new password ?</span>
                </div>
                <></>
                {showNewPassword && (
                    <>
                        <Placeholder />
                        <LabeledPasswordEmailInput
                            type={'password'}
                            label={'New password'} placeholder={'Enter password'}
                            onValueSet={createPatientDataSetter('password')}
                            value={patientData.password}
                            tooltip={"Password must contain uppercase and lowercase letters, numbers, and be at least 8 characters long."}
                            onIsValid={setIsPasswordValid}
                        />
                        <LabeledConfirmPasswordInput
                            label={'Repeat new password'}
                            placeholder={'Enter password again'}
                            onValueSet={setConfirmPassword}
                            value={confirmPassword}
                            passwordValue={patientData.password}
                            tooltip={"Please re-enter your password for confirmation."}
                        />
                    </>
                )}
            </Grid>
        </div>
        <div className='card-outline mt-4'>
            <h5 className='mb-2'>Patient's condition</h5>
            <Grid>
                <LabeledSelect
                    label={'Stroke type'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('strokeType')}
                    value={patientData.strokeType}
                    values={[{ value: 'ischemic', text: 'Ischemic stroke' }]} />
                <LabeledInput
                    type={'date'}
                    label={'Date of stroke'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('strokeDate')}
                    value={patientData.strokeDate}
                />
                <LabeledSelect
                    label={'Paretic side'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('pareticSide')}
                    value={patientData.pareticSide}
                    values={[{ text: 'Right', value: 'Right' }, { text: 'Left', value: 'Left' },]} />
                <LabeledSelect
                    label={'Dominant side'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('dominantArm')}
                    value={patientData.dominantArm}
                    values={[{ text: 'Right', value: 'Right' }, { text: 'Left', value: 'Left' },]} />

                <LabeledCheckboxGroup
                    label={'Interests'}
                    values={[{ value: 'Sports', text: 'Sports' }, { value: 'Cooking', text: 'Cooking' },
                    { value: 'Household', text: 'Household' }, { value: 'Gardening', text: 'Gardening' },
                    { value: 'ADL', text: 'ADL' }, { value: 'Nature', text: 'Nature' },
                    { value: 'Competition', text: 'Competition' }, { value: 'Other', text: 'Other' }]}
                    onValueSet={(selectedValues) => setPatientData({ ...patientData, interests: selectedValues })}
                    selectedValues={patientData.interests}
                    className={'flex'}
                />
                <div className={`flex flex-col gap-y-2`}>
                    <LabelBox label={'Corrected vision'}>
                        <div className={'flex gap-2 items-center'}>
                            <input type='number' className={`w-[100px]`}
                                value={patientData.visionCorrection.split('/')[0]}
                                onChange={(e) =>
                                {
                                    const prev = patientData.visionCorrection.split('/')[1]
                                    setPatientData({
                                        ...patientData,
                                        visionCorrection: `${e.target.value}/${prev}`
                                    })
                                }}
                            />
                            {'/'}
                            <input type='number' className={`w-[100px]`}
                                value={patientData.visionCorrection.split('/')[1]}
                                onChange={(e) =>
                                {
                                    const prev = patientData.visionCorrection.split('/')[0]
                                    setPatientData({
                                        ...patientData,
                                        visionCorrection: `${prev}/${e.target.value}`
                                    })
                                }}
                            />
                        </div>
                    </LabelBox>
                    <LabeledSelect
                        label={'Default ReHyb Setup'} placeholder={'Enter here'}
                        onValueSet={createPatientDataSetter('defaultReHybSetup')}
                        value={patientData.defaultReHybSetup}
                        values={[
                            { text: 'DTU-Setup', value: 'DTU-Setup' },
                            { text: 'HP-1', value: 'HP-1' },
                            { text: 'HP-2', value: 'HP-2' },
                            { text: 'SL', value: 'SL' },
                        ]} />
                    <LabeledAvatarFileInput
                        label={'Avatar'}
                        onValueSet={setFile}
                        value={file}
                    />
                </div>
                <LabeledTextArea
                    className={'col-span-2'}
                    label={'Special condition notes (Optional)'}
                    placeholder={'Enter here'}
                    onValueSet={createPatientDataSetter('note')}
                    value={patientData.note}
                />
            </Grid>
        </div>
        <div className={'w-full mt-4 gap-4 flex justify-end'}>
            <button className='btn-secondary' onClick={props.cancel}>Cancel</button>
            <button className={'btn-primary self-end'} onClick={onUpdate} disabled={!createEnabled}>Update</button>
        </div>
    </>
}