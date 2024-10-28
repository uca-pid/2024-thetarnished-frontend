import SideBar from '../../components/sidebar/sidebar'
import { MainContainer, Content, ProfileCard, UserImage, UserInfo, UserName, UserEmail, UserSubjects, Subject, CardButtons, Form, Input, InputText, ButtonsContainer, FormTitle, FormContainer, PasswordInput, VacationButtonContainer, VacationButton, CalendarContainer, UserRole, Role } from './components';
import { Button } from '../../components/main-button/components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Message } from '../../components/message/components';
import { AnimatedLoadingLogo } from '../../components/animated-loading-logo/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { PopUp, PopUpContainer } from '../../components/popup/components';
import MultiAutocompleteInput from '../../components/multi-autocomplete-input';
import { FaUmbrellaBeach } from "react-icons/fa";
import DateRangeCalendarComponent from './calendar';
import dayjs from 'dayjs';

const Profile = () => {

    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [newSubjects, setNewSubjects] = useState<{ id: string; name: string; }[]>([]);
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showTakeVacationPopup, setShowTakeVacationPopup] = useState(false);
    const [isConfirmingVacation, setIsConfirmingVacation] = useState(false);
    const [showTerminateVacationPopup, setShowTerminateVacationPopup] = useState(false);
    const [isConfirmingTerminateVacation, setIsConfirmingTerminateVacation] = useState(false);

    const URL = import.meta.env.VITE_API_URL;

    const handlePasswordChange = () => {
        navigate('/change-password');
    };

    const handleDeleteAccountClick = () => {
        setShowDeleteAccountConfirmation(true);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setShowDeleteAccountConfirmation(false);
        setIsPopupOpen(false);
        setPassword('');
    };

    const handleSubjectsChange = (selected: { id: string; name: string; }[]) => {
        setNewSubjects(selected);
    }

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const res = await fetch(`${URL}authentication/delete-account/${user?.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                }),
            });

            if (!res.ok) {
                setMessage("Incorrect password");
                throw new Error('Failed to delete user');
            }

            const response = await fetch(`${URL}authentication/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email
                }),
            });

            if(response.status === 400) {
                setMessage('Cannot delete account with future or in debt reservations');
                throw new Error('Failed to delete user');
            }

            if (!response.ok) {
                setMessage("Could not delete account");
                throw new Error('Failed to delete user');
            }
            logout();
        } catch(error) {
            setIsDeleting(false);
            setPassword('');
            setShowErrorMessage(true);
            handleClosePopup();
            setTimeout(() => {
                setShowErrorMessage(false)
            }, 3000);
            console.error(error);
        }
    };

    const handleProfileSave = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSaving(true);

        if (!firstName || !lastName) {
            setMessage('Please fill all fields.');
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            return;
        }
        const body = {
            newFirstName: firstName,
            newLastName: lastName,
            email: user?.email,
            subjects: newSubjects.map(subject => subject.id)
        }
        try{
            const response = await fetch(`${URL}authentication/edit-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                setMessage("Could not update profile");
                throw new Error('Failed to update profile');
            }
            setIsSaving(false);
            updateUser({
                firstName: firstName,
                lastName: lastName,
                subjects: newSubjects.map(subject => ({
                    subjectid: subject.id,
                    subjectname: subject.name
                }))
            });
            setIsEditing(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }catch(error){
            console.error(error);
            setIsEditing(false);
            setIsSaving(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }
    };

    const handleTakeVacation = async () => {
        setShowTakeVacationPopup(true);
    }

    const handleCancelTakeVacation = () => {
        setShowTakeVacationPopup(false);
    }

    const handleConfirmVacation = async () => {
        try{
            setIsConfirmingVacation(true);
            const response = await fetch(`${URL}classes/assign-vacation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    teacherid: user?.id,
                    startdate: dateRange[0],
                    enddate: dateRange[1]
                }),
            });
            if(response.status === 403) {
                setMessage('Cannot take vacation during a reservation');
                throw new Error('Failed to take vacation');
            }
            if (!response.ok) {
                setMessage("Could not take vacation");
                throw new Error('Failed to take vacation');
            }
            updateUser({ isOnVacation: true });
            setIsConfirmingVacation(false);
            setShowTakeVacationPopup(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);    
        }catch(error){
            setIsConfirmingVacation(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error(error);
        }   
    }
    
    const handleTerminateVacation = async () => {
        setShowTerminateVacationPopup(true)
    }

    const handleCancelTerminateVacation = () => {
        setShowTerminateVacationPopup(false);
    }

    const handleConfirmTerminateVacation = async () => {
        try{
            setIsConfirmingTerminateVacation(true);
            const response = await fetch(`${URL}classes/stop-vacation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    teacherid: user?.id,
                }),
            });
            if (!response.ok) {
                setMessage("Could not terminate vacation");
                throw new Error('Failed to terminate vacation');
            }
            updateUser({ isOnVacation: false });
            setIsConfirmingTerminateVacation(false);
            setShowTerminateVacationPopup(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }catch(error){
            setIsConfirmingTerminateVacation(false);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
            console.error(error);
        }
    }

    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

    const handleDateChange = (newDateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => {
        const formattedDateRange: [string | null, string | null] = [
            newDateRange[0] ? newDateRange[0].format('YYYY-MM-DD HH:mm:ss') : null,
            newDateRange[1] ? newDateRange[1].format('YYYY-MM-DD HH:mm:ss') : null,
        ];
        setDateRange(formattedDateRange);
    };

    return (
        <>
        {showTerminateVacationPopup && (
            <PopUpContainer>
                <PopUp>
                    <h2>Are you sure you want to terminate your vacation?</h2>
                    <ButtonsContainer>
                        <Button onClick={handleConfirmTerminateVacation}>{isConfirmingTerminateVacation ? <AnimatedLoadingLogo/> : "Terminate vacation" }</Button>
                        <Button secondary onClick={handleCancelTerminateVacation}>Cancel</Button>
                    </ButtonsContainer>
                </PopUp>
            </PopUpContainer>
        )}
        {showTakeVacationPopup && (
            <PopUpContainer>
                <PopUp>
                    <h2>Please provide your vacation duration</h2>
                    <CalendarContainer>
                        <DateRangeCalendarComponent onDateChange={handleDateChange} />
                    </CalendarContainer>
                    <ButtonsContainer>
                        <Button onClick={handleConfirmVacation}>{isConfirmingVacation ? <AnimatedLoadingLogo/> : "Take vacation"}</Button>
                        <Button secondary onClick={handleCancelTakeVacation}>Cancel</Button>
                    </ButtonsContainer>
                </PopUp>
            </PopUpContainer>
            )}
            {showDeleteAccountConfirmation && (
            <PopUpContainer>
                <PopUp>
                    <h2>Are you sure you want to delete your account?</h2>
                    <p>Confirm your password:</p>
                    <PasswordInput placeholder="Password.." type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <ButtonsContainer>
                        <Button important onClick={handleDeleteAccount}>{isDeleting ? <AnimatedLoadingLogo/> : "Delete account"}</Button>
                        <Button secondary onClick={handleClosePopup}>Cancel</Button>
                    </ButtonsContainer>
                </PopUp>
            </PopUpContainer>
            )}
        <MainContainer isPopupOpen={isPopupOpen} showTakeVacationPopup={showTakeVacationPopup} showDeleteAccountConfirmation={showDeleteAccountConfirmation} showTerminateVacationPopup={showTerminateVacationPopup}>
            {showSuccessMessage && <Message>Your profile has been updated.</Message>}
            {showErrorMessage && <Message error>{message}</Message>}
            <SideBar/>
            <Topbar/>
            <Content>
                {!isEditing ? ( 
                <ProfileCard>
                    <UserImage src="https://imgs.search.brave.com/CidPMbEerqHyYiRV-k0nX7jmRCWkpObwF5BxWwlJKog/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE5/NDAwODEwL3Bob3Rv/L21yLXdoby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9aGFy/VHhXX0lSbDA2Q25o/LTRrbkNudHh3WWlx/V282eWlBeEpUcld5/U0ppRT0" alt="User Image" />
                    <UserInfo>
                        <UserName>{user?.firstName + ' ' + user?.lastName}</UserName>
                        <UserEmail>{user?.email}</UserEmail>
                        {user?.role === 'TEACHER' ? ( 
                            <UserSubjects>
                                {user?.subjects?.map((subject) => (
                                    <Subject key={subject.subjectid}>{subject.subjectname}</Subject>
                                ))}
                            </UserSubjects>
                        ) : (
                            <UserRole>
                                <Role>{user?.role}</Role>
                            </UserRole>
                        )}
                    </UserInfo>
                    {user?.role === 'TEACHER' && (
                        <VacationButtonContainer>
                            {!user?.isOnVacation ? 
                            <VacationButton onClick={handleTakeVacation}><FaUmbrellaBeach /></VacationButton> 
                            : 
                            <VacationButton important onClick={handleTerminateVacation}><FaUmbrellaBeach /></VacationButton>}
                        </VacationButtonContainer>
                    )}
                    <CardButtons>
                        <Button onClick={() => setIsEditing(true)}>Edit your profile</Button>
                        <Button important onClick={handlePasswordChange}>Change password</Button>
                        <Button important onClick={handleDeleteAccountClick}>Delete account</Button>
                    </CardButtons>
                </ProfileCard>
                ) : (
                <FormContainer>
                    <FormTitle>Edit your profile</FormTitle>
                    <Form onSubmit={handleProfileSave}>
                        <InputText>First name:</InputText>
                        <Input type="text" id="username" placeholder="Username..." value={firstName} onChange={(e) => setFirstName(e.target.value)} required ></Input>
                        <InputText>Last name:</InputText>
                        <Input type="text" id="username" placeholder="Username..." value={lastName} onChange={(e) => setLastName(e.target.value)} required ></Input>
                        {user?.role === 'TEACHER' && (
                        <MultiAutocompleteInput defaultValue={user?.subjects?.map(subject => ({ subjectid: subject.subjectid.toString(), subjectname: subject.subjectname }))} onSelect={handleSubjectsChange}/>
                        )}
                        <ButtonsContainer>
                            <Button type="submit">{isSaving ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Save"}</Button>
                            <Button type="button" onClick={() => setIsEditing(false)} important>Cancel</Button>
                        </ButtonsContainer>
                    </Form>
                </FormContainer> 
                )}
            </Content>
            <Logo/>
        </MainContainer>
        </>
    )
}
export default Profile