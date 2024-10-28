import { Header, Features, Content, GlobalStyle, HowItWorks, Testimonials, Pricing, FAQ, Footer } from './components';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Content>
        <Header />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </Content>
    </>
  );
};

export default App;
