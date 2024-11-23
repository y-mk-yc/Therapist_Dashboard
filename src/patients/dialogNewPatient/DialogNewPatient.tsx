import {SideDialog} from '../../common/dialogs/SideDialog'
import {Patient} from '../../store/rehybApi'
import {useState} from 'react'
import {NewPatient} from "./NewPatient";
import {ExistingPatient} from "./ExistingPatient";
import {EditPatient} from './EditPatient';

export const DialogNewPatient = (props: { patientToEdit?: Patient, onDone: (data?: Patient) => void }) => {
    const [stage, setStage] =
        useState<'EDIT' | 'NEW' | 'EXISTING'>(props.patientToEdit ? 'EDIT' : 'EXISTING')
    const subtitle = stage == 'EXISTING' ? 'Find an existing patient in the list.' :
        (stage == 'NEW' ? 'Complete patient\'s information.' : 'Edit patient\'s information.');
    if (stage == 'EXISTING' || stage == 'NEW') {
        return <SideDialog
            title={`Add Patient`}
            subtitle={subtitle}
            onClose={() => props.onDone()}
            primaryAction={undefined}
            showCancelButton={false}
        >
            {stage == 'EXISTING' &&
                <ExistingPatient goToCreateNewPatient={() => setStage('NEW')} cancel={props.onDone}/>}
            {stage == 'NEW' && <NewPatient patientToEdit={props.patientToEdit} cancel={props.onDone}/>}
        </SideDialog>
    } else {
        return <SideDialog
            title={`Edit Patient`}
            subtitle={subtitle}
            onClose={() => props.onDone()}
            primaryAction={undefined}
            showCancelButton={false}
        >
            <EditPatient patientToEdit={props.patientToEdit as Patient} cancel={props.onDone}/>
        </SideDialog>
    }

}