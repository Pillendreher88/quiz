import styled, { css } from "styled-components";

export const Col = styled.div<{
  small?: number;
  medium?: number;
  big?: number;
}>`
  
flex-grow: 0;
margin: 0;
box-sizing: border-box;

${props => props.small && css`
max-width: ${props.small/12* 100}%;
flex-basis: ${props.small/12* 100}%;
`}

${props => props.medium && css`
@media only screen and (min-width: 600px) {
  flex-grow: 0;
  max-width: ${props.medium/12 * 100}%;
  flex-basis: ${props.medium/12 * 100}%;
}
`}

${props => props.big && css`
@media only screen and (min-width: 900px) {
  flex-grow: 0;
  max-width: ${props.big/12* 100}%;
  flex-basis: ${props.big/12* 100}%;
}
`}

`;

export const Row = styled.div<{
  spacing?: number;
}>`
  
display: flex;
flex-wrap: wrap;
width: calc(100% + ${props => props.spacing ? props.spacing * 2 : 0}px);
margin: -${props => props.spacing}px;

& > ${Col}{
  padding: ${props => props.spacing}px;
}
`;
export const Container = styled.div`
  
margin-left: auto;
margin-right: auto;

padding-left: 10px;
padding-right: 10px;

@media only screen and (min-width: 900px) {
  max-width: 700px;
  padding-left: 15px;
  padding-right: 15px;
}
@media only screen and (min-width: 1200px) {
  max-width: 800px;
  padding-left: 20px;
  padding-right: 20px;
}

`;