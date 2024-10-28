import {
  MainContainer,
  ScheduleContainer,
  Content,
  TableData,
  ButtonContainer,
  TutorialButtonContainer,
  TutorialButton,
} from "./components";
import SideBar from "../../components/sidebar/sidebar";
import { useEffect, useState, useMemo } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useAuth } from "../../auth/useAuth";
import TransparentLogo from "../../assets/Logo transparent.png";
import { Message } from "../../components/message/components";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import { Button } from "../../components/main-button/components";
import Topbar from "../../components/topbar";
import { ButtonsContainer } from "../login/components";
import Logo from "../../components/top-down-logo";
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { PiWarningCircle } from "react-icons/pi";

interface HourStatus {
  [key: string]: number;
}

interface ScheduleEntry {
  start_time: string;
  end_time: string;
  dayofweek: number;
  maxstudents: number;
}

const ManageSchedule: React.FC = () => {
  const [availableHours, setAvailableHours] = useState<HourStatus>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { user, updateUser } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(
    (user?.schedule)?.length === 0
  );
  const [isOnVacationPopUpOpen, setIsOnVacationPopUpOpen] = useState<boolean>(false);

  const daysOfWeekShort = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = String(i + 8).padStart(2, "0");
    return `${hour}:00:00`;
  });

  const URL = import.meta.env.VITE_API_URL;

  const teacherId = user?.id;

  useEffect(() => {
    setIsOnVacationPopUpOpen(user?.isOnVacation || false);
    if (user?.schedule) {
      const initialSchedule: HourStatus = {};
      user.schedule.forEach((s) => {
        const day = daysOfWeekShort[Number(s.dayofweek) - 1];
        const key = `${day} - ${s.start_time}`;
        initialSchedule[key] = s.maxstudents === "1" ? 1 : 5; 
      });
      setAvailableHours(initialSchedule);
    }
  }, [user?.schedule, daysOfWeekShort, user?.isOnVacation]);

  const toggleHour = (day: string, hour: string): void => {
    const key = `${day} - ${hour}`;
    setAvailableHours((prev) => {
      const newStatus = (prev[key] || 0) + 1;

      if (newStatus % 3 === 1 || newStatus % 3 === 2) {
        return { ...prev, [key]: newStatus % 3 };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSaveSchedule = async (availableHours: HourStatus) => {
    setIsSaving(true);
    const scheduleData: ScheduleEntry[] = Object.entries(availableHours)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, status]) => status > 0)
      .map(([hourString, status]) => {
        const [day, start_time] = hourString.split(" - ");
        const end_time = `${parseInt(start_time.split(":")[0]) + 1}:00:00`;
        const dayofweek = daysOfWeekShort.indexOf(day) + 1;
        const maxstudents = status === 1 ? 1 : 5;
        return { start_time, end_time, dayofweek, maxstudents };
      });

    try {
      const response = await fetch(
        `${URL}schedule/create/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ schedule: scheduleData }),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving schedule");
      }
      const result = await response.json();
      updateUser({ schedule: result });
      setIsSaving(false);
      setMessage("Schedule saved successfully");
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating schedule", error);
      setIsSaving(false);
      setMessage("Error creating schedule");
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCloseOnVacationPopup = () => {
    setIsOnVacationPopUpOpen(false);
  };

  return (
    <>
      {isPopupOpen && (
        <PopUpContainer>
          <PopUp>
            <h2>Availability schedule.</h2>
            <p>Here you can set your schedule.</p>
            <p>
              Click on the grid cells to select your available spots. The cells will change colors based on the selection:
            </p>
            <ul>
              <li style={{ color: "#8b9a93" }}><strong>Green:</strong> Indicates the time slot is available for an individual class.</li>
              <li style={{ color: "#f2b36f" }}><strong>Orange:</strong> Indicates a group class with up to five students.</li>
              <li style={{ color: "grey" }}><strong>White:</strong> Indicates the time slot is not available.</li>
            </ul>
            <p>
              Click again on a selected cell to unselect it. When you finish setting your availability, press the save button.
            </p>
            <ButtonsContainer>
              <Button secondary onClick={handleClosePopup}>
                Close
              </Button>
            </ButtonsContainer>
          </PopUp>
        </PopUpContainer>
      )}
      {isOnVacationPopUpOpen && (
        <PopUpContainer>
          <PopUp>
            <h2>You are currently on vacation.</h2>
            <p>
              During vacation period you can't set your schedule.
            </p>
            <ButtonsContainer>
              <Button secondary onClick={handleCloseOnVacationPopup}>
                Close
              </Button>
            </ButtonsContainer>
          </PopUp>
        </PopUpContainer>
        )
      }
      <MainContainer isPopupOpen={isPopupOpen} isOnVacationPopUpOpen={isOnVacationPopUpOpen}>
        {showSuccessMessage && <Message>{message}</Message>}
        {showErrorMessage && <Message error>{message}</Message>}
        <SideBar />
        <Logo />
        <Topbar />
        <Content>
          <ScheduleContainer>
            <table style={{ color: "black", paddingBottom: "20px" }}>
              <thead>
                <tr>
                  <th></th>
                  {daysOfWeekShort.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td style={{ paddingRight: "20px", textAlign: "right" }}>
                      {hour.slice(0, 5)}
                    </td>
                    {daysOfWeekShort.map((day) => {
                      const key = `${day} - ${hour}`;
                      const status = availableHours[key] || 0;
                      let backgroundColor = "";
                      const scheduleEntry = user?.schedule?.find((s) => 
                        s.start_time === hour && s.dayofweek === (daysOfWeekShort.indexOf(day) + 1).toString()
                      );
                      if (status === 1) backgroundColor = "#8b9a93";
                      else if (status === 2 || (scheduleEntry && scheduleEntry.maxstudents === "5" && status !== 0)) backgroundColor = "#f2b36f";
                      return (
                        <TableData
                          key={day}
                          onClick={() => toggleHour(day, hour)}
                          style={{ backgroundColor }}
                        >
                          {status !== 0 && <AiOutlineCheck />}
                        </TableData>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonContainer>
              {user?.isOnVacation ? 
              <Button secondary disabled>You are on vacation</Button>
              : 
              <Button onClick={() => handleSaveSchedule(availableHours)}>{isSaving ? (<AnimatedLoadingLogo src={TransparentLogo} />) : ("Save schedule")}</Button>
              }
              
            </ButtonContainer>
            <TutorialButtonContainer>
              <TutorialButton onClick={() => setIsPopupOpen(true)}><PiWarningCircle /></TutorialButton>
            </TutorialButtonContainer>
            
          </ScheduleContainer>
        </Content>
      </MainContainer>
    </>
  );
};

export default ManageSchedule;