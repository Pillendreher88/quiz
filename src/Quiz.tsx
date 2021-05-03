import React, { useState, useEffect } from "react";
import "./App.css";
import { QuestionCard, AnswerSpread } from "./QuestionCard";
import fetchQuestions, { QuestionData, shuffleArray } from "./api";
import Joker from "./Joker";
import styled from "styled-components";
import { Categories } from "./CategorySelection";

const Container = styled.div``;

const SETTINGS = {
  questionsPerDifficulty: 5,
};

const getDifficulty = (questionNr: number) => {
  switch (Math.ceil((questionNr + 1) / SETTINGS.questionsPerDifficulty)) {
    case 1:
      return "easy";
    case 2:
      return "medium";
    case 3:
      return "hard";
    default:
      return "medium";
  }
};

interface QuizState {
  hasStarted: boolean;
  isOver: boolean;
  coins: number;
  fiftyFifty: boolean;
  category: number;
  difficulty: "easy" | "medium" | "hard";
  userAnswers: string[];
  questionNr: number;
  hiddenAnswers: string[] | null;
}

export const Quiz: React.FC<{
  category: number;
  restart: () => void;
}> = ({ category, restart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<AnswerSpread[]>([]);

  const [quizState, setState] = useState<QuizState>({
    hasStarted: false,
    isOver: false,
    fiftyFifty: true,
    category: category,
    coins: 10,
    difficulty: "easy",
    userAnswers: [],
    questionNr: 0,
    hiddenAnswers: null,
  });

  const activateFiftyFifty = (): void => {
    const hiddenAnswers = shuffleArray(
      questionData[quizState.questionNr].incorrect_answers
    ).slice(0, 2);

    setState((state) => {
      return { ...state, hiddenAnswers, fiftyFifty: false };
    });
  };

  const showNextQuestion = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const questionNr = quizState.questionNr + 1;
    const difficulty = getDifficulty(questionNr);
    setState((state) => {
      return { ...state, questionNr, difficulty };
    });
  };

  const onRestartButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    restart();
  };

  const lockAnswer = (answer: AnswerSpread) => {
    let coins = 0;
    for (let i = 0; i < 4; i++) {
      if (
        questionData[quizState.questionNr].correct_answer ===
        questionData[quizState.questionNr].answers[i]
      ) {
        coins = answer[i];
      }
    }

    setState((state) => {
      return { ...state, coins, isOver: coins < 1 };
    });

    if (!userAnswers[quizState.questionNr]) {
      setUserAnswers((answers) => {
        const result = [...answers, answer];
        return result;
      });
    }
  };

  useEffect(() => {
    const options = {
      difficulty: quizState.difficulty,
      category: quizState.category || undefined,
      amount: SETTINGS.questionsPerDifficulty,
    };
    setIsLoading(true);
    fetchQuestions(options)
      .then((response) => {
        setIsLoading(false);
        setQuestionData((data) => data.concat(response));
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, [quizState.difficulty, quizState.category]);

  return (
    <Container>
      <Joker
        name={"50:50"}
        active={quizState.fiftyFifty && !userAnswers[quizState.questionNr]}
        activateJoker={activateFiftyFifty}
        questionNr={quizState.questionNr}
        category={Categories[quizState.category]}
        difficulty={quizState.difficulty}
      />
      {questionData.length > 0 &&
      questionData[quizState.questionNr] &&
      !isLoading ? (
        <QuestionCard
          key={quizState.questionNr}
          lockAnswer={lockAnswer}
          coins={quizState.coins}
          showNextQuestion={showNextQuestion}
          questionNr={quizState.questionNr}
          answers={questionData[quizState.questionNr].answers}
          question={questionData[quizState.questionNr].question}
          correctAnswer={questionData[quizState.questionNr].correct_answer}
          hiddenAnswers={quizState.hiddenAnswers}
          userAnswer={
            userAnswers &&
            userAnswers[quizState.questionNr] &&
            userAnswers[quizState.questionNr]
          }
          isOver={quizState.isOver}
          restart={onRestartButtonClick}
        />
      ) : null}
    </Container>
  );
};

export default Quiz;
