import React, { useState } from "react";
import styled from "styled-components";
import coinImage from "./coin.svg";
import { Row, Col } from "./Grid";

interface CardProps {
  question: string;
  isOver: boolean;
  userAnswer: AnswerSpread | null;
  correctAnswer: string;
  answers: string[];
  coins: number;
  questionNr: number;
  hiddenAnswers: string[] | null;
  lockAnswer: (answer: AnswerSpread) => void;
  showNextQuestion:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  restart:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
}

export type AnswerSpread = [number, number, number, number];

const Question = styled.div`
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #b0e0e6;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 3px solid black;
  padding: 10px;
`;
const AnswersContainer = styled(Row)`
  background-color: #b0e0e6;

  & > ${Col} {
    padding: 10px;
  }
`;

const Answer = styled.button<{
  correct: boolean;
  chosenByUser: boolean;
  selectedByUser: boolean;
  canceled: boolean;
}>`
  ${(props) =>
    props.selectedByUser
      ? "background-color: white; color: black;"
      : "background-color: #191970; color: white;"}
  ${(props) =>
    props.chosenByUser
      ? props.correct
        ? "background-color: green; color: black;"
        : "background-color: red; color: black;"
      : ""};
  ${(props) =>
    props.correct && props.disabled
      ? "background-color: green; color: black;"
      : ""};
  display: flex;
  align-items:center;
  margin: auto;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  text-align: center;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  visibility: ${(props) => (props.canceled ? "hidden" : "visible")};
  transition: transform 0.2s linear;
  position: relative;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  font-weight: 600;
  outline: 0;

  ${(props) => (props.selectedByUser ? " transform: scale(0.97, 0.97);" : "")};

  &:after {
    content: "";
    box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
    border: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: all 0.2s linear;
    transition-property: opacity, transform;
    ${(props) =>
      props.selectedByUser ? " transform: scale(0.97, 0.97); opacity: 0" : ""};
  }
  }

  &:hover:after {
    box-shadow: 0px 2px 2px 1px white;
  }
`;

const NextButton = styled.button`
  padding: 10px;
  width: 100%;
  background-color: #00cc00;
  color: white;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  outline: 0;
`;

const CoinButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  margin-right: 5px;
  min-width: 50px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  outline: 0;
`;

const Container = styled.div``;
const CoinImage = styled.img`
  width: 20px;
  margin-left: 5px;
`;

const CoinDisplay = styled.div`
  width: 100px;
  font-size: 16px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Footer = styled.div`
  margin-top: 10px;
  min-height: 80px;
`;

const FooterRight = styled.div`
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  border: 0;
  position: relative;
  font-weight: 600;
  outline: 0;
`;

const FooterLeft = styled.div`
  background-color: black;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 600;
`;

const Feedback = styled.div`
  display: flex;
  margin-right: 1rem;
`;

