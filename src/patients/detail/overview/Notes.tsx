import {
    useGetUsermodelByPatientIdQuery,
    useUpdateNotesByPatientIdMutation,
    getTherapistIDFromCookie
} from "../../../store/rehybApi";
import {useParams} from "react-router-dom";
import {FC, useState} from "react";
import {Dialog} from "../../../common/dialogs/Dialog";
import {Loader} from "../../../common/Loader";
import {AiOutlineClose} from "react-icons/ai";
import oldGuy from "../../../common/old-guy.png";


export const Notes: FC = () => {
    const {patientId} = useParams();
    const {data, isLoading} = useGetUsermodelByPatientIdQuery({PatientID: patientId!});
    const [showingAddNote, setShowingAddNote] = useState(false);
    const [deleteNote] = useUpdateNotesByPatientIdMutation();

    const onDeleteNote = async (dateToDelete: string) => {
        const result = await deleteNote({PatientID: patientId!, dateToDelete: dateToDelete, action: 'Delete'});
        if ('error' in result) {
            console.log(result.error);
        }
    };

    if (isLoading) return <Loader/>

    if (!data) return <span>Failed loading notes.</span>

    return <>
        <div className={'card flex flex-col gap-4'}>
            <div className={'flex justify-between'}><h3>Notes</h3>
                <button className={'btn-primary'} onClick={() => setShowingAddNote(true)}>Leave a note</button>
            </div>
            <div className={'flex gap-4 w-full flex-col overflow-y-auto max-h-40 pr-4'}>
                {data.Notes?.map(note =>
                    <div key={note.Date} className={'flex flex-col p-3 bg-tertiary gap-2 rounded w-full relative'}>
                        <div className={'flex justify-between gap-2'}>
                            <div className={`flex items-center gap-2`}>
                                <img className={'rounded-full w-[26px] aspect-square'}
                                     src={note.TherapistPicture ?? oldGuy} alt={'Therapist'}/>
                                <span className={'text-base font-semibold'}>Dr. {note.TherapistName}</span>
                            </div>
                            <span
                                className={'text-text-light text-sm'}>{(new Date(note.Date)).toLocaleString()}
                            </span>
                        </div>
                        {note.Description}
                        <AiOutlineClose onClick={() => onDeleteNote(note.Date)}
                                        className={`w-4 h-4 cursor-pointer fill-gray-700 hover:bg-secondary hover:fill-gray-400 absolute top-0 right-0`}/>
                    </div>
                )}
            </div>
        </div>
        {showingAddNote && <AddNoteDialog hide={() => setShowingAddNote(false)} patientID={patientId!}/>}
    </>
}

const AddNoteDialog: FC<{ hide: () => void, patientID: string }> = (props) => {
    const [content, setContent] = useState('')
    const [addNote] = useUpdateNotesByPatientIdMutation();
    const onAddNote = async () => {
        const result = await addNote({
            PatientID: props.patientID,
            note: content,
            action: 'Add',
            TherapistID: getTherapistIDFromCookie()
        });
        if ('error' in result) {
            console.log(result.error);
        }
        props.hide();
    };

    return <Dialog onClose={props.hide} className={'max-w-sm gap-2'}>
        <h3>Add a note</h3>
        <textarea
            rows={10}
            className={'w-full max-w-full'}
            value={content} onChange={(e) => setContent(e.target.value)}/>
        <div className={'flex justify-center'}>
            <button className={'btn-primary w-5/12 flex justify-center'} onClick={onAddNote}>Add note</button>
        </div>
    </Dialog>
}