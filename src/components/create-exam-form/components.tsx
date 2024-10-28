import styled from "styled-components";
import colors from "../../assets/colors";

export const PopUpContainer = styled.div`
    z-index: 1000; 
    position: fixed;
    width: 100vw ;
    height: 100vh;
`

export const PopUp = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 50px;
    border-radius: 8px;
    z-index: 900; 
    color: ${colors.primary};
    border: 2px solid #ccc;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    width: 60vw;
    height: 70vh;

    @media (max-width: 1500px){
        height: 80vh;
    }
`
export const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.5rem;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;

    &:hover {
        opacity: 0.7;
    }
`

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const QuestionInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${colors.primary};
  font-size: 14px;
  width: 60%;
  background-color: transparent;
  color: ${colors.primary};
`;

export const OptionInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${colors.primary};
  font-size: 14px;
  width: 50%;
  background-color: transparent;
  color: ${colors.primary};
`;

export const RadioButton = styled.input`
  margin-left: 15px;
`;

export const AddOptionButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

export const RemoveOptionButton = styled.button`
  background-color: ${colors.important};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #d32f2f;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  position: absolute;
  gap: 10px;
  margin-top: 20px;
  right: 20px;
  bottom: 20px;
`;