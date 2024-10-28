import { useNavigate } from 'react-router-dom';
import { Content, ExamCard, ExamInfo, ExamTitle, MainContainer } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Logo from '../../components/top-down-logo';
import Topbar from '../../components/topbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { FaChalkboardTeacher, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Notification from '../../components/notification';

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

const ExamViewer = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  const handleExamClick = (examId: string) => {
    navigate(`/exam/${examId}`);
  };
  
  useEffect(() => {
    const getAllExamsByStudentId = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}exam/get-student-exams-by/${user?.id}`);
        const data = await response.json();
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      getAllExamsByStudentId();
    }
  }, [URL, user?.id]);
  
  return (
    <MainContainer>
      <SideBar/>
      <Topbar/>
      <Logo/>
      {loading ? (
        <h1>loading</h1>
      ) : 
      <Content>
        {exams.length === 0 ? (
          <Notification alternative={true} message='No exams available at the moment.'/>
        ) : (
          <>
            {exams.map((exam, index) => (
              <motion.div
                key={exam.exam_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ExamCard onClick={() => handleExamClick(exam.exam_id)}>
                  <ExamTitle>{exam.exam_name}</ExamTitle>
                  <ExamInfo>
                    <FaChalkboardTeacher />
                    Teacher: {exam.teacher.firstname} {exam.teacher.lastname}
                  </ExamInfo>
                  <ExamInfo>
                    <FaBook />
                    Subject: {exam.subject}
                  </ExamInfo>
                  <ExamInfo>
                    <FaQuestionCircle />
                    Questions: {exam.questions.length}
                  </ExamInfo>
                </ExamCard>
              </motion.div>
            ))}
          </>
        )}
      </Content>
      }
    </MainContainer>
  );
};

export default ExamViewer;