import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, LoadingSkeletonCard, ChatButton, PopupContent } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { useNavigate } from 'react-router-dom';
import { CiChat1 } from "react-icons/ci";
import { Button } from '../../components/main-button/components';
import { Title } from '../class-browser/components';
import InputUserRating from './InputRating';

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

interface UnratedClass {
    reservation_id: string;
    datetime: string;
    teacher: {
        firstname: string;
        lastname: string;
        teacherid: string;
    };
    studentrated: number;
    subject: string;
}

const MyClasses = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [unratedClasses, setUnratedClasses] = useState<UnratedClass[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeCommentPopup, setActiveCommentPopup] = useState<string | null>(null); // Track which comment popup is open
    const URL = import.meta.env.VITE_API_URL;
    const totalCards = 4;
    const skeletonCards = totalCards - reservations.length;

    const formatDate = (datetime: string) => {
        const date = new Date(datetime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    const navigateToChat = (teacherid: string) => {
        navigate(`/chat/${user?.id}/${teacherid}`);
    };

    useEffect(() => {
        const getReservationsForStudent = async () => {
            try {
                setIsLoading(true); 
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
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false); 
            }
        };

        getReservationsForStudent();
    }, [URL, user?.id, user?.token]);

    const togglePopup = async () => {
        if (showPopup) {
            window.location.reload();
        }
        setShowPopup(prev => !prev);

        if (!showPopup) {
            try {
                setIsCommentsLoading(true);
                const response = await fetch(`${URL}students/get-unrated-classes/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch unrated classes');
                }

                const data = await response.json();
                setUnratedClasses(data);
            } catch (error) {
                console.error('Error fetching unrated classes:', error);
            } finally {
                setIsCommentsLoading(false); 
            }
        }
    };

    const handlePostComment = async (teacherid: string) => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${URL}teachers/add-comment/${teacherid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ comment: newComment, commenter_name: `${user?.firstName} ${user?.lastName}` }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const data = await response.json();
            console.log('Comment posted successfully:', data);
            setNewComment('');
            setActiveCommentPopup(null); // Close comment popup after posting
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <MainContainer showPopup={showPopup}>
            <SideBar />
            <Logo />
            <Topbar />
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                }}>
                    <Title>Unrated Classes</Title>
                    {isCommentsLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                            <LoadingSkeletonCard />
                        </div>
                    ) : (
                        unratedClasses.length > 0 ? (
                            unratedClasses.map((unratedClass) => (
                                <PopupContent key={unratedClass.reservation_id}>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h3>Teacher: {unratedClass.teacher.firstname} {unratedClass.teacher.lastname} Class of {formatDate(unratedClass.datetime)}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                
                padding: '20px', // Increased padding for spacing
                borderRadius: '5px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <InputUserRating 
                    teacherid={unratedClass.teacher.teacherid} 
                    israted={unratedClass.studentrated} 
                    reservationid={unratedClass.reservation_id} 
                />
                <Button onClick={() => setActiveCommentPopup(unratedClass.reservation_id)}>Post Comment</Button>
            </div>
        </div>

        {activeCommentPopup === unratedClass.reservation_id && (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                minWidth: '300px',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1100,
                borderRadius: '10px',
            }}>
                <h3>Post a Comment for {unratedClass.teacher.firstname} {unratedClass.teacher.lastname}</h3>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button important onClick={() => setActiveCommentPopup(null)}>Close</Button>
                <Button onClick={() => handlePostComment(unratedClass.teacher.teacherid)}>Submit</Button>
                
                </div>
            </div>
        )}
    </div>
</PopupContent>

                            ))
                        ) : (
                            <h2 style={{ color: 'rgb(43,84,52)' }}>You have no past teachers that need rating!</h2>
                        )
                    )}
                    <Button important onClick={togglePopup}>Close</Button>
                </div>
            )}
            <Content>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div>
                        {isLoading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {Array.from({ length: totalCards }).map((_, index) => (
                                    <LoadingSkeletonCard key={index} />
                                ))}
                            </div>
                        ) : reservations.length > 0 ? (
                            <div>
                                <div><Button secondary onClick={togglePopup}>Rate Last Teachers</Button></div>
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
                                            <ChatButton title='Initiate chat' onClick={() => navigateToChat(reservation.Teacher.teacherid)}>
                                                <CiChat1 />
                                            </ChatButton>
                                        </CardFooter>
                                    </Card>
                                ))}
                                {skeletonCards > 0 &&
                                    Array.from({ length: skeletonCards }).map((_, index) => (
                                        <StaticSkeletonCard key={`skeleton-${index}`} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div>
                                <div><Button secondary onClick={togglePopup}>Rate Last Teachers</Button></div>
                                <h2 style={{ textAlign: "center" }}>You haven’t booked any class yet.</h2>
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </MainContainer>
    );
};

export default MyClasses;
