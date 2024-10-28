import styled, {css } from "styled-components";
import colors from "../../assets/colors"

interface ButtonProps {
  secondary?: boolean;
  important?: boolean;
  crucial?: boolean
}

const buttonStyles = css<ButtonProps>`
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    min-width: 80px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 5px;
    background-color: ${props =>
      props.important ? colors.important :
      props.secondary ? colors.secondary :
      props.crucial ? "transparent" : 
      colors.primary};
    border: ${props => 
          props.secondary ? `1px solid ${colors.primary}` : 
          props.crucial ? `1px solid ${colors.important}` :
          "none"};
    color: ${props => 
          props.secondary ? colors.primary : 
          props.crucial ? colors.important : 
          '#fff'};
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      border: ${props => 
          props.secondary ? `1px solid ${colors.primary}` : 
          props.crucial ? `1px solid ${colors.important}` :
          "none"};
        background-color: #cccccc;
    }
`;
export const Button = styled.button<ButtonProps>`
    ${buttonStyles}
`;