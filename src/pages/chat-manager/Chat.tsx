import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";
import { useAuth } from "../../auth/useAuth";
import styled from "styled-components";
import { Button } from "../../components/main-button/components";
import { InteractionBlocker } from "../../components/interaction-blocker/components";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import colors from "../../assets/colors";
import { RiCloseLargeFill } from "react-icons/ri";


interface Message {
  id: string;
  message: string;
  timestamp: Date; 
  studentId: string;
  teacherId: string;
  roomId: string;
  sender: string;
}

const socket: Socket = io("https://chat.fpenonori.com", {
  transports: ["websocket"],
  secure: true,
});

const Chat: React.FC<{ teacherId: string; studentId: string; closeChat: () => void }> = ({ teacherId, studentId, closeChat }) => {  
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [role, setRole] = useState("");
  const [studentName, setStudentName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const URL = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
    const fetchStudentName = async (id: string) => {
      try {
        const response = await fetch(
          `${URL}students/${id}`
        , { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user?.token}`,
          },
        });
        const student = await response.json();
        setStudentName(student.firstname +" "+ student.lastname);
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };
  
    const fetchTeacherName = async (id: string) => {
      try {
        const response = await fetch(
          `${URL}teachers/${id}`
          , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${user?.token}`,
            },
          });
        const teacher = await response.json();
        setTeacherName(teacher.firstname +" "+ teacher.lastname);
  
      } catch (error) {
        console.error("Error fetching teacher name:", error);
      }
    };
    if (studentId && teacherId) {
      fetchStudentName(studentId);
      fetchTeacherName(teacherId);
    }
    scrollToBottom();
  }, [user, messages, studentId, teacherId, URL]);


  useEffect(() => {
    if (studentId && teacherId) {
      socket.emit("joinRoom", { studentId, teacherId });
      socket.on("messageHistory", (history: Message[]) => {
        const filteredHistory = history.filter(
          (msg) => msg.message && msg.message.trim() !== ""
        );
        setMessages(filteredHistory);
        setIsLoading(false);
        scrollToBottom();
      });

      socket.on("message", (newMessage: Message) => {
        if (newMessage.message && newMessage.message.trim() !== "") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        }
      });
    }
    return () => {
      socket.off("message");
      socket.off("messageHistory");
    };
  }, [studentId, teacherId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        message,
        studentId: studentId!,
        teacherId: teacherId!,
        roomId: `${studentId}-${teacherId}`,
        sender: role === "STUDENT" ? studentId! : teacherId!,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCloseChat = () => {
    closeChat();
  };

  return (
    <MainContainer>
        {isLoading ? (<InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>) : (
        <Content>        
        <div className="chat-container">
          <div className="sender-name">
            <UserImage src="https://imgs.search.brave.com/CidPMbEerqHyYiRV-k0nX7jmRCWkpObwF5BxWwlJKog/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE5/NDAwODEwL3Bob3Rv/L21yLXdoby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9aGFy/VHhXX0lSbDA2Q25o/LTRrbkNudHh3WWlx/V282eWlBeEpUcld5/U0ppRT0" alt="User Image" />
            {role === "STUDENT" ? teacherName : studentName}<CloseButton onClick={handleCloseChat}><RiCloseLargeFill/></CloseButton></div>
          <div className="message-history" ref={chatContainerRef}>
          {messages.map((msg, index) => {
            const isSender =
              role === "STUDENT"
                ? String(msg.sender) === String(studentId)
                : String(msg.sender) === String(teacherId);
  
            const currentDate = new Date(msg.timestamp).toDateString();
            const previousDate =
              index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;
  
            let dateSeparator = null;
            const today = new Date().toDateString();
            const dateLabel = currentDate === today ? "Today" : currentDate;
  
            if (currentDate !== previousDate) {
              const serverMessage = {
                id: `server-${index}`,
                message: ` ${dateLabel}`,
                timestamp: new Date(msg.timestamp), 
                sender: "server",
              };
  
              dateSeparator = (
                <div key={`server-msg-${index}`} className="server-message">
                  <p className="server-message-text">
                    {serverMessage.message}
                  </p>
                </div>
              );
            }
  
            const time = new Date(msg.timestamp);
            const formattedTimestamp = `${String(time.getHours()).padStart(
              2,
              "0"
            )}:${String(time.getMinutes()).padStart(2, "0")}`;
  
            return (
              <React.Fragment key={index}>
                {dateSeparator}
                <p className={isSender ? "sender-message" : "other-message"}>
                  {msg.message}
                  <br />
                  <em
                    style={{
                      fontSize: "0.85em",
                      color: "#fff",
                      textAlign: "right",
                      display: "block",
                    }}
                  >
                    {formattedTimestamp}
                  </em>
                </p>
              </React.Fragment>
            );
          })}
        </div>
        <BottomBarContainer>
          <div className="chat-input">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message"
            />
          </div>
          <SendButton onClick={sendMessage}>Send</SendButton>
        </BottomBarContainer>
        </div>
      </Content>

      )}
    </MainContainer>
  );
};

const MainContainer =  styled.div`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
`

const Content = styled.div`
    width: 100% ;
    height: 100% ;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
`

const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.4rem;
    border: none;
    position: absolute;
    top: 5px;
    right: 10px;

    &:hover {
        opacity: 0.7;
        background-color: transparent ;
    }
`

const UserImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${colors.primary};
`

const BottomBarContainer = styled.div`
  display: flex;
  width: 95%;
  margin: auto;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
`
const SendButton = styled(Button)`
  background-color: ${colors.primary};
  height: 100%;
  border-radius: 0 30px 30px 0;
  display: flex;
  text-align: center;
`

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  color: #3e7d44;
  font-size: 1rem;
  border: none;
  margin-right: 10px;
  box-sizing: border-box;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`
export default Chat;