export const QuestionCard: React.FC<CardProps> = ({
  question,
  restart,
  coins,
  userAnswer,
  answers,
  questionNr,
  correctAnswer,
  showNextQuestion,
  lockAnswer,
  hiddenAnswers,
  isOver,
}) => {
  const [distribution, setDistribution] = useState<AnswerSpread>([0, 0, 0, 0]);
  const [selectedAnswer, setSelected] = useState<number | null>(null);
  const [prevHiddenAnswers, setPrevHiddenAnswers] = useState<string[] | null>(
    null
  );

  if (prevHiddenAnswers !== hiddenAnswers) {
    if (hiddenAnswers !== null) {
      let spread: AnswerSpread = [...distribution];
      for (let i = 0; i < answers.length; i++) {
        if (
          answers[i] === hiddenAnswers[0] ||
          answers[i] === hiddenAnswers[1]
        ) {
          spread[i] = 0;
        }
      }
      if (
        selectedAnswer &&
        (hiddenAnswers[0] === answers[selectedAnswer] ||
          hiddenAnswers[0] === answers[selectedAnswer])
      ) {
        setSelected(null);
      }
      setDistribution(spread);
    }
    setPrevHiddenAnswers(hiddenAnswers);
  }

  const setMax = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let spread: AnswerSpread = [...distribution];
    if (selectedAnswer != null)
      spread[selectedAnswer] =
        distribution[selectedAnswer] + coins - getCoinsSet();
    setDistribution(spread);
  };

  const setAll = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let spread: AnswerSpread = [0, 0, 0, 0];
    if (selectedAnswer != null) spread[selectedAnswer] = coins;
    setDistribution(spread);
  };

  const increaseSet = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let spread: AnswerSpread = [...distribution];
    if (selectedAnswer === null) return;
    if (coins - getCoinsSet() > 0) {
      spread[selectedAnswer]++;
    }
    setDistribution(spread);
  };

  const decreaseSet = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let spread: AnswerSpread = [...distribution];
    if (selectedAnswer === null) return;
    if (spread[selectedAnswer] > 0) {
      spread[selectedAnswer]--;
    }
    setDistribution(spread);
  };

  const getCoinsSet = () => {
    if (userAnswer != null) {
      return 0;
    }

    return distribution.reduce((pV: number, cV: number) => {
      return cV + pV;
    });
  };

  const onConfirmClick = () => {
    setSelected(null);
    lockAnswer(distribution);
  };

  return (
    <Container>
      <Question dangerouslySetInnerHTML={{ __html: question }} />
      <AnswersContainer spacing={0}>
        {answers.map((answer: string, index: number) => (
          <Col small={12} medium={6}>
            <Answer
              onClick={() => setSelected(index)}
              disabled={userAnswer != null}
              correct={correctAnswer === answer}
              chosenByUser={userAnswer && userAnswer[index] > 0 ? true : false}
              selectedByUser={selectedAnswer === index}
              canceled={
                hiddenAnswers != null &&
                (hiddenAnswers[0] === answer || hiddenAnswers[1] === answer)
              }
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
              <CoinDisplay>
                {`${distribution[index]} X `}
                <CoinImage src={coinImage} alt="coins" />
              </CoinDisplay>
            </Answer>
          </Col>
        ))}
      </AnswersContainer>
      <Footer>
        <Row spacing={10}>
          <Col small={12} medium={3}>
            {
              <FooterLeft>
                <span>Coins</span>
                <CoinDisplay>
                  {`${coins - getCoinsSet()} X `}
                  <CoinImage src={coinImage} alt="coins" />
                </CoinDisplay>
              </FooterLeft>
            }
          </Col>
          <Col small={12} medium={9}>
            <FooterRight>
              <Row spacing={6}>
                {!userAnswer &&
                  (selectedAnswer != null ? (
                    <>
                      <Col small={12} medium={8}>
                        <CoinButton onClick={setMax}>Max</CoinButton>
                        <CoinButton onClick={setAll}>All</CoinButton>
                        <CoinButton onClick={increaseSet}>+</CoinButton>
                        <CoinButton onClick={decreaseSet}>-</CoinButton>
                      </Col>
                      <Col small={12} medium={4}>
                        {getCoinsSet() === coins ? (
                          <div>
                            <NextButton onClick={onConfirmClick}>
                              Confirm
                            </NextButton>
                          </div>
                        ) : null}
                      </Col>
                    </>
                  ) : (
                    <Col small={12} medium={8}>
                      Click on an answer to place your coins.
                    </Col>
                  ))}
                {userAnswer &&
                  (!isOver ? (
                    <>
                      <Col small={12} medium={8}>
                        <Feedback>{`You have ${coins} coins left`}</Feedback>
                      </Col>
                      <Col small={12} medium={4}>
                        <NextButton onClick={showNextQuestion}>
                          Next Question
                        </NextButton>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col small={12} medium={8}>
                        <Feedback>
                          Game Over! You have lost all your Coins.
                        </Feedback>
                      </Col>
                      <Col small={12} medium={4}>
                        <NextButton onClick={restart}>
                          Return to Menu
                        </NextButton>
                      </Col>
                    </>
                  ))}
              </Row>
            </FooterRight>
          </Col>
        </Row>
      </Footer>
    </Container>
  );
};
