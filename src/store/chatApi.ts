import { chatSplitApi as api } from "./emptyApi";
export const addTagTypes = [
    "chats"
] as const;

const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getChatHistoryBySenderAndReceiver: build.query<
                getChatHistoryBySenderAndReceiverResponse,
                getChatHistoryBySenderAndReceiverArg>({
                    query: (queryArg) => ({
                        url: `$/chat/${queryArg.sender}`,
                        params: {
                            receiver: queryArg.receiver
                        }
                    }),

                    providesTags: ["chats"],
                }),
        }),
        overrideExisting: false,
    })

export type ChatMessage = {
    id: string;
    t1: string;
    t2: string;
    content: ChatContent[];
    read: boolean;
};
export type ChatContent = {
    sender: string,
    receiver: string,
    content: string
}

export const {
    useGetChatHistoryBySenderAndReceiverQuery
} = injectedRtkApi

export type getChatHistoryBySenderAndReceiverResponse = ChatMessage

export type getChatHistoryBySenderAndReceiverArg = {
    sender: string,
    receiver: string
}



export { injectedRtkApi as chatApi };