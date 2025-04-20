import React from "react"
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import Sidebar from "../components/Sidebar";
import EmptyMessage from "../components/EmptyMessage";
import MessageContainer from "../components/MessageContainer";

const HomePage = () => {
  const {authUser,onlineUsers} = useAuthStore();
  const {selectedUser} = useMessageStore();
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            { (!selectedUser)? <EmptyMessage /> : <MessageContainer /> }
          </div>
        </div>
      </div> 
    
    </div>
  )
}

export default HomePage;
