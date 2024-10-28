import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, StaticSkeletonCard, LoadingSkeletonCard, CardFooter, PaidInfo, CardsContainer } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';

interface Student {
    firstname: string;
    lastname: string;
}

interface Subject {
    subjectname: string;
}

interface Reservations {
    id: string;
    Student: Student;
    Subject: Subject;
    datetime: string;
    group: boolean;
    paid:  boolean;
}

const ClassHistory = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const URL = import.meta.env.VITE_API_URL;

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

  return (
    <MainContainer isCreateExamPopupOpen={false} isPopupOpen={false}>
        <SideBar />
        <Topbar/>
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
                                    <p style={{fontSize:"15px", fontWeight:"normal"}}>{new Date(reservation.datetime).toLocaleString()}</p> 
                                </CardInfo>
                            </CardBody>
                            <CardFooter>
                                <PaidInfo isPaid={reservation.paid}>{reservation.paid ? "Paid" : "In debt"}</PaidInfo>
                            </CardFooter>
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