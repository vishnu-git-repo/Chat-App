import {create} from "zustand";
import {toast} from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useMessageStore = create( (set, get) =>  ({
    messages: [],
    users: localStorage.getItem("users")? JSON.parse(localStorage.getItem("users")) : [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,


    getUsers: async() => {
        const {users, appendNewUsersToLast} = get();
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/message/getuser");
            if (users.length === 0) {
                set({users: res.data});
                localStorage.setItem("users", JSON.stringify(res.data));
            }
            else appendNewUsersToLast(res.data);
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
            swapUserToFirstById(newMessage.senderId)
            return;
          }
    
          set({
            messages: [...get().messages, newMessage],
          });
          swapUserToFirstById(newMessage.senderId);
        });
    },
    
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    swapUserToFirstById: async(userId) => {
        const { users } = get();
        set({isUserLoading: true});
        const swappedUsers = [];
        for (let user of await users) {
            if (user._id === userId) {
                swappedUsers.unshift(user);
            }else {
                swappedUsers.push(user);
            }
        }
        localStorage.setItem("users", JSON.stringify(swappedUsers));
        set({ users: swappedUsers});
        set({isUserLoading: false});
    },

    appendNewUsersToLast: async(newUsers)=>{
        const {users} = get();
        set({isUserLoading: true});
        if(users.length !== newUsers.length){
            
            const temp = newUsers.filter( (newUser) => !users.some(existingUser => (existingUser._id === newUser._id) && (existingUser._id !== authUser._id) ));
            for( let user of temp){
                users.push(user);
            }
            localStorage.setItem("users",JSON.stringify(users));
            set({users : users});
        }
        set({isUserLoading: false});
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

