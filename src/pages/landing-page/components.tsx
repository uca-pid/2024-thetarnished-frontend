import styled, { keyframes } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import colors from '../../assets/colors';
import { FaArrowRightLong } from "react-icons/fa6";
import { BsTwitterX, BsFacebook, BsInstagram } from "react-icons/bs";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const Content = styled.div`
  width: 100vw;
`;

const HeaderSection = styled.header`
  padding: 40px;
  text-align: center;
  color: white;
  z-index: 0;
  background-color: ${colors.secondary};
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  transition: transform 0.3s ease;
  color: ${colors.primary};

  &:hover {
    transform: translateY(-5px);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 20px auto;
  color: ${colors.primary};
`;

const GetStartedButton = styled.button`
  background: ${colors.primary};
  color: ${colors.secondary};
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 10;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-3px);
  }
`;

const FeaturesSection = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 50px;
`;

const FeatureCard = styled.div`
  background: ${colors.secondary};
  padding: 20px;
  color: ${colors.primary};
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
`;

const StepsSection = styled.section`
  margin-top: 100px;
  text-align: center;
  z-index: 10;
`;

const StepsTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: ${colors.secondary};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepsList = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const StepCard = styled.div`
  background: ${colors.primary};
  padding: 20px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${colors.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StepTitle = styled.h4`
  font-size: 1.5rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
`;

const Arrow = styled.div`
  font-size: 2rem;
  color: ${colors.secondary};
  margin: 0 20px;
  transition: transform 0.3s ease;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const TestimonialsSection = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const TestimonialsTitle = styled.h2`
    color: ${colors.primary};
`

const TestimonialCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 500px;
  margin: 20px auto;
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: ${colors.primary};
`;

const TestimonialAuthor = styled.p`
  font-size: 1rem;
  font-weight: bold;
`;

interface AlternativeProps {
    alternative?: boolean
}

const PricingSection = styled.section`
  background-color: ${colors.secondary};
  color: white;
  padding: 50px 20px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;


const PricingCard = styled.div`
  background: ${colors.primary};
  border-radius: 8px;
  padding: 30px;
  width: 250px;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${colors.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;


const AlternativePricingCard = styled(PricingCard)`
  background: ${colors.secondary};
  border: 1px solid ${colors.primary};
`;


const PricingTitle = styled.h3<AlternativeProps>`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
`;

const PricingPrice = styled.p<AlternativeProps>`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
`;


const PricingDescription = styled.p<AlternativeProps>`
  font-size: 1rem;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
  margin-bottom: 20px;
  line-height: 1.5;
`;


const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  text-align: left;
  font-size: 1rem;
  color: ${colors.secondary};
`;

const AlternativeFeatures = styled.ul`
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
    text-align: left;
    font-size: 1rem;
    color: ${colors.primary};
`;

const Feature = styled.li`
  margin-bottom: 10px;
  &:before {
    content: '✔️';
    margin-right: 8px;
  }
`;


const ActionButton = styled.div<AlternativeProps>`
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
  color: ${(props) => (props.alternative ? colors.secondary : colors.primary)};
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FAQSection = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FAQTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: ${colors.primary};
`;

const FAQItem = styled.div`
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  max-width: 500px;
`;

const FAQQuestion = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  color: ${colors.secondary};
`;

interface ArrowIconProps {
  open: boolean;
}
const ArrowIcon = styled.div<ArrowIconProps>`
  margin-left: 10px;
  transition: transform 0.3s ease-in-out;
  ${({ open }) => open && `transform: rotate(180deg);`}
`;

const FAQAnswer = styled.div<ArrowIconProps>`

  max-height: ${({ open }) => (open ? "1000px" : "0px")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  font-size: 16px;
  color: ${colors.primary};
`;

const FooterSection = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 20px;
  background-color: black;
  color: white;
  font-size: 14px;
  text-align: center;
  width: 100%;
`;

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SocialLink = styled.a`
  color: white;
  font-size: 24px;
  transition: color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    color: #4CAF50;
    transform: scale(1.1);
  }
`;

const CopyrightText = styled.p`
  margin-top: 10px;
  font-size: 12px;
`;

export const AnimatedStars = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  
`;

const twinkling = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const floating = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
  
`;

interface StarProps extends React.SVGProps<SVGCircleElement> {
    delay?: string;
  }

export const Star = styled.circle<StarProps>`
  fill: white;
  opacity: 0.7;
  animation: ${twinkling} 5s infinite ease-in-out alternate, ${floating} 10s infinite ease-in-out;
  animation-delay: ${props => props.delay};
`;

export const Header = () => {
    const navigate = useNavigate();

    const getStarted = () => {
        navigate('/register');
    };
    return (
        <HeaderSection>
            <Title>Welcome to Link & Learn</Title>
            <Subtitle>Seamlessly connect students and teachers. Schedule, manage, and pay for classes, all in one place!</Subtitle>
            <GetStartedButton onClick={getStarted}>Get Started</GetStartedButton>
            <AnimatedStars xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                <Star cx="100" cy="100" r="2" delay="2s"/>
                <Star cx="200" cy="200" r="2" delay="0s"/>
                <Star cx="300" cy="300" r="2" delay="1s"/>
                <Star cx="500" cy="100" r="2" delay="0s"/>
                <Star cx="600" cy="500" r="2" delay="0s"/>
                <Star cx="700" cy="300" r="2" delay="1s"/>
                <Star cx="100" cy="500" r="2" delay="2s"/>
                <Star cx="300" cy="600" r="2" delay="1s"/>
                <Star cx="650" cy="50" r="2" delay="1s"/>
            </AnimatedStars>
        </HeaderSection>
    );
};

export const Features = () => (
  <FeaturesSection>
    <FeatureCard>
      <FeatureTitle>Effortless Class Scheduling</FeatureTitle>
      <FeatureDescription>Teachers and students can easily coordinate their availability and schedule classes in real-time.</FeatureDescription>
    </FeatureCard>
    <FeatureCard>
      <FeatureTitle>Class Reservation & Payment</FeatureTitle>
      <FeatureDescription>Reserve classes with just a few clicks and pay upfront to secure your spot in the class.</FeatureDescription>
    </FeatureCard>
    <FeatureCard>
      <FeatureTitle>Real-Time Notifications</FeatureTitle>
      <FeatureDescription>Receive instant updates about your classes, including confirmation, reminders, and cancellations.</FeatureDescription>
    </FeatureCard>
  </FeaturesSection>
);

export const HowItWorks = () => (
  <StepsSection>
    <StepsTitle>How It Works</StepsTitle>
    <StepsList>
      <StepCard>
        <StepTitle>Step 1: Set Your Availability</StepTitle>
        <StepDescription>Teachers can set their availability in real-time, allowing students to choose the best times.</StepDescription>
      </StepCard>
      <Arrow><FaArrowRightLong /></Arrow>
      <StepCard>
        <StepTitle>Step 2: Reserve Classes</StepTitle>
        <StepDescription>Students select their preferred class times and teachers confirm or cancel if needed.</StepDescription>
      </StepCard>
      <Arrow><FaArrowRightLong /></Arrow>
      <StepCard>
        <StepTitle>Step 3: Learn First, Pay Later</StepTitle>
        <StepDescription>Once the class is completed, instructors will prompt students to make the payment.</StepDescription>
      </StepCard>
    </StepsList>
  </StepsSection>
);

export const Testimonials = () => (
    <TestimonialsSection>
      <TestimonialsTitle>What Our Users Say</TestimonialsTitle>
      <TestimonialCard>
        <TestimonialText>"Link & Learn made scheduling and paying for my classes so easy. It's a game-changer!"</TestimonialText>
        <TestimonialAuthor>- Jane Doe, Student</TestimonialAuthor>
      </TestimonialCard>
      <TestimonialCard>
        <TestimonialText>"As a teacher, I love how simple it is to manage my availability and connect with students."</TestimonialText>
        <TestimonialAuthor>- John Smith, Teacher</TestimonialAuthor>
      </TestimonialCard>
    </TestimonialsSection>
  );

  export const Pricing = () => (
    <PricingSection>
      <PricingCard>
        <PricingTitle>Basic Plan</PricingTitle>
        <PricingPrice>Free</PricingPrice>
        <PricingDescription>
          Perfect for newcomers. Start exploring with limited features.
        </PricingDescription>
        <PricingFeatures>
          <Feature>Access to basic features</Feature>
          <Feature>Limited usage per month</Feature>
          <Feature>Email support</Feature>
        </PricingFeatures>
        <ActionButton>Start for Free</ActionButton>
      </PricingCard>
  
      <AlternativePricingCard>
        <PricingTitle alternative>Standard Plan</PricingTitle>
        <PricingPrice alternative>$9.99/month</PricingPrice>
        <PricingDescription alternative>
          Get more flexibility with additional features and better support.
        </PricingDescription>
        <AlternativeFeatures>
          <Feature>All Basic Plan features</Feature>
          <Feature>Access to premium tools</Feature>
          <Feature>Priority email support</Feature>
        </AlternativeFeatures>
        <ActionButton alternative>Select Plan</ActionButton>
      </AlternativePricingCard>
  
      <PricingCard>
        <PricingTitle>Premium Plan</PricingTitle>
        <PricingPrice>$19.99/month</PricingPrice>
        <PricingDescription>
          Everything you need for an advanced experience, with full support.
        </PricingDescription>
        <PricingFeatures>
          <Feature>All Standard Plan features</Feature>
          <Feature>24/7 support</Feature>
          <Feature>Dedicated account manager</Feature>
        </PricingFeatures>
        <ActionButton>Get Started</ActionButton>
      </PricingCard>
    </PricingSection>
  );
  

export const FAQ = () => {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
  
    return (
      <FAQSection>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        <FAQItem>
          <FAQQuestion onClick={() => setOpen1(!open1)}>
            How do I sign up?
            <ArrowIcon open={open1}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open1}>
            Simply click the 'Get Started' button at the top to create an account and begin.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen2(!open2)}>
            How do I reset my password?
            <ArrowIcon open={open2}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open2}>
            Go to the settings page and click "Reset Password" to begin the process.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen3(!open3)}>
            How can I change my email address?
            <ArrowIcon open={open3}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open3}>
            Is not possible to change your email address as this is the only way to verify your identity.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen4(!open4)}>
            Is there a mobile app available?
            <ArrowIcon open={open4}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open4}>
            No, but our app is fully compatible with mobile devices and can be accessed through any web browser.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen5(!open5)}>
            Can I upgrade my plan later?
            <ArrowIcon open={open5}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open5}>
            Absolutely! You can upgrade your plan at any time through the "Account Settings" page.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen6(!open6)}>
            How do I contact support?
            <ArrowIcon open={open6}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open6}>
            You can reach out to our support team by emailing linkandlearnonline@gmail.com.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen7(!open7)}>
            Are there any discounts for students?
            <ArrowIcon open={open7}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open7}>
            Yes! We offer a 20% discount for students. Simply use the code STUDENT20 at checkout.
          </FAQAnswer>
        </FAQItem>
      </FAQSection>
    );
  };

export const Footer = () => (
    <FooterSection>
      <SocialLinksContainer>
        <SocialLink href="#" target="_blank" aria-label="Facebook">
          <BsFacebook />
        </SocialLink>
        <SocialLink href="#" target="_blank" aria-label="Twitter">
          <BsTwitterX />
        </SocialLink>
        <SocialLink href="#" target="_blank" aria-label="Instagram">
          <BsInstagram />
        </SocialLink>
      </SocialLinksContainer>
      <CopyrightText>&copy; 2024 Link & Learn. All rights reserved.</CopyrightText>
    </FooterSection>
  );


  export const GlobalStyle = createGlobalStyle`
    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
      width: 100vw;
      background: rgb(89,185,99);
      background: linear-gradient(143deg, rgba(89,185,99,1) 0%, rgba(38,78,42,1) 35%, rgba(15,41,46,1) 84%);
    }
  
    h1, h2, h3, h4 {
      margin: 0;
      padding: 0;
    }
  
    p {
      margin: 10px 0;
    }
  `;