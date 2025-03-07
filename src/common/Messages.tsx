import React, { useEffect, useRef, useState } from "react";
import { getTherapistIDFromCookie, useGetAllThePatientsAndCaregiversQuery } from "../store/rehybApi";
import { Loader } from "./Loader";
import { socket } from "../socket";
import { useGetChatHistoryBySenderAndReceiverQuery } from "../store/chatApi";
import axios from "axios";
import { getUrl } from "../urlPicker";

interface IUser
{
    id: string;
    Name: string;
}
interface IChatContent
{
    sender: string, receiver: string, time?: Date, content: string, id: String
}
interface IMessages
{
    _id: string,
    t1: string,
    t2: string,
    constents: IChatContent[],
    read: number
}
function ChatBox()
{
    const TherapistID = getTherapistIDFromCookie();
    const { data, isLoading, isError } = useGetAllThePatientsAndCaregiversQuery({ TherapistID: TherapistID! });

    const [newMessage, setNewMessage] = useState("");
    const [activeUser, setActiveUser] = useState<IUser | null>(null);
    const activeUserRef = useRef(activeUser);
    const [numberOfNewMsg, setNumberOfNewMsg] = useState(1);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<IMessages>();
    const lastMessageRef = useRef<HTMLDivElement | null>(null); // Reference for the last message

    const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
    const [chatHistory, setChatHistory] = useState<IChatContent[]>([])
    const [currentChatID, setCurrentChatID] = useState<String>('')
    const [users, setUsers] = useState<IUser[]>([]); // Declare users as a state
    const [filteredMessages, setFilteredMessages] = useState<IChatContent[]>([])
    useEffect(() =>
    {
        const fetchChatHistory = async () =>
        {
            if (!activeUser?.id) return;

            try
            {
                const response = await axios.get(`${getUrl('chat')}/chat/${TherapistID}`, {
                    params: {
                        receiver: activeUser.id,
                    },
                });
                setMessages(response.data)
                setCurrentChatID(response.data._id)
                setChatHistory(response.data.contents);
                setFilteredMessages(
                    response.data.contents.filter((msg: any) => msg.sender === activeUser?.id || msg.receiver === activeUser?.id)
                )
            } catch (err)
            {
                console.error(err);
            }
            finally
            {
                setIsChatLoading(false);
            }
        };

        fetchChatHistory();
    }, [TherapistID, activeUser]);
    useEffect(() =>
    {
        if (data)
        {
            const users = [...data.ActivePatients, ...data.Caregivers];
            setUsers(users); // Set users to state
        }
    }, [data]);

    // Update active user whenever users are fetched
    useEffect(() =>
    {
        if (users.length > 0)
        {
            setActiveUser(users[0]); // Default to the first user
            activeUserRef.current = users[0];
        }
    }, [users]); // Run when users state changes

    useEffect(() =>
    {
        socket.connect();

        socket.on("connected", () =>
        {
            console.info("Socket connected");
            socket.emit("signin", TherapistID);
        });

        const handleMessage = (data: IChatContent) =>
        {
            setChatHistory((prevChatHistory) =>
            {
                if (!prevChatHistory) return [data]; // Handle the case where chat history is initially empty

                const updatedChatHistory = [...prevChatHistory, data];

                setFilteredMessages(updatedChatHistory.filter(
                    (msg) =>
                        msg.sender === activeUserRef.current?.id ||
                        msg.receiver === activeUserRef.current?.id
                ));

                return updatedChatHistory;
            });
        };

        socket.on("message", handleMessage);

        return () =>
        {
            socket.off("message", handleMessage); // Remove event listener to prevent duplicates
            socket.disconnect();
        };
    }, [TherapistID]); // Removed `activeUser` from dependencies



    useEffect(() =>
    {
        // Scroll to the bottom of the chat when filteredMessages changes
        if (lastMessageRef.current)
        {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [filteredMessages]); // Trigger effect when filteredMessages changes


    if (isLoading) return <Loader />;
    const handleSendMessage = () =>
    {
        if (newMessage.trim())
        {
            const chat = { content: newMessage, sender: TherapistID!, receiver: activeUser!.id, time: new Date(), id: currentChatID }
            const updatedChatHistory = [...chatHistory, chat];
            setChatHistory([...chatHistory, chat]);
            setNewMessage("");
            socket.emit("message", chat);
            //TODO the activeUser become ndefined after rvreceiving
            setFilteredMessages(
                updatedChatHistory.filter((msg: any) => msg.sender === activeUser?.id || msg.receiver === activeUser?.id)
            )
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50">
            {/* Chat Icon */}
            <div
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer relative"
                onClick={() => setShowChat(!showChat)}
            >
                <img
                    className="w-12 h-12 rounded-full"
                    src={"../../assets/Snipaste_2024-12-05_11-54-45.png"}
                    alt="User avatar"
                />
                {numberOfNewMsg !== 0 && (
                    <div className="absolute rounded-full bg-red-600 w-8 h-8 flex items-center justify-center text-white -right-1 -top-1">
                        +{numberOfNewMsg}
                    </div>
                )}
            </div>

            {/* Chat Box */}
            {showChat && (
                <div
                    className="absolute bottom-20 right-0 bg-white border border-gray-300 rounded-lg shadow-lg flex"
                    style={{ width: 600, height: 500 }}
                >
                    {/* User List */}
                    <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-700 p-4 border-b">Users</h3>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`p-4 cursor-pointer ${activeUser?.id === user.id ? "bg-blue-100 text-blue-600 font-bold " : "hover:bg-gray-100 "}`}
                                onClick={() =>
                                {
                                    setActiveUser(user);
                                    activeUserRef.current = user;
                                    // Get chat history
                                }}
                            >
                                {user.Name}
                            </div>
                        ))}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow flex flex-col">
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-gray-700">{activeUser?.Name}</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowChat(false)}
                            >
                                ✖
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto px-4 py-2">
                            {isChatLoading ? (
                                <Loader />
                            ) : (
                                <div>

                                    {/* Render filtered messages */}
                                    {filteredMessages.map((msg: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`mb-2 ${msg.sender === TherapistID ? "text-right" : "text-left"}`}
                                        >
                                            <p
                                                className={`inline-block px-4 py-2 rounded-lg ${msg.sender === TherapistID ? "bg-blue-500 text-white ml-3" : "bg-gray-100 text-gray-700 mr-3"
                                                    }`}
                                            >
                                                {msg.content}
                                            </p>
                                        </div>
                                    ))}
                                    <div ref={lastMessageRef} />
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-300">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none"
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                                onClick={handleSendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBox;
