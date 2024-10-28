import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Content, Card, CardHeader, CardBody, CardInfo, CardFooter, StaticSkeletonCard, LoadingSkeletonCard, CardsContainer, NoScheduleAlertContainer, TimeFilterButton, FilterButtonsContainer } from './components';
import { useAuth } from '../../auth/useAuth';
import Topbar from '../../components/topbar';
import { Button } from '../../components/main-button/components';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/top-down-logo';
// import { PopUp, PopUpContainer } from '../../components/popup/components';

interface Reservations {
    id: string;
    student_name: string;
    subject_name: string;
    datetime: string;
    student_id: string;
}

const TeacherHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const URL = import.meta.env.VITE_API_URL;
    
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [timeFilter, setTimeFilter] = useState<'24h' | '3d' | '1w'>('1w');

    
    
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
                    throw new Error('Failed to fetch teacher reservations');
                }
                const data = await response.json();
                setReservations(data);
                setTimeout(() => {
                  setIsLoading(false);
                }, 3000);
                
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        if (user?.id) {
            getReservationsForTeacher();
        }
    }, [URL, user?.id, user?.token]);

    const handleGoToSchedule = () => {
        navigate("/manage-schedule")
    };

    const filterReservationsByTime = () => {
        const now = new Date().getTime();
        const timeIntervals: Record<string, number> = {
            '24h': 24 * 60 * 60 * 1000,
            '3d': 7 * 24 * 60 * 60 * 1000,
            '1w': Infinity ,
        };

        return reservations.filter((reservation) => {
            const reservationTime = new Date(reservation.datetime).getTime();
            return reservationTime >= now && reservationTime <= now + timeIntervals[timeFilter];
        });
    };

    const totalCards = 3;
    const filteredReservations = filterReservationsByTime();
    const skeletonCards = totalCards - filteredReservations.length;

    return (
        <MainContainer >
            <SideBar />
            <Logo/>
            <Topbar/>
            {user?.isActive === true ? (
                <Content>
                {(user?.schedule)?.length === 0 ? (
                  <NoScheduleAlertContainer>
                    <h2>In order for students to be able to book your classes, you need to set up your availability schedule.</h2>
                    <Button onClick={handleGoToSchedule}>Go to schedule</Button>
                  </NoScheduleAlertContainer>
  
                ) : (
                  <>
                  {isLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {Array.from({ length: totalCards }).map((_, index) => (
                              <LoadingSkeletonCard key={index} />
                          ))}
                      </div>
                  ) : (
                      <div style={{justifyContent: "center", alignItems:"center", textAlign: "center"}}>
                          <h1 style={{paddingTop:"30px", marginBottom:"5px"}}>Hello, {user?.firstName}!</h1>
                          {reservations.length > 0 ? (
                            <>
                            <h2>Here are your upcoming classes:</h2>
                            
                            <FilterButtonsContainer style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', gap:"10px" }}>
                              <TimeFilterButton onClick={() => setTimeFilter('24h')} active={timeFilter === '24h'}>Next 24 hours</TimeFilterButton>
                              <TimeFilterButton onClick={() => setTimeFilter('3d')} active={timeFilter === '3d'}>Next 7 days</TimeFilterButton>
                              <TimeFilterButton onClick={() => setTimeFilter('1w')} active={timeFilter === '1w'}>Next month</TimeFilterButton>
                            </FilterButtonsContainer>
  
                            <CardsContainer>
                                  {filteredReservations.map((reservation) => (
                                      <Card key={reservation.id}>
                                          <CardHeader>
                                              <p>{reservation.subject_name}</p>
                                          </CardHeader>
                                          <CardBody>
                                              <CardInfo>
                                                  <p>Student: {reservation.student_name}</p>  
                                              </CardInfo>
                                          </CardBody>
                                          <CardFooter>
                                              <p>{new Date(reservation.datetime).toLocaleString('en-US', {
                                                  year: 'numeric',
                                                  month: 'numeric',
                                                  day: 'numeric',
                                                  hour: 'numeric',
                                                  minute: 'numeric',
                                                  hour12: false
                                                  })}
                                              </p>
                                              
                                              
                                          </CardFooter>
                                      </Card>
                                  ))}
  {/*                                 {skeletonCards === 3 ? (<h2>You don’t have any pending classes for this time scale.</h2>) : (
                                      <> */}
                                      {skeletonCards > 0 && 
                                          Array.from({ length: skeletonCards }).map((_, index) => (
                                              <StaticSkeletonCard key={`skeleton-${index}`} />
                                      ))}
  {/*                                     </>
                                  )} */}
                              </CardsContainer>
                            </>
                          ) : (
                              <h2>You don’t have any pending classes.</h2>
                          )}
                      </div>
                  )}
                  </>
                  )}
              </Content>
            ) : (
                <Content>
                    <NoScheduleAlertContainer>
                        <h2>Your account is under evaluation, please be patient and await for approval.</h2>
                    </NoScheduleAlertContainer>
                </Content>
            )}
            
        </MainContainer>
    );
};

export default TeacherHome;
