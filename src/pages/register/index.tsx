import { useState } from "react"
import { MainContainer, LeftContainer, RightContainer, Image, FormContainer, Form, InputText, Input, FormTitle, Button, ToggleVisibilityButton, ButtonsContainer, AnimatedStars, Star, ForgotPass, AnimatedContainer, Checkbox } from "./components"
import { AiTwotoneEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/Logo.png"
import MultiAutocompleteInput from "../../components/multi-autocomplete-input";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { Message } from "../../components/message/components";

const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<{ id: string; name: string; }[]>([]);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const handleSelectOptions = (selected: { id: string; name: string; }[]) => {
        setSelectedOptions(selected);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsRegistering(true);
        try{
            if(!firstName || !lastName || !email || !password || !repassword || (isTeacher && selectedOptions.length === 0)) {
                setErrorMessage('Please fill all fields.');
                throw new Error('Please fill all fields.');
            }
            if(!(password === repassword)) {
                setErrorMessage('Passwords do not match.');
                throw new Error('Passwords do not match.');
            }
            const role = isTeacher ? 'TEACHER' : 'STUDENT';
    
            const response = await fetch(`${URL}authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    password: password,
                    subjects: selectedOptions.map(option => option.id),
                    role: role
                }),
            });

            if(response.status === 401){
                setErrorMessage('User already exists.');
                throw new Error('User already exists.');
            }
            else if (!response.ok) {
                setErrorMessage('Invalid information');
                throw new Error('Invalid information');
            }
            setIsRegistering(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate("/login");
            }, 3000);         

        }catch(error){
            console.error(error);
            setIsRegistering(false);
        }
    }

    return(
        <MainContainer>
            {showSuccessMessage && <Message>You are now registered!</Message>}
            <LeftContainer>
                <Image src={Logo}></Image>
            </LeftContainer>
            <RightContainer>
            <AnimatedStars xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                <Star cx="100" cy="100" r="2" delay="2s"/>
                <Star cx="200" cy="200" r="2" delay="0s"/>
                <Star cx="300" cy="300" r="2" delay="1s"/>
                <Star cx="500" cy="100" r="2" delay="0s"/>
                <Star cx="600" cy="500" r="2" delay="0s"/>
                <Star cx="700" cy="300" r="2" delay="1s"/>
                <Star cx="100" cy="500" r="2" delay="2s"/>
                <Star cx="300" cy="600" r="2" delay="1s"/>
                <Star cx="650" cy="50" r="2" delay="1s"/>
            </AnimatedStars>
                <FormContainer>
                    <FormTitle>Welcome!</FormTitle>
                    <p style={{color: "red"}}>{errorMessage}</p>
                    <Form onSubmit={(event) => handleRegister(event)}>
                        <InputText>Name:</InputText>
                        <Input type="text" id="firstname" placeholder="Firstname..." value={firstName} onChange={(e) => setFirstName(e.target.value)} required ></Input>
                        <InputText>Surname:</InputText>
                        <Input type="text" id="lastname" placeholder="Lastname..." value={lastName} onChange={(e) => setLastName(e.target.value)} required ></Input>
                        <InputText>Email:</InputText>
                        <Input type="email" id="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required ></Input>
                        <InputText>Password:</InputText>
                        <div style={{ position: 'relative' }}>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="password" 
                                placeholder="Password..." 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                            <ToggleVisibilityButton
                                onClick={() => setIsVisible(!isVisible)}
                                type="button"
                            >
                                {isVisible ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
                            </ToggleVisibilityButton>
                        </div>
                        <InputText>Repeat password:</InputText>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="repassword" 
                                placeholder="Password..." 
                                value={repassword} 
                                onChange={(e) => setRepassword(e.target.value)} 
                                required
                            />
                        <InputText>Are you a teacher?</InputText>
                        <Checkbox type="checkbox" id="isTeacher" checked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)} />
                        <AnimatedContainer isTeacher={isTeacher}>
                            {isTeacher && (
                                <>
                                <MultiAutocompleteInput onSelect={handleSelectOptions}/>
                                </>
                            )}
                        </AnimatedContainer>
                        <ButtonsContainer>
                            <Button type="submit">{isRegistering ? <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Register"}</Button>
                            <ForgotPass to="/login">Already have an account?</ForgotPass>
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
        </MainContainer>
    )

}
export default Register;