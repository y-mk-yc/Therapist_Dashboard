import
{
    useGetNotesByUserIdQuery,
    useDeleteNotesByNoteIdMutation,
    useAddNotesByUserIdMutation,
    Note,
} from "../../store/noteApi";
import { getIdFromCookie } from "../../store/rehybApi";
import { FC, useEffect, useState } from "react";
import { Dialog } from "../../common/dialogs/Dialog";
import { Loader } from "../../common/Loader";
import axios from "axios";
import { getUrl } from "../../urlPicker";

export const DashboardNotes: FC = () =>
{
    const userId = getIdFromCookie();

    // const [data, setData] = useState<Note[] | null>(null);

    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    const { data, isLoading } = useGetNotesByUserIdQuery({ _id: userId! });

    const [showingAddNote, setShowingAddNote] = useState(false);
    // const [addNote, { isLoading: isAdding }] = useAddNotesByUserIdMutation();
    const [deleteNote, { isLoading: isDeleting }] = useDeleteNotesByNoteIdMutation();
    if (isLoading) return <Loader />

    if (!data) return <span>Failed loading comments.</span>
    const onDeleteNote = async (noteId: string) =>
    {
        try
        {
            const result = await deleteNote({ _id: noteId });
            if ('error' in result)
            {
                console.error(result.error);
                alert("Failed to delete note.");
            } else
            {
                // refetch(); // Refetch notes after successful deletion
            }
        } catch (err)
        {
            console.error("Error deleting note:", err);
        }
    };
    // useEffect(() =>
    // {
    //     const fetchNotes = async () =>
    //     {
    //         try
    //         {
    //             const response = await axios.get(`${getUrl("note")}/note/${userId}`);
    //             console.log(response.data)
    //             setData(response.data); // Assuming response.data contains the notes
    //         } catch (err)
    //         {
    //             setError("Failed to load notes.");
    //         } finally
    //         {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchNotes();
    // }, []);
    // if (isLoading) return <div>Loading...</div>;
    // if (!data) return <div>No notes available.</div>;
    return (
        <>
            <div className="card flex flex-col gap-4">
                <div className="flex justify-between">
                    <h3>Notes</h3>
                    <button className="btn-primary" onClick={() => setShowingAddNote(true)}>
                        Leave a note
                    </button>
                </div>
                <div className="flex gap-4 w-full flex-col overflow-y-auto max-h-40 pr-4">
                    {data?.map((note) => (
                        <div key={note._id} className="flex flex-col p-3 bg-tertiary gap-2 rounded w-full relative">
                            <div className="flex justify-between gap-2">
                            </div>
                            <p>{note.note}</p>
                            <button
                                className="absolute top-0 right-0"
                                disabled={isDeleting}
                                onClick={() => onDeleteNote(note._id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {showingAddNote && (
                <AddNoteDialog
                    hide={() => setShowingAddNote(false)}
                    userId={userId!}
                />
            )}
        </>
    );
};

const AddNoteDialog: FC<{ hide: () => void; userId: string }> = (props) =>
{
    const [content, setContent] = useState("");
    const [addNote, { isLoading }] = useAddNotesByUserIdMutation();

    const onAddNote = async () =>
    {
        try
        {
            const result = await addNote({
                _id: props.userId,
                note: content,
                userType: "T",
            });
            if ('error' in result)
            {
                console.error(result.error);
                alert("Failed to add note.");
            } else
            {
                props.hide();
            }
        } catch (err)
        {
            console.error("Error adding note:", err);
        }
    };

    return (
        <Dialog onClose={props.hide} className="max-w-sm gap-2">
            <h3>Add a note</h3>
            <textarea
                rows={10}
                className="w-full max-w-full"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-center">
                <button
                    className="btn-primary w-5/12 flex justify-center"
                    onClick={onAddNote}
                    disabled={isLoading}
                >
                    {isLoading ? "Adding..." : "Add note"}
                </button>
            </div>
        </Dialog>
    );
};
