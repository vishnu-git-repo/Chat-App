import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SERVER_URI;

export const useAuthStore = create((set, get) => ({
	authUser : null,
	isSigningUp : false,
	isLoggingIn : false,
	isUpdatingProfile : false,
	isCheckingAuth : true,
	onlineUsers: [],
	socket: null,

	checkAuth : async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({ authUser: res.data });
			get().connectSocket();
		} catch (error) {
			console.log("Error in checkAuth:", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signUp : async (data) => {
		set({isSigningUp: true})
		try {
			const res = await axiosInstance.post("/auth/signup",data);
			toast.success("Account Created");
			set({authUser: res.data});
			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		}finally{
			set({isSigningUp: false});
		}
	},

	logIn : async (data) => {
		set({isLoggingIn: true})
		try {
			const res = await axiosInstance.post("/auth/login",data);
			toast.success("Logging in Successfully");
			set({authUser: res.data});
			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		}finally{
			set({isLoggingIn : false});
		}
	},

	logOut: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged Out successfully");
			get().disconnectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	updateProfile : async (data) => {
		set({isUpdatingProfile : true});
		try{
			const res = await axiosInstance.post("/auth/update-profile",data);
			set({authUser: res.data});
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({isUpdatingProfile : false});
		}
	},

	connectSocket: () => {
		const { authUser,users } = get();
		if (!authUser || get().socket?.connected) return;
	
		const socket = io(BASE_URL, {
		  query: {
			userId: authUser._id,
			email: authUser.email,
		  },
		});
		socket.connect();
	
		set({ socket: socket });
	
		socket.on("getOnlineUsers", (userIds) => {
		  console.log("onlineUsers :",userIds);
		  set({ onlineUsers: userIds });
		});
	  },
	  disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	  },
	}));