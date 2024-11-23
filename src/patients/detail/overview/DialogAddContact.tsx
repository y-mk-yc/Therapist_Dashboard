import {SideDialog} from '../../../common/dialogs/SideDialog'
import {divWrapper} from '../../../common/styleUtils'
import {
    LabeledCheckbox, LabeledConfirmPasswordInput,
    LabeledInput, LabeledPasswordEmailInput,
    LabeledPhoneInput,
    LabeledSelect,
    LabeledToBase64FileInput, Placeholder
} from '../../../common/Inputs'
import {usePostPatientsByPatientIdContactPersonMutation} from '../../../store/rehybApi'
import React, {useState} from "react";
import {useSetState} from "../../../common/stateUtils";
import {useParams} from "react-router-dom";
import {Loader} from "../../../common/Loader";
import {Permission} from "../../../store/rehybApi";

const Grid = divWrapper('grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(5,auto)] gap-x-6 gap-y-2')

export const DialogAddContact = (props: { onDone: () => void }) => {
    const {patientId} = useParams()
    const [mutate, data] = usePostPatientsByPatientIdContactPersonMutation()

    const [name, setName] = useState('')
    const [gender, setGender] = useState('Male')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageBase64, setImageBase64] = useState('')
    const [phone, setPhone] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const [addPermission, removePermission, permissions] = useSetState<Permission>([])
    // console.log(permissions)

    const actionEnabled = !!(name && gender && email && phone && password && password === confirmPassword &&
        isPasswordValid && isEmailValid);


    const togglePermission = (permission: Permission) => (checked: boolean) => {
        if (checked) addPermission(permission)
        else removePermission(permission)
    }

    const createContact = async () => {
        await mutate({
            patientId: patientId!, patientIdContactPersonBody: {
                gender, password, email, name, accessToData: Array.from(permissions.values()), image: imageBase64, phone
            }
        })
        props.onDone()
    }


    return <SideDialog title={'Add contact person to the patient'}
                       subtitle={`Complete the contact's information`}
                       onClose={props.onDone}
                       primaryAction={data.isLoading ? undefined : createContact}
                       showCancelButton={!data.isLoading}
                       actionLabel={'Create'}
                       isActionDisabled={!actionEnabled}
    >

        {data.isLoading && <Loader/>}
        {!data.isLoading && <>
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

                    <LabeledPasswordEmailInput
                        type={'password'}
                        label={'Password'} placeholder={'Enter password'}
                        onValueSet={setPassword}
                        value={password}
                        tooltip={"Password must contain uppercase and lowercase letters, numbers, and be at least 8 characters long."}
                        onIsValid={setIsPasswordValid}
                    />
                    <LabeledConfirmPasswordInput
                        label={'Repeat password'}
                        placeholder={'Enter password again'}
                        onValueSet={setConfirmPassword}
                        value={confirmPassword}
                        passwordValue={password}
                        tooltip={"Please re-enter your password for confirmation."}
                    />
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