import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, LoadingSkeletonCard, ChatButton } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { CiChat1 } from "react-icons/ci";
import Chat from '../chat-manager/Chat';


interface Teacher {
    firstname: string;
    lastname: string;
    teacherid: string;
}

interface Subject {
    subjectname: string;
}

interface Reservations {
    id: string;
    datetime: string;
    Teacher: Teacher;
    Subject: Subject;
}

const MyClasses = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const URL = import.meta.env.VITE_API_URL;
    const navigateToChat = (teacherid:string) =>{
        setSelectedTeacherId(teacherid);
        setIsChatOpen(true);
    }

    useEffect(() => {
        const getReservationsForStudent = async () => {
            try {
                const response = await fetch(`${URL}reservation/student/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student reservations');
                }
                const data = await response.json();
                setReservations(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        getReservationsForStudent();
    }, [URL, user?.id, user?.token]);

    const totalCards = 4;
    const skeletonCards = totalCards - reservations.length;

    return (
        <MainContainer>
            <SideBar />
            <Logo/>
            <Topbar/>
            {isChatOpen ? (
                <Chat
                    teacherId={selectedTeacherId || ''}
                    studentId={`${user?.id}` || ''}
                    closeChat={() => setIsChatOpen(false)}
                />
            ) : (
                <Content>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {Array.from({ length: totalCards }).map((_, index) => (
                            <LoadingSkeletonCard key={index} />
                        ))}
                    </div>
                ) : reservations.length > 0 ? (
                    <div>
                        {reservations.map((reservation) => (
                            <Card key={reservation.id}>
                                <CardHeader>
                                    <p>{reservation.Subject.subjectname}</p>
                                </CardHeader>
                                <CardBody>
                                    <CardInfo>
                                        <p>Teacher: {reservation.Teacher.firstname} {reservation.Teacher.lastname}</p>  
                                    </CardInfo>
                                </CardBody>
                                <CardFooter>
                                        <p>{new Date(reservation.datetime).toLocaleString()}</p>     
                                <ChatButton title='Initiate chat' onClick={()=> navigateToChat(reservation.Teacher.teacherid)}><CiChat1/></ChatButton> 
                                </CardFooter>
                            </Card>
                        ))}
                        {skeletonCards > 0 && 
                            Array.from({ length: skeletonCards }).map((_, index) => (
                                <StaticSkeletonCard key={`skeleton-${index}`} />
                        ))}
                    </div>
                ) : (
                    <h2 style={{textAlign:"center"}}>You haven’t booked any class yet.</h2>
                )}
            </Content>
            )}
            
        </MainContainer>
    );
};

export default MyClasses;