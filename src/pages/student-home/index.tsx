import { Content, MainContainer, CardsWrapper, Card, CardSubject, SkeletonCard } from "./components";
import SideBar from "../../components/sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../../components/main-button/components";
import Topbar from "../../components/topbar";
import { SearchInput } from "../../components/search-input/components";
import Logo from "../../components/top-down-logo";
import { useAuth } from "../../auth/useAuth";

interface Subject {
  subjectid: number;
  subjectname: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const widthUmbral1 = 800;
  const widthUmbral2 = 450;
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const URL = import.meta.env.VITE_API_URL;
  const {user} = useAuth();

  const getItemsPerPage = (width: number) => {
    if (width > widthUmbral1) return 9;
    if (width > widthUmbral2) return 6;
    return 3;
  };

  const ITEMS_PER_PAGE = getItemsPerPage(pageWidth);

  const handleSubjectSearch = (subjectId: number, subjectName: string) => {
    navigate(`/class-browser/${subjectId}/${subjectName}`);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    const handleWidthChange = () => {
      setPageWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWidthChange);

    handleWidthChange();

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${URL}subject/all-subjects-dictated`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSubjects(data.results);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchSubjects();
    
    return () => {
      window.removeEventListener('resize', handleWidthChange);
    };
  }, [URL, user?.token]);

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubjects = filteredSubjects.slice(startIndex, endIndex);
  const skeletonCount = ITEMS_PER_PAGE - currentSubjects.length;

  return (
    <MainContainer>
      <SideBar />
      <Logo/>
      <Topbar/>
      <Content>
        {isLoading ? (
          <>
            <h2>Loading subjects...</h2>
            <CardsWrapper>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </CardsWrapper>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <SearchInput
                type="text"
                placeholder="Search by subject name"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <CardsWrapper>
              {currentSubjects.map(subject => (
                <Card key={subject.subjectid} onClick={() => handleSubjectSearch(subject.subjectid, subject.subjectname)}>
                  <CardSubject>{subject.subjectname}</CardSubject>
                </Card>
              ))}

              {Array.from({ length: skeletonCount }).map((_, index) => (
                <Card key={`skeleton-${index}`} isSkeleton={true} />
              ))}
            </CardsWrapper>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100px' }}>
              {currentPage > 1 && <Button onClick={handlePrevPage}>Previous</Button>}
              {currentPage < totalPages && <Button onClick={handleNextPage}>Next</Button>}
            </div>
          </>
        )}
      </Content>
    </MainContainer>
  );
};

export default Home;
