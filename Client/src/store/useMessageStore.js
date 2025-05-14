import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });

        try {
            const allUsersRes = await axiosInstance.get("/message/getUsers");
            const recentUsersRes = await axiosInstance.get("/message/getRecentUsers");

            const recentUserIds = recentUsersRes.data.map(user => user._id);

            const recentUsers = recentUserIds
                .map(userId => allUsersRes.data.find(user => user._id === userId))
                .filter(Boolean);

            const newUsers = allUsersRes.data.filter(user => !recentUserIds.includes(user._id));

            set({ users: [...recentUsers, ...newUsers] });

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    sendRecentUsers: async (_users) => {
        try {
            const userIds = _users.map(user => user._id);
            await axiosInstance.post("/message/setRecentUsers", { recentUsers: userIds });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });

        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (data) => {
        const { selectedUser, messages, swapUserToFirstById } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
            set({ messages: [...messages, res.data] });
            swapUserToFirstById(selectedUser._id);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { swapUserToFirstById } = get();
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            swapUserToFirstById(newMessage.senderId);

            if (get().selectedUser?._id === newMessage.senderId) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },

    unsubscribeFromMessages: () => {
        useAuthStore.getState().socket.off("newMessage");
    },

    swapUserToFirstById: async (userId) => {
        const { users, sendRecentUsers } = get();
        set({ isUserLoading: true });

        const swappedUsers = users.filter(user => user._id !== userId);
        const sender = users.find(user => user._id === userId);
        swappedUsers.unshift(sender);

        set({ users: swappedUsers });
        await sendRecentUsers(swappedUsers);
        set({ isUserLoading: false });
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));