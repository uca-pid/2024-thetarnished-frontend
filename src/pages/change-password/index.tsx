import { useState } from "react"
import { MainContainer, RightContainer, FormContainer, Form, InputText, Input, FormTitle, Button, ButtonsContainer, ToggleVisibilityButton } from "./components"
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/useAuth";
import { Message } from "../../components/message/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import { AiTwotoneEyeInvisible, AiOutlineEye } from "react-icons/ai";
import Logo from "../../components/top-down-logo";

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    const { user, isLoggedIn, logout } = useAuth();
    const URL = import.meta.env.VITE_API_URL;

    const handleGoBack = () => {
        navigate(-1);
    }

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userEmail = user?.email;
        setIsLoading(true);
        try{
            const response = await fetch(`${URL}authentication/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                    email: userEmail
                })
            });
            setIsLoading(false);
            if(!response.ok){
                throw new Error('Failed to change password');
            }

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                logout();
                navigate('/');
            }, 3000);   
        }catch(error){
            console.error(error);
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000);
        }

        
    }

    return(
        <MainContainer>
           {showSuccessMessage && <Message>Your new password has been saved</Message>}
           {showErrorMessage && <Message error>Could not update your password. Invalid credentials</Message>}
            <RightContainer>
                <FormContainer>
                    <FormTitle>Change your password</FormTitle>
                    <Form onSubmit={(event) => handleChangePassword(event)}>
                        <InputText>Your current password:</InputText>
                        <div style={{ position: 'relative' }}>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="password" 
                                placeholder="Password..." 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                required
                            />
                            <ToggleVisibilityButton
                                onClick={() => setIsVisible(!isVisible)}
                                type="button"
                            >
                                {isVisible ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
                            </ToggleVisibilityButton>
                        </div>
                        <InputText>Your new password:</InputText>
                        <Input type={isVisible ? 'text' : 'password'} id="password" placeholder="Password..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required ></Input>
                        <ButtonsContainer>
                            <Button type="submit">{isLoading ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Confirm"}</Button>
                            {isLoggedIn && <Button onClick={handleGoBack} secondary>Back</Button>}  
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
            <Logo/>
        </MainContainer>
    )

}
export default ChangePassword;