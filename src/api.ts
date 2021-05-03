import axios from "axios";

interface FetchProps{
  category?: number;
  difficulty?: "easy" | "medium" | "hard";
  amount: number;
}

export type ApiQuestionData = {
  correct_answer: string;
  incorrect_answers: [string, string, string];
  question: string;
  difficulty: string
}

export type QuestionData = ApiQuestionData & {
  answers: Array<string>
}

export const shuffleArray = (array: string[]) => {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp;
  }

  return array;
}

const transformData = (response: ApiQuestionData[]) : QuestionData[] => {
  const transformedResponse =  response.map((question: ApiQuestionData) => {

    let answers: Array<string>= question.incorrect_answers.concat(question.correct_answer);
    return {
      ...question,
      answers: shuffleArray(answers)
    } 
  })
  return transformedResponse;
}

const BASEURL ="https://opentdb.com/api.php";

 const fetchQuestions = async (props : FetchProps) => {
  let url = BASEURL + "?amount="+ props.amount + "&type=multiple";

  if(props.category) {
    url += "&category=" + props.category;
  }
  if(props.difficulty) {
    url += "&difficulty=" + props.difficulty;
  }

  try {
    const response = await axios(url);

    if (response && response.data && response.data.response_code === 0) {
          
      return transformData(response.data.results);
    }

    throw new Error('Error');
    
  }catch(error) {
    console.log(error);
    throw error;
  }
}

export default fetchQuestions;

