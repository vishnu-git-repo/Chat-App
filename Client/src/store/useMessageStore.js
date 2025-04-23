import {create} from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useMessageStore = create( (set, get) =>  ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,


    getUsers: async() => {
        const {users, appendNewUsersToLast} = get();
        set({isUserLoading: true});
        try {
            const allUsersRes = await axiosInstance.get("/message/getUsers");
            const recentUsersRes = await axiosInstance.get("/message/getRecentUsers");
            const oldUsers = recentUsersRes.data.filter( user => allUsersRes.data.includes(user));
            const newUsers = allUsersRes.data.filter( user => !oldUsers.includes(user));    
            set({users: oldUsers.concat(newUsers)});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading: false});
        }
    },

    sendRecentUsers: async() => {
        const { users } = get();
        set({isUserLoading: true});
        try {
            const userIds = [];
            users.forEach(user => {
                userIds.push(user._id);
            });
            const res = await axiosInstance.post("/message/setRecentUsers", {recentUsers: userIds});
            console.log(res.data);
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading: false});
        }
    },

    getMessages: async(userId) => {
        const {users} = get();

        set({isMessageLoading : true});
        try {
            const res = await axiosInstance.get("/message/"+userId);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading: false});
        }
    },

    sendMessage : async(data) => {
        const {selectedUser, messages, swapUserToFirstById} = get();
        try {
            const res = await axiosInstance.post("/message/send/"+selectedUser._id, data);
            set({messages: [...messages,res.data]});
            swapUserToFirstById(selectedUser._id);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser,swapUserToFirstById} = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) {
            swapUserToFirstById(newMessage.senderId);
          }else {
            set({messages: [...get().messages, newMessage],});
              swapUserToFirstById(newMessage.senderId);
          }
        });
    },
    
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    swapUserToFirstById: async(userId) => {
        const { users, sendRecentUsers } = get();
        set({isUserLoading: true});
        const swappedUsers = [];
        for (let user of await users) {
            if (user._id === userId) {
                swappedUsers.unshift(user);
            }else {
                swappedUsers.push(user);
            }
        }
        set({ users: swappedUsers});
        set({isUserLoading: false});
        sendRecentUsers();
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

