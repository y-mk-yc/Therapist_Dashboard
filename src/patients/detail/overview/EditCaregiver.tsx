import {SideDialog} from '../../../common/dialogs/SideDialog'
import {divWrapper} from '../../../common/styleUtils'
import {
    LabeledCheckbox, LabeledConfirmPasswordInput,
    LabeledInput, LabeledPasswordEmailInput,
    LabeledPhoneInput,
    LabeledSelect,
    LabeledToBase64FileInput, Placeholder
} from '../../../common/Inputs'
import {useUpdateContactPersonByPatientIdMutation, useGetCaregiverByEmailQuery} from '../../../store/rehybApi'
import React, {useEffect, useState} from "react";
import {useSetState} from "../../../common/stateUtils";
import {useParams} from "react-router-dom";
import {Loader} from "../../../common/Loader";
import {Permission} from "../../../store/rehybApi";
import {EmailRegex, PasswordRegex} from "../../../common/Inputs";

const Grid = divWrapper('grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(5,auto)] gap-x-6 gap-y-2')

export const EditCaregiver = (props: { caregiverToEditEmail: string, cancel: () => void }) => {
    const {patientId} = useParams()
    const {data, isLoading} = useGetCaregiverByEmailQuery({
        patientID: patientId!,
        caregiverEmail: props.caregiverToEditEmail
    })
    // console.log(data);
    const [update, result] = useUpdateContactPersonByPatientIdMutation()

    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [addPermission, removePermission, permissions] = useSetState<Permission>([])


    useEffect(() => {
        if (data) {
            setName(data.Name ?? '');
            setGender(data.Gender ?? 'Male');
            setEmail(data.Email ?? '@');
            setImageBase64(data.Photo ?? '');
            setPhone(data.Phone ?? '');
            setIsEmailValid(EmailRegex.test(data.Email ?? '@'));
            if (data.AccessRights) {
                data.AccessRights.forEach((permission: Permission) => {
                    addPermission(permission)
                    // console.log(permission);
                })
            }
        }
    }, [data]);

    // console.log(permissions)


    const actionEnabled = showNewPassword ? (!!(name && gender && email && phone && password && password === confirmPassword &&
        isPasswordValid && isEmailValid)) : (!!(name && gender && email && phone && isEmailValid));


    const togglePermission = (permission: Permission) => (checked: boolean) => {
        if (checked) addPermission(permission)
        else removePermission(permission)
    }

    const updateContact = async () => {
        const caregiverId = data!.CaregiverID!;
        // if (showNewPassword) {
        //     await update({
        //         patientId: patientId!, patientIdContactPersonBody: {
        //             caregiverId,
        //             gender,
        //             password,
        //             email,
        //             name,
        //             accessToData: Array.from(permissions.values()),
        //             image: imageBase64,
        //             phone
        //         }
        //     })
        // } else {
        //     await update({
        //         patientId: patientId!, patientIdContactPersonBody: {
        //             caregiverId,
        //             gender,
        //             email,
        //             name,
        //             accessToData: Array.from(permissions.values()),
        //             image: imageBase64,
        //             phone
        //         }
        //     })
        // }
        const requestBody = {
            patientId: patientId!,
            patientIdContactPersonBody: {
                caregiverId,
                gender,
                email,
                name,
                accessToData: Array.from(permissions.values()),
                image: imageBase64,
                phone,
                ...(showNewPassword && { password }),
            },
        };
        await update(requestBody);
        props.cancel();
    }
    if (isLoading) return <></>


    return <SideDialog title={'Add contact person to the patient'}
                       subtitle={`Complete the contact's information`}
                       onClose={props.cancel}
                       primaryAction={result.isLoading ? undefined : updateContact}
                       showCancelButton={!result.isLoading}
                       actionLabel={'Update'}
                       isActionDisabled={!actionEnabled}
    >

        {result.isLoading && <Loader/>}
        {!result.isLoading && <>
            <div className='card-outline'>
                <h5 className='mb-2'>Contact person's detail</h5>
                <Grid>
                    <LabeledInput label={'Name'} placeholder={'Enter name'} onValueSet={setName} value={name}/>
                    <LabeledSelect label={'Gender'} placeholder={''} onValueSet={setGender} value={gender} values={[
                        {text: 'Male', value: 'Male'},
                        {text: 'Female', value: 'Female'},
                        {text: 'Other', value: 'Other'},
                    ]}/>
                    <LabeledPasswordEmailInput
                        type={'email'}
                        label={'Email'}
                        placeholder={'Enter email'}
                        onValueSet={setEmail}
                        value={email}
                        onIsValid={setIsEmailValid}
                    />
                    <LabeledPhoneInput
                        label={'Phone'}
                        onValueSet={setPhone}
                        value={phone}
                        international={true}
                        countryCallingCodeEditable={false}
                    />
                    <LabeledToBase64FileInput label={'Image'} valueBase64={imageBase64} onValueSet={setImageBase64}/>
                    <Placeholder/>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={showNewPassword}
                            onChange={(e) => setShowNewPassword(e.target.checked)}
                        />
                        <span>Set new password ?</span>
                    </div>
                    {showNewPassword && (
                        <>
                            <Placeholder/>
                            <LabeledPasswordEmailInput
                                type={'password'}
                                label={'New password'} placeholder={'Enter password'}
                                onValueSet={setPassword}
                                value={password}
                                tooltip={"Password must contain uppercase and lowercase letters, numbers, and be at least 8 characters long."}
                                onIsValid={setIsPasswordValid}
                            />
                            <LabeledConfirmPasswordInput
                                label={'Repeat new password'}
                                placeholder={'Enter password again'}
                                onValueSet={setConfirmPassword}
                                value={confirmPassword}
                                passwordValue={password}
                                tooltip={"Please re-enter your password for confirmation."}
                            />
                        </>
                    )}
                </Grid>
            </div>
            <div className='card-outline mt-4'>
                <h5>Access to data</h5>
                <ul className='mt-2'>
                    <li><LabeledCheckbox label={'Strength'} onValueSet={togglePermission('Strength')}
                                         value={permissions.has('Strength')}/></li>
                    <li><LabeledCheckbox label={'ROM'} onValueSet={togglePermission('ROM')}
                                         value={permissions.has('ROM')}/></li>
                    {/*'Strength' | 'ROM' | 'Fatigue' | 'CognitiveFatigue' | 'MentalHealth' | 'Neglect' | 'Aphasia'*/}
                    <li><LabeledCheckbox label={'Fatigue'} onValueSet={togglePermission('Fatigue')}
                                         value={permissions.has('Fatigue')}/></li>
                    <li><LabeledCheckbox label={'Cognitive fatigue'} onValueSet={togglePermission('CognitiveFatigue')}
                                         value={permissions.has('CognitiveFatigue')}/></li>
                    <li><LabeledCheckbox label={'Mental health'} onValueSet={togglePermission('MentalHealth')}
                                         value={permissions.has('MentalHealth')}/></li>
                    <li><LabeledCheckbox label={'Neglect'} onValueSet={togglePermission('Neglect')}
                                         value={permissions.has('Neglect')}/></li>
                    <li><LabeledCheckbox label={'Aphasia'} onValueSet={togglePermission('Aphasia')}
                                         value={permissions.has('Aphasia')}/></li>
                </ul>
            </div>
        </>}
    </SideDialog>
}