import React from 'react';
import { NavbarContainer, NavbarLink, LogOutNavbarLink } from './components';
import { AiOutlineHome , AiOutlineForm , AiOutlineUser/* , AiOutlineTool */, AiOutlineSchedule, AiOutlineLogout/* , AiOutlineDatabase */, AiOutlineGroup } from "react-icons/ai";
import { PiExamLight } from "react-icons/pi";
import { useAuth } from '../../auth/useAuth';

const SideBar: React.FC = () => {

    const { user, logout } = useAuth();

    return (
        <NavbarContainer>
            {(user?.role === 'TEACHER') && (
                <>
                <NavbarLink title='Home' to="/teacher-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>

                {(user?.isActive === true) && (
                <>
                <NavbarLink title='Manage schedule' to="/manage-schedule" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineSchedule /></NavbarLink>
                <NavbarLink title='Manage classes' to="/manage-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineForm  /></NavbarLink>
                </>
                )}

                <NavbarLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser /></NavbarLink>
                </>
            )}

            {(user?.role === 'STUDENT') && (
                <>
                <NavbarLink title='Home' to="/student-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>
                <NavbarLink title='My classes' to="/my-classes" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineGroup  /></NavbarLink>
                <NavbarLink title='My exams' to="/exam-viewer" className={({ isActive }) => (isActive ? "active" : "")}><PiExamLight  /></NavbarLink>
                <NavbarLink title='My profile' to="/profile" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineUser /></NavbarLink>
                </>
            )}
            

            {(user?.role === 'ADMIN') && (
                <>
                <NavbarLink title='Home' to="/admin-home" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineHome /></NavbarLink>
                </>
            )}
            
            {/* <NavbarLink title='Settings' to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><AiOutlineTool /></NavbarLink> */}
            <LogOutNavbarLink to="/" onClick={logout}><AiOutlineLogout/></LogOutNavbarLink>
        </NavbarContainer>
    );
};

export default SideBar;
