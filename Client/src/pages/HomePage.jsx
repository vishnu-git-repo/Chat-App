import React from "react"
import { useMessageStore } from "../store/useMessageStore";
import SideBar from "../components/SideBar";
import EmptyMessage from "../components/EmptyMessage";
import MessageContainer from "../components/MessageContainer";

const HomePage = () => {
  
  const {selectedUser} = useMessageStore();
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />
            { (!selectedUser)? <EmptyMessage /> : <MessageContainer /> }
          </div>
        </div>
      </div> 
    
    </div>
  )
}

export default HomePage;
