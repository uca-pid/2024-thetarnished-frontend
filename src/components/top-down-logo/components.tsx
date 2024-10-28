import styled from "styled-components"

export const ImageContainer = styled.div`
    position: absolute ;
    right: 10px;
    bottom: 5px;
    @media (max-width: 1000px) {  
        display: none;
    }
`

export const Image = styled.img`
    width: 40px;
    height: 40px;
`
