import { useState } from 'react';
import { RiCloseLargeFill } from "react-icons/ri";
import { 
  Container, 
  StyledForm, 
  Label,
  RadioButton, 
  AddOptionButton, 
  RemoveOptionButton, 
  ActionButtons,
  CloseButton, 
  PopUp, 
  QuestionInput,
  OptionInput
} from "./components";
import { Button } from '../main-button/components';
import { GoPlus, GoDash  } from "react-icons/go";
import { AnimatedLoadingLogo } from '../animated-loading-logo/components';
import { Message } from '../message/components';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { useAuth } from '../../auth/useAuth';

interface Reservation {
  id: string;
  student_name: string;
  subject_name: string;
  datetime: string;
  group: boolean;
}

interface CreateExamFormProps {
  reservation: Reservation;
  closePopup: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}

interface Exam {
  reservationid: string;
  teacherid: string;
  exam_name: string;
  subject_name: string;
  questions: Question[];
}

const CreateExamForm = ({ reservation, closePopup }: CreateExamFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [isCreatingExam, setIsCreatingExam] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { user } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

   const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) => (i === index ? value : option));
    setOptions(updatedOptions);
  };

  const addCurrentQuestion = () => {
    if (currentQuestion && correctOption !== null) {
      const newQuestion: Question = {
        id: `${questions.length + 1}`,
        question: currentQuestion,
        options: options.filter(option => option),
        correctOption
      };
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
      setCurrentQuestion('');
      setOptions(['']);
      setCorrectOption(null);
      return newQuestion;
    }
    return null;
  };

  const handleAddQuestion = () => {
    addCurrentQuestion();
  };

  const handleCreateExam = async () => {
    const lastQuestionAdded = addCurrentQuestion(); 
    if ((questions.length > 0 || lastQuestionAdded) && correctOption !== null && user?.id) {
      const newExam: Exam = {
        reservationid: reservation.id,
        teacherid: user.id.toString(),
        exam_name: reservation.subject_name + " exam",
        subject_name: reservation.subject_name,
        questions: lastQuestionAdded ? [...questions, lastQuestionAdded] : questions,
      };
      setIsCreatingExam(true);
      try {
        const response = await fetch(`${URL}exam/create-exam`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newExam)
        });
        if (!response.ok) {
          throw new Error('Failed to create exam');
        } 
        setMessage("Exam created successfully");
        setShowSuccess(true);
        setIsCreatingExam(false);
        setTimeout(() => {
          setShowSuccess(false);
          closePopup();
        }, 3000);
      } catch {
        setIsCreatingExam(false);
        setMessage("Error creating exam");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
          closePopup();
        }, 3000);
      }
    }
  };  
  return (
    <Container>
        {showSuccess && <Message>{message}</Message>}
        {showError && <Message error>{message}</Message>}
      <PopUp>
        <h2>Create {reservation.subject_name} exam for {reservation.student_name}</h2>
        <StyledForm>
          <Label>Question:</Label>
          <QuestionInput
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Insert question"
          />
          <Label>Options:</Label>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <OptionInput
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Insert option ${index + 1}`}
              />
              {index === 0 ? (
                <AddOptionButton type="button" onClick={handleAddOption}><GoPlus/></AddOptionButton>
              ) : (
                <RemoveOptionButton type="button" onClick={() => handleRemoveOption(index)}><GoDash/></RemoveOptionButton>
              )}
              <RadioButton
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
              /> Correct option
            </div>
          ))}
        </StyledForm>        
        <ActionButtons>
            <Button secondary type="button" onClick={handleAddQuestion}>Add question</Button>
            <Button type="button" onClick={handleCreateExam}>{isCreatingExam ? <AnimatedLoadingLogo src={SimplifiedLogo}/> :  "Create exam"}</Button>
          </ActionButtons>    
        <CloseButton onClick={closePopup}>
          <RiCloseLargeFill />
        </CloseButton>
      </PopUp>
    </Container>
  );
};

export default CreateExamForm;
