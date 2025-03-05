import { noteSplitApi as api } from "./emptyApi";
// import { getTherapistIDFromCookie } from "./rehybApi";

export const addTagTypes = [
    "notes",
    "comments",
] as const;

const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getNotesByUserId: build.query<GetNotesByUserIdApiResponse, GetNotesByUserIdApiArg>({
                query: (queryArg) => ({ url: `/note/${queryArg._id}`, }),
                providesTags: ["notes"],
            }),
            addNotesByUserId: build.mutation<
                AddNotesByUserIdApiResponse,
                AddNotesByUserIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/note/${queryArg._id}`,
                    method: "POST",
                    body: queryArg,
                }),
                invalidatesTags: ["notes"],
            }),

            deleteNotesByNoteId: build.mutation<
                DeleteNotesByNoteIdResponse,
                DeleteNotesByNoteIdArg
            >({
                query: (queryArg) => ({
                    url: `/note/${queryArg._id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: ["notes"]
            }),



            getCommentsByUserIdOfToday: build.query<GetCommentsByUserIdApiResponse, GetCommentsByUserIdApiArg>({
                query: (queryArg) => ({ url: `/comment/getCommentOfSenderOfToday/${queryArg._id}`, }),
                providesTags: ["comments"],
            }),
            addCommentsByUserId: build.mutation<
                AddCommentsByUserIdApiResponse,
                AddCommentsByUserIdApiArg
            >({
                query: (queryArg) => ({
                    url: `/comment/${queryArg.sender}`,
                    method: "POST",
                    body: queryArg,
                }),
                invalidatesTags: ["comments"],
            }),

            deleteCommentsByCommentId: build.mutation<
                DeleteCommentsByCommentIdResponse,
                DeleteCommentsByCommentIdArg
            >({
                query: (queryArg) => ({
                    url: `/comment/${queryArg._id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: ["comments"]
            })

        }),
        overrideExisting: false,
    });
export { injectedRtkApi as noteApi };

export const {
    useGetNotesByUserIdQuery,
    useDeleteNotesByNoteIdMutation,
    useAddNotesByUserIdMutation,

    useGetCommentsByUserIdOfTodayQuery,
    useDeleteCommentsByCommentIdMutation,
    useAddCommentsByUserIdMutation,
} = injectedRtkApi


export type Note = {
    _id: string,
    userId: string,
    note: string,
}

export type AddNotesByUserIdApiResponse = Note;
export type AddNotesByUserIdApiArg = {
    _id: string,
    note: string;
    userType: string;
}

export type GetNotesByUserIdApiResponse = Note[];
export type GetNotesByUserIdApiArg = {
    _id: string,
}

export type DeleteNotesByNoteIdResponse = unknown;
export type DeleteNotesByNoteIdArg = {
    _id: string
}


export type Comment = {
    _id: string,
    sender: string,
    receiver: string,
    comment?: string,
}
export type AddCommentsByUserIdApiResponse = Comment;
export type AddCommentsByUserIdApiArg = {
    sender: string,
    receiver: string,
    comment: string,
    userType?: string;
}

export type GetCommentsByUserIdApiResponse = Comment[];
export type GetCommentsByUserIdApiArg = {
    _id: string,
}

export type DeleteCommentsByCommentIdResponse = unknown;
export type DeleteCommentsByCommentIdArg = {
    _id: string
}