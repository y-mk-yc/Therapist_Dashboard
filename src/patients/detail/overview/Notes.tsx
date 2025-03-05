
import { useParams } from "react-router-dom";
import { FC, useState } from "react";
import { Dialog } from "../../../common/dialogs/Dialog";
import { Loader } from "../../../common/Loader";
import { AiOutlineClose } from "react-icons/ai";
import { useAddCommentsByUserIdMutation, useDeleteCommentsByCommentIdMutation, useGetCommentsByUserIdOfTodayQuery } from "../../../store/noteApi";
import { getIdFromCookie } from "../../../store/rehybApi";


export const Comments: FC = () =>
{
    const { patientId } = useParams();

    const therapistId = getIdFromCookie();

    const { data, isLoading } = useGetCommentsByUserIdOfTodayQuery({ _id: therapistId! });
    const [showingAddComment, setShowingAddComment] = useState(false);
    const [deleteComment] = useDeleteCommentsByCommentIdMutation();


    const onDeleteComment = async (commentId: string) =>
    {
        const result = await deleteComment({ _id: commentId! });
        if ('error' in result)
        {
            console.log(result.error);
        }
    };

    if (isLoading) return <Loader />

    if (!data) return <span>Failed loading comments.</span>

    return <>
        <div className={'card flex flex-col gap-4'}>
            <div className={'flex justify-between'}><h3>Comments</h3>
                <button className={'btn-primary'} onClick={() => setShowingAddComment(true)}>Leave a comment</button>
            </div>
            <div className={'flex gap-4 w-full flex-col overflow-y-auto max-h-40 pr-4'}>
                {data?.map(comment =>
                    <div key={comment._id} className={'flex flex-col p-3 bg-tertiary gap-2 rounded w-full relative'}>
                        <div className={'flex justify-between gap-2'}>
                            {/* <div className={`flex items-center gap-2`}>
                            <span className={'text-base font-semibold'}>Dr. {comment.TherapistName}</span>
                        </div> */}
                            {/* <span
                            className={'text-text-light text-sm'}>{(new Date(comment.Date)).toISOString()}
                        </span> */}
                        </div>
                        {comment.comment}
                        <AiOutlineClose onClick={() => onDeleteComment(comment._id)}
                            className={`w-4 h-4 cursor-pointer fill-gray-700 hover:bg-secondary hover:fill-gray-400 absolute top-0 right-0`} />
                    </div>
                )}
            </div>
        </div>
        {showingAddComment && <AddCommentDialog hide={() => setShowingAddComment(false)} patientID={patientId!} therapistId={therapistId!} />}
    </>
}

const AddCommentDialog: FC<{ hide: () => void, patientID: string, therapistId: string }> = (props) =>
{
    const [content, setContent] = useState('')
    const [addComment] = useAddCommentsByUserIdMutation();
    const onAddComment = async () =>
    {
        const result = await addComment({
            receiver: props.patientID,
            comment: content,
            sender: props.therapistId
        });
        if ('error' in result)
        {
            console.log(result.error);
        }
        props.hide();
    };

    return <Dialog onClose={props.hide} className={'max-w-sm gap-2'}>
        <h3>Add a comment</h3>
        <textarea
            rows={10}
            className={'w-full max-w-full'}
            value={content} onChange={(e) => setContent(e.target.value)} />
        <div className={'flex justify-center'}>
            <button className={'btn-primary w-5/12 flex justify-center'} onClick={onAddComment}>Add comment</button>
        </div>
    </Dialog>
}