import styled from "styled-components";
import colors from "../../assets/colors";


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

export const ExamHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  
  @media (max-width: 1000px) {
    padding-top: 100px; 
  }
`;

export const ExamInfo = styled.div`
    display: flex;
    gap: 20px;
`

export const QuestionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 50%;
    max-height: 600px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    margin-bottom: 10px;

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
    scrollbar-color: ${colors.secondary} transparent;
`;

export const QuestionCard = styled.div`
  padding: 20px;
  background-color: ${colors.secondary};
  border-radius: 8px;
  color: ${colors.primary};
`;

export const QuestionText = styled.h4`
  margin-bottom: 10px;
`;

export const ChoiceList = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ChoiceProps {
  selected: boolean;
  showResults: boolean;
  correct: boolean;
}

export const Choice = styled.li<ChoiceProps>`
  margin-bottom: 5px;
  background-color: ${({ selected, showResults, correct }) => 
    showResults 
      ? (correct ? `${colors.light}` : (selected ? `${colors.important}` : `${colors.secondary}`))
      : (selected ? colors.primary : colors.secondary)
  };
  color: ${({ selected, showResults, correct }) => 
    showResults 
      ? (correct ? `${colors.secondary}` : (selected ? `${colors.secondary}` : `${colors.primary}`))
      : (selected ? colors.secondary : colors.primary)
  };
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ selected, showResults }) =>
      !showResults && !selected && `${colors.primary}90`};
  }
`;

export const ResultText = styled.p`
  margin-top: 10px;
  font-weight: bold;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  padding: 2px;
  text-align: center;
`;

export const ScoreContainer = styled.div`
    padding: 10px;
    background-color: ${colors.secondary};
    color: ${colors.primary};
    text-align: center;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: bold;
`