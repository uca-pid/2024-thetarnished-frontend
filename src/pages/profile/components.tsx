import styled from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
    showTakeVacationPopup: boolean;
    showDeleteAccountConfirmation: boolean;
    showTerminateVacationPopup: boolean;
}


export const MainContainer =  styled.div<MainContainerProps>`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen, showTakeVacationPopup, showDeleteAccountConfirmation, showTerminateVacationPopup }) =>
            isPopupOpen || showTakeVacationPopup || showDeleteAccountConfirmation || showTerminateVacationPopup ? 1 : 0
        };
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);        
    }
`

export const Content = styled.div`
    width: 90% ;
    height: 100% ;
    margin-left: 100px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 100% ;
    }
`

export const ProfileCard = styled.div`
    position: relative;
    width: 500px;
    height: 700px;
    background-color: ${colors.secondary};
    display: flex;
    flex-direction: column;
    align-items: center ;
    border-radius: 50px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    @media (max-width: 1200px){
        margin-top: 80px;
    }

    @media (max-width: 550px){
        width: 90% ;
    }
`

export const UserImage  = styled.img`
    width: 200px;
    height: 200px;
    margin-top: 80px;
    border-radius: 50%;
    border: 3px solid ${colors.primary};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const UserName = styled.h1`
    color: ${colors.primary};
    margin-bottom: 0px;
    flex-wrap: nowrap;
    text-align: center;

    @media (max-width: 600px){
        font-size: 30px;
    }
`

export const UserEmail = styled.h2`
    color: ${colors.primary};
`

export const UserSubjects = styled.div`
    display: flex;
    width: 80%;
    max-width: 550px;
    align-items: center;
    justify-content: start;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px;
    scrollbar-width: thin;
    
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #e0e0e0;
    }

    scrollbar-width: thin;
    scrollbar-color: ${colors.primary} transparent;

    @media (max-width: 600px) {
        &::-webkit-scrollbar {
            display: none;
        }
        max-width: 300px;
    }
`;


export const Subject = styled.div`
    display: flex;
    padding: 10px;
    background-color: ${colors.primary};
    border-radius: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
    min-width: 80px;
    text-align: center;
    text-overflow: auto;
`

export const CardButtons = styled.div`
    position: absolute;
    display: flex;
    width: 90%;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);

`

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 500px;
    background-color: ${colors.secondary} ;
    border-radius: 30px ;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

    @media (max-width: 550px){
        width: 90% ;
    }
`

export const FormTitle = styled.h2`
    color: ${colors.primary};
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    z-index: 1;
`;
export const InputText = styled.label`
    font-size: 16px;
    color: ${colors.text};
    margin-bottom: 5px;
`;

export const Input = styled.input`
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    background-color: ${colors.secondary};
    color: ${colors.primary} ;

    &:focus {
        box-shadow: 0 0 5px ${colors.primary};
    }
`;

export const ButtonsContainer = styled.div`
    display: flex; 
    width: 100%;
    align-items: center;
    justify-content: center;
`

export const PasswordInput = styled.input`
    width: 250px;
    padding: 15px;
    background: ${colors.secondary};
    border: 1px solid ${colors.primary};
    border-radius: 5px;
    font-size: 16px;
    color: ${colors.primary};
`

export const VacationButtonContainer = styled.div`
    position: absolute ;
    top: 20px;
    right: 20px;
`
interface VacationButtonProps {
    important?: boolean;
}

export const VacationButton = styled.button<VacationButtonProps>`
    background-color: ${(props) => (props.important ? `${colors.important}` : `${colors.primary}`)};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    padding: 15px;
    font-size: 1.2rem;
`

export const CalendarContainer = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
`

export const UserRole = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    padding: 10px;
`;

export const Role = styled.div`
    display: flex;
    padding: 10px;
    background-color: ${colors.primary};
    border-radius: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
    text-overflow: auto;
`;
