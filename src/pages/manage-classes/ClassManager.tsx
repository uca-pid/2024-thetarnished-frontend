import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, LoadingSkeletonCard, CardsContainer, ChatButton } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { Button } from '../../components/main-button/components';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import CreateExamForm from '../../components/create-exam-form';
import { useNavigate } from 'react-router-dom';
import { CiChat1 } from "react-icons/ci";
import UserRating from './Rating';


interface Comment{
    comment_id: string;
    comment: string;
    commenter_name: string;
}

interface Reservation {
    id: string;
    student_name: string;
    subject_name: string;
    student_id: string;
    student_rating: number;
    datetime: string;
    group: boolean;
}

const ClassManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const navigateToChat = (studentid:string) =>{
        navigate(`/chat/${studentid}/${user?.id}`);
    }
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [studentComments, setStudentComments] = useState<Comment[]>([]);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isCreateExamPopupOpen, setIsCreateExamPopupOpen] = useState(false);
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getReservationsForTeacher = async () => {
            try {
                const response = await fetch(`${URL}reservation/teacher/${user?.id}`, {
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

        getReservationsForTeacher();
    }, [URL, user?.id, user?.token]);

    const totalCards = 4;
    const skeletonCards = totalCards - reservations.length;

    const handleFinishedClass = async (reservationId: string) => {
        setSelectedClassId(reservationId);
        try {
            setIsFinishing(true);
            const response = await fetch(`${URL}reservation/terminate/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    valor: 300,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== reservationId));
            setIsFinishing(false);
            setMessage('Class finished successfully');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }catch (error) {
            console.error(error);
            setMessage('Failed to finish class');
            setIsFinishing(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const cancelClass = async () => {
        try {
            setIsCanceling(true);
            const response = await fetch(`${URL}reservation/cancel/${selectedClassId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== selectedClassId));
            setIsCanceling(false);
            setMessage('Class canceled successfully');
            setIsPopupOpen(false);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }catch (error) {
            console.error(error);
            setMessage('Failed to cancel class');
            setIsCanceling(false);
            setIsPopupOpen(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const handleClassCancelation = (reservationId: string) => {
        setSelectedClassId(reservationId);
        setIsPopupOpen(true);
    };

    const handleCreateNewExam = (reservation: Reservation) => {
        setCurrentReservation(reservation)
        setIsCreateExamPopupOpen(true);
    };
    const handleShowComments = async (student_id: string) => {

        setShowCommentPopup(true);

        try {
            const response = await fetch(`${URL}students/get-comments/${student_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch student comments');
            }
            const data = await response.json();
            setStudentComments(data);
        }catch(error){ console.log(error)};
    };
  return (
    <MainContainer isCreateExamPopupOpen={isCreateExamPopupOpen} isPopupOpen={isPopupOpen} showCommentPopup={showCommentPopup}>
        {showMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
        <SideBar />
        <Logo/>
        <Topbar/>
        {isPopupOpen && (
        <PopUpContainer>
            <PopUp>
                <h2>Are you sure you want to cancel this class?</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button important onClick={cancelClass}>{isCanceling ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Cancel class"}</Button>
                    <Button secondary onClick={() => setIsPopupOpen(false)}>Keep class</Button>
                </div>
            </PopUp>
        </PopUpContainer>
        )}
        {showCommentPopup && (
        <PopUpContainer>
        <PopUp>
            <div>
                <h2>Student Comments</h2>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {studentComments.length > 0 ? (
                        studentComments.map((comment, index) => (
                            <div key={comment.comment_id} style={{ marginBottom: '10px', minHeight: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ flex: '1', margin: '0' }}>{comment.comment}</p>
                                    <h1 style={{ marginLeft: '100px', fontSize: '0.9em', color: '#666' }}>-{comment.commenter_name}</h1>
                                </div>
                                {index < studentComments.length - 1 && (
                                    <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '10px 0', width: '100%' }} />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments available.</p>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                <Button important onClick={() => setShowCommentPopup(false)}>Close</Button>
            </div>
        </PopUp>
    </PopUpContainer>
        )}
        {isCreateExamPopupOpen && currentReservation &&  (
        <CreateExamForm reservation={currentReservation} closePopup={() => setIsCreateExamPopupOpen(false)} />
        )}
        <Content>
            {isLoading ? (
                <CardsContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {Array.from({ length: totalCards }).map((_, index) => (
                        <LoadingSkeletonCard key={index} />
                    ))}
                </CardsContainer>
            ) : reservations.length > 0 ? (
                <CardsContainer>
                    {reservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader style={{ backgroundColor: reservation.group ? '#f2b36f' : '#3e7d44' }}>
                                <p>{reservation.subject_name} </p>
                                
                                
                            </CardHeader>
                            <CardBody>
                                <CardInfo>
                                <UserRating rating={reservation.student_rating} />
                                    <p>{reservation.student_name} </p>
                                    
                                    <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()} </p>  
                                </CardInfo>
                            </CardBody>
                            <CardFooter>
                                {new Date(reservation.datetime) < new Date() && (
                                <Button onClick={() => handleFinishedClass(reservation.id)}>
                                    {isFinishing && selectedClassId === reservation.id ? (
                                        <AnimatedLoadingLogo src={SimplifiedLogo} />
                                    ) : (
                                        "finished"
                                    )}
                                </Button>
                                
                                
                                )}
                                <ChatButton title='Initiate chat' onClick={()=> navigateToChat(reservation.student_id)}><CiChat1/></ChatButton> 
                                {new Date(reservation.datetime) > new Date() && (
                                    <Button onClick={() => handleCreateNewExam(reservation)}>Create exam</Button>
                                )}
                                 <div style={{ display: 'flex', width: '55%', justifyContent: 'flex-end' }}><Button secondary onClick={() => handleClassCancelation(reservation.id)}>Cancel</Button></div>
                               <Button onClick={()=>handleShowComments(reservation.student_id)}>Comments</Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {skeletonCards > 0 && 
                        Array.from({ length: skeletonCards }).map((_, index) => (
                            <StaticSkeletonCard key={`skeleton-${index}`} />
                    ))}
                </CardsContainer>
            ) : (
                <h2 style={{textAlign:"center"}}>You don't have any class to manage.</h2>
            )}
        </Content>
    </MainContainer>
  )
};

export default ClassManager;
