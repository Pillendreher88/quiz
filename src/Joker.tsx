import React from "react";
import styled from "styled-components";

interface JokerProps {
  active: boolean;
  activateJoker:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  name: string;
  questionNr: number;
  difficulty: string;
  category: string;
}

const Container = styled.div`
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
  background-color: #f2f7f5;
  padding: 10px 15px;
`;

const Info = styled.span`
  margin-left: 10px;
`;

const InfoBox = styled.div`
  padding: 10px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.disabled ? "grey" : "#191970")};
  margin: auto;
  color: white;
  padding: 10px;
  width: 70px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s linear;
  position: relative;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  font-weight: 600;
  border: 2px solid transparant;
  outline: 0;

  &:hover {
    border: 2px solid #f78f0f;
  }
`;

const Level = styled.div<{
  number: number;
  currentLevel: number;
}>`
  background-color: ${(props) =>
    props.number < 5 ? "green" : props.number > 9 ? "red" : "yellow"};
  width: 16px;
  height: 16px;
  border: 1px solid black;
`;

const Levelbar = styled.div`
  display: flex;
  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;
  justify-content: flex-end;

  @media only screen and (min-width: 600px) {
    flex-grow: 0;
    max-width: 50%;
    flex-basis: 50%;
  }
`;

const Diamond = styled.div`
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom-color: black;
  position: relative;
  top: -8px;

  &:after {
    content: "";
    position: absolute;
    left: -8px;
    top: 8px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-top-color: black;
  }
`;

const Joker: React.FC<JokerProps> = ({
  active,
  activateJoker,
  name,
  questionNr,
  category,
  difficulty,
}) => {
  return (
    <Container>
      <Button onClick={activateJoker} disabled={!active}>
        {name}
      </Button>
      <InfoBox>
        <Info>{`Category: ${category}`}</Info>
        <Info>{`Difficulty: ${difficulty}`}</Info>
      </InfoBox>
      <Levelbar>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
          (value: any, index: number) => {
            return (
              <Level number={index} currentLevel={questionNr}>
                {questionNr > index && <Diamond />}
              </Level>
            );
          }
        )}
      </Levelbar>
    </Container>
  );
};

export default Joker;
