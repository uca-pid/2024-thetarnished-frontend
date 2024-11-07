import styled, { keyframes } from 'styled-components';
import colors from '../../assets/colors';


interface MainContainerProps {
    showPopup: boolean;
}
export const MainContainer = styled.div<MainContainerProps>`
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
        opacity: ${({ showPopup }) => (showPopup ? 1 : 0)};
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
    align-items: center ;
    justify-content: center;

    max-height: 800px;
    overflow-y: auto;
    flex-wrap: wrap;

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
    scrollbar-color: white transparent;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 100% ;
        padding-top: 100px;
    }
`
export const PopupContent = styled.div`
    width: 100% ;
    height: 100% ;
    
    display: flex ;
    align-items: center ;
    justify-content: center ;
    color: rgb(43,84,52);
    max-height: 800px;
    overflow-y: auto;
    flex-wrap: wrap;

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
    scrollbar-color: white transparent;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 100% ;
        padding-top: 100px;
    }
`

export const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding-bottom: 5px;
    transition: transform 0.2s ease;
    width: 500px ;
    position: relative;

    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 550px){
        margin: auto ;
        margin-bottom: 20px;
        width: 300px ;
    }
`;

export const CardHeader = styled.div`
    color: #fff;
    border-radius: 6px 6px 0 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center ;
    padding: 0px;
    background-color: ${colors.primary} ;
`;

export const CardBody = styled.div`
    padding: 10px;
    height: 90%;
`;

export const CardInfo = styled.div`
    display: flex;
    flex-direction: column ;
    justify-content: space-between;
    align-items: center;

    p {
        margin: 0;
        color: ${colors.primary};
        font-weight: bold;
        font-size: 20px;
    }
`;

export const CardFooter = styled.div`
    color: ${colors.primary};
    display: flex;
    align-items: center ;
    justify-content: flex-end;
    text-align: center;
    width: 97%;
`

const skeletonLoading = keyframes`
    0% {
        background-color: transparent;
        opacity: 0.1;
    }
    50% {
        background-color: #adadad;
        opacity: 0.2;
    }
    100% {
        background-color: #939393;
        opacity: 0.3;
    }
`;

export const StaticSkeletonCard = styled.div`
  width: 500px ;
  height: 150px;
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  background-color: transparent;
  padding-bottom: 5px;
  margin-bottom: 20px;
  @media (max-width: 550px){
        margin: auto ;
        margin-bottom: 20px;
        width: 300px ;
    }
`;

export const LoadingSkeletonCard = styled.div`
  width: 500px ;
  height: 150px;
  border-radius: 8px;
  background-color: #d3d3d3;
  animation: ${skeletonLoading} 1.5s infinite ease-in-out;
  margin-bottom: 20px;
  padding-bottom: 5px;
  @media (max-width: 550px){
        margin: auto ;
        margin-bottom: 20px;
        width: 300px ;
    }
`;

export const ChatButton = styled.button`
    position: absolute;
    right: -60px;
    top: 40%;
    background-color: ${colors.primary};
    font-size: 1.5rem;
    padding: 5px 10px 5px 10px;
    border: none;

    &:hover {
        opacity: 0.7;
        cursor: pointer;
        
    }
`