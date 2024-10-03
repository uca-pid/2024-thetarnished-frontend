import { useAuth } from "../../auth/useAuth";
import { useEffect, useState } from "react";
import { ButtonContainer, CardsContainer, Content, MainContainer, SearchBar, TeacherCard, TeacherInfo, TeacherName } from "./components";
import Logo from "../../components/top-down-logo";
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { Button } from "../../components/main-button/components";
import SideBar from "../../components/sidebar/sidebar";

interface Teacher {
    teacherid: number;
    firstname: string;
    lastname: string;
    email: string;
    signup_date: string;
}

const AdminHome = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [currentTeacherId, setCurrentTeacherId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);

    const { isLoggedIn, user } = useAuth();

    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "ADMIN") {
            window.location.href = "/";
        }
       const getInactiveTeachers = async () => {
       const response = await fetch(`${URL}admins/inactive-teachers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setTeachers(data);
       }
       getInactiveTeachers();
    }, [URL, isLoggedIn, user?.role]);

    const handleTeacherAccept = () => {
        try{
            fetch(`${URL}admins/activate-teacher/${currentTeacherId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Teacher accepted!");
        } catch (error) {
            console.log("Error accepting teacher: ", error);
        }
        setTeachers(teachers.filter(teacher => teacher.teacherid !== currentTeacherId));
        setIsPopupOpen(false);
    }

    const handleTeacherReject = (teacherId: number) => {
        setCurrentTeacherId(teacherId);
        setIsRejectPopupOpen(true);
    }

    const handleTeacherEnroll = (teacherId: number) => {
        setCurrentTeacherId(teacherId);
        setIsPopupOpen(true);
    } 

    const handleTeacherRejection = () => {
        try{
            fetch(`${URL}teachers/delete/${currentTeacherId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Teacher Rejected!");
        } catch (error) {
            console.log("Error rejecting teacher: ", error);
        }
        setTeachers(teachers.filter(teacher => teacher.teacherid !== currentTeacherId));
        setIsRejectPopupOpen(false);
    }

    const filteredTeachers = teachers.filter(teacher => 
        `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {isPopupOpen && (
                <PopUpContainer>
                    <PopUp>
                        <h2>You are about to enroll this teacher to the app. Are you sure?</h2>
                        <p>This teacher will be able to create, and give classes to students.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button onClick={handleTeacherAccept}>Accept</Button>
                            <Button secondary onClick={() => setIsPopupOpen(false)}>Close</Button>
                        </div>
                    </PopUp>
                </PopUpContainer>
            )}
            {isRejectPopupOpen && (
                <PopUpContainer>
                    <PopUp>
                        <h2>You are about to reject this teacher application. Are you sure?</h2>
                        <p>This teacher account will be deleted.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button important onClick={handleTeacherRejection}>Reject</Button>
                            <Button secondary onClick={() => setIsPopupOpen(false)}>Close</Button>
                        </div>
                    </PopUp>
                </PopUpContainer>
            )}
            <MainContainer isPopupOpen={isPopupOpen}>
                <Logo />
                <SideBar/>
                <Content>
                    <SearchBar 
                        type="text" 
                        placeholder="Search by name or surname" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <CardsContainer>
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => (
                                <TeacherCard key={teacher.teacherid}>
                                    <TeacherName>{teacher.firstname} {teacher.lastname}</TeacherName>
                                    <TeacherInfo>
                                        <p>Email: {teacher.email}</p>
                                        <p style={{ paddingLeft: "15px" }}>Joined at: {teacher.signup_date}</p>
                                    </TeacherInfo>
                                    <ButtonContainer>
                                        <Button onClick={() => handleTeacherEnroll(teacher.teacherid)}>Enroll</Button>
                                        <Button important onClick={() => handleTeacherReject(teacher.teacherid)}>Reject</Button>
                                    </ButtonContainer>
                                </TeacherCard>
                            ))
                        ) : (
                            <h1>No teachers found.</h1>
                        )}
                    </CardsContainer>

                </Content>
            </MainContainer>
        </>
    );
}

export default AdminHome;
