import styled from "styled-components";
import colors from "../../assets/colors";

export const MainContainer = styled.div`
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
    align-items: center ;
    justify-content: center;
`

export const ExamCard = styled.div`
    background-color: ${colors.secondary};
    color: ${colors.primary};
    width: 100%;
    max-width: 350px;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    }
`;

export const ExamTitle = styled.h3`
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${colors.primary};
    font-weight: 600;
`;

export const ExamInfo = styled.p`
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${colors.primary}cc;
`;

export const NoExamsMessage = styled.div`
    text-align: center;
    color: ${colors.primary};
    font-size: 1.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(5px);
`;
