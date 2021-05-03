import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Quiz from "./Quiz";
import { Container } from "./Grid";
import { Row, Col } from "./Grid";

export enum Categories {
  Science = 19,
  Movies = 11,
  Sports = 21,
  Politics = 24,
  Geography = 22,
  Celebreties = 26,
  Music = 12,
  Videogames = 15,
}

const CategoryButton = styled.div`
  background-color: black;
  color: white;
  cursor: pointer;
  text-align: center;
  padding: 10px 0;

  &:hover {
    background-color: rgb(0, 0, 0, 0.7);
  }
`;

const Title = styled.h1`
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const SelectionContainer = styled.div`
  margin: auto;
  padding: 10px;
  border: 5px solid black;
  border-radius: 10px;
`;

const SelectionTitle = styled.div`
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
`;

const CategorySelection: React.FC = () => {
  const [selectedCategory, setCategory] = useState<Categories | null>(null);

  const selectCategory = (category: number) => {
    setCategory(category);
  };

  const showSelection = () => {
    let categorySelection = [];

    for (let category in Categories) {
      if (isNaN(Number(category))) {
        categorySelection.push(
          <Col small={12} medium={6} big={3}>
            <CategoryButton
              onClick={() => selectCategory(Number(Categories[category]))}
              key={category}
            >
              {category}
            </CategoryButton>
          </Col>
        );
      }
    }

    return categorySelection;
  };

  return (
    <Container>
      {!selectedCategory && (
        <>
          <Title>Quiz- Save your coins</Title>
          <p>
            You start with 10 coins. For every question you have to distribute
            them to the answers. You take all the coins placed on the correct
            answer to the next question. If you have 0 coins the quiz is over.
            Try to survive 15 questions of increasing difficulty. <br />
            The questions are from the{" "}
            <a href="https://opentdb.com/">Open Trivia Database</a>.
          </p>
          <SelectionContainer>
            <SelectionTitle>Choose a category</SelectionTitle>
            <Row spacing={8}>{showSelection()}</Row>
          </SelectionContainer>
        </>
      )}
      {selectedCategory && (
        <Quiz category={selectedCategory} restart={() => setCategory(null)} />
      )}
    </Container>
  );
};

export default CategorySelection;
