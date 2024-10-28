import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Choice, ChoiceList, ExamHeader, QuestionCard, QuestionList, QuestionText, MainContainer, Content, ExamInfo, ScoreContainer } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Topbar from '../../components/topbar';
import Logo from '../../components/top-down-logo';
import { Button } from '../../components/main-button/components';
import { Message } from '../../components/message/components';

interface Choice {
  choice_id: string;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: string;
  question_text: string;
  choices: Choice[];
}

interface Exam {
  exam_id: string;
  exam_name: string;
  teacher: {
    firstname: string;
    lastname: string;
  };
  subject: string;
  questions: Question[];
}

interface Results {
  [questionId: string]: boolean;
}

interface SelectedAnswers {
  [questionId: string]: string;
}

const ExamDetail: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [message, setMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [finalGrade, setFinalGrade] = useState(0);
  const URL = import.meta.env.VITE_API_URL;
  const { examId } = useParams();
  

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`${URL}exam/get-exams-by/${examId}`);
        const data = await response.json();
        setExam(data[0]);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    }
    fetchExam();
  }, [URL, examId])
  

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmit = () => {
    const allAnswered = exam?.questions.every((question) => selectedAnswers[question.question_id]);
  
    if (!allAnswered) {
      setMessage("Please answer all questions before submitting.");
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }
  
    const result: Results = {};
    let correctAnswersCount = 0;
    exam?.questions.forEach((question) => {
      const userAnswer = selectedAnswers[question.question_id];
      const correctAnswer = question.choices.find(choice => choice.is_correct)?.choice_id;
      result[question.question_id] = userAnswer === correctAnswer;

      if (userAnswer === correctAnswer) {
        correctAnswersCount += 1;
      }
    });
    
    const totalQuestions = exam?.questions.length || 0;
    const percentage = (correctAnswersCount / totalQuestions) * 100;
    const grade = Math.round(percentage);
    setFinalGrade(grade);
    setShowResults(true);
  };

  return (
    <MainContainer>
        {showErrorMessage && <Message error>{message}</Message>}
        <SideBar/>
        <Topbar/>
        <Logo/>
        <Content>
            <ExamHeader>
                <h2>{exam?.exam_name}</h2>
                <ExamInfo>
                    <p>Teacher: {exam?.teacher.firstname} {exam?.teacher.lastname}</p>
                    <p>Subject: {exam?.subject}</p>
                </ExamInfo>
            </ExamHeader>
            <QuestionList>
                {exam?.questions.map((question) => (
                <QuestionCard key={question.question_id}>
                    <QuestionText>{question.question_text}</QuestionText>
                    <ChoiceList>
                    {question.choices.map((choice) => (
                        <Choice
                        key={choice.choice_id}
                        onClick={() => handleAnswerSelect(question.question_id, choice.choice_id)}
                        selected={selectedAnswers[question.question_id] === choice.choice_id}
                        showResults={showResults}
                        correct={choice.is_correct}
                        >
                        {choice.choice_text}
                        </Choice>
                    ))}
                    </ChoiceList>

                </QuestionCard>
                ))}
            </QuestionList>
            {!showResults ? (
                <Button onClick={handleSubmit}>Submit Exam</Button> ) : <ScoreContainer>Your final score is {finalGrade}%</ScoreContainer>
            }
      </Content>
    </MainContainer>
  );
};

export default ExamDetail;
