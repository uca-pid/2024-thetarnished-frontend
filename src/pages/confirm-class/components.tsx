import styled, { keyframes } from "styled-components"
import colors from "../../assets/colors"

export const MainContainer =  styled.div`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
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

export const NotificationContainer = styled.div`
    padding: 50px;
    border: 3px solid ${colors.secondary};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const NotificationMessage = styled.h2`
    font-size: 2rem;
`

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const NotificationIcon = styled.div`
    font-size: 5.7rem;
    .svg{
        animation: ${checkmarkAnimation} 0.5s ease forwards;
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
   
`