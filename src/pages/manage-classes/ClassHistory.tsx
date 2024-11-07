import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, StaticSkeletonCard, LoadingSkeletonCard, CardFooterSpaced, PaidInfo, CardsContainer } from './components';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/main-button/components';
import Topbar from '../../components/topbar';
import InputUserRating from './InputRating';
import { PopUp, PopUpContainer } from '../../components/popup/components';

interface Student {
    student_id: string;
    firstname: string;
    lastname: string;
    rating: number;
}
interface Comment{
    comment_id: string;
    comment: string;
    commenter_name: string;
}

interface Subject {
    subjectname: string;
}

interface Reservations {
    id: string;
    Student: Student;
    Subject: Subject;
    israted: number;
    datetime: string;
    group: boolean;
    paid:  boolean;
}

const ClassHistory = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [studentComments, setStudentComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const URL = import.meta.env.VITE_API_URL;
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
    

    useEffect(() => {
        const getReservationsForTeacher = async () => {
            try {
                const response = await fetch(`${URL}reservation/terminated-reservations-by/${user?.id}`, {
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
    const handlePostComment = async () => {
        if (!newComment.trim() || !currentStudentId) return; // Prevent empty comments
    
        try {
            const response = await fetch(`${URL}students/add-comment/${currentStudentId}`, {
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
    
            // Extract the actual comment data from `data.newComment`
            const newCommentData = data.newComment;
            
            if (newCommentData && newCommentData.comment && newCommentData.commenter_name) {
                setStudentComments((prevComments) => [
                    ...prevComments,
                    {
                        comment_id: newCommentData.comment_id || new Date().getTime().toString(), // Use a temporary ID if needed
                        comment: newCommentData.comment,
                        commenter_name: newCommentData.commenter_name
                    }
                ]);
            } else {
                console.error('Incomplete comment data received:', data);
            }
    
            setNewComment(''); // Clear input after posting
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };
    
    

    const handleShowComments = async (student_id: string) => {
        setShowCommentPopup(true);
        setCurrentStudentId(student_id);
    
        try {
            const response = await fetch(`${URL}students/get-comments/${student_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
            });
            if (!response.ok) {
                setStudentComments([]);
                throw new Error('Failed to fetch student comments');
            }
            const data = await response.json();
            console.log('Fetched comments:', data);
            setStudentComments(data); // Ensure data has comment_id, comment, commenter_name
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    return (
        <MainContainer isCreateExamPopupOpen={false} isPopupOpen={false} showCommentPopup={showCommentPopup}>
            <SideBar />
            <Topbar/>

            {showCommentPopup && (
            <PopUpContainer>
            <PopUp>
                <div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <h2>Add Comments</h2>
                <div >
                <Button important onClick={() => setShowCommentPopup(false)}>X</Button>
                </div>
                    </div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {studentComments.length > 0 ? (
    studentComments.map((comment, index) => (
        comment.comment && comment.commenter_name ? (
            <div key={comment.comment_id} style={{ marginBottom: '10px', minHeight: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ flex: '1', margin: '0' }}>{comment.comment}</p>
                    <h1 style={{ marginLeft: '100px', fontSize: '0.9em', color: '#666' }}>-{comment.commenter_name}</h1>
                </div>
                {index < studentComments.length - 1 && (
                    <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '10px 0', width: '100%' }} />
                )}
            </div>
        ) : null // Only render if comment and commenter_name are valid
    ))
) : (
    <p>No comments available.</p>
)}
                    </div>

                    {/* Input field for adding a new comment */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ flex: '1', padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <Button onClick={handlePostComment}>Post</Button>
                        
                    </div>
                </div>

                
            </PopUp>
            </PopUpContainer>
            )}
            <Content>
                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {Array.from({ length: totalCards }).map((_, index) => (
                            <LoadingSkeletonCard key={index} />
                        ))}
                    </div>
                ) : reservations.length > 0 ? (
                    <CardsContainer>
                        {reservations.map((reservation) => (
                            <Card key={reservation.id}>
                                <CardHeader style={{ backgroundColor: reservation.group ? '#f2b36f' : '#3e7d44' }}>
                                    <p>{reservation.Subject.subjectname}</p>
                                </CardHeader>
                                <CardBody>
                                    <CardInfo>
                                        <p>{`${reservation.Student.firstname} ${reservation.Student.lastname}`}</p>
                                        <InputUserRating studentid={reservation.Student.student_id} israted={reservation.israted} reservationid={reservation.id} />
                                        <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()}</p> 
                                    </CardInfo>
                                </CardBody>
                                
                                <CardFooterSpaced>
                                    <Button secondary onClick={() => handleShowComments(reservation.Student.student_id)}>Add comment</Button>
                                    <PaidInfo isPaid={reservation.paid}>{reservation.paid ? "Paid" : "In debt"}</PaidInfo>
                                    
                                    
                                </CardFooterSpaced>
                                
                            </Card>
                        ))}
                        {skeletonCards > 0 && 
                            Array.from({ length: skeletonCards }).map((_, index) => (
                                <StaticSkeletonCard key={`skeleton-${index}`} />
                        ))}
                    </CardsContainer>
                ) : (
                    <h2 style={{textAlign:"center"}}>You don't have any unpaid class.</h2>
                )}
            </Content>
        </MainContainer>
    )
}
export default ClassHistory