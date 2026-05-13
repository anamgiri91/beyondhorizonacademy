import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import About from "./pages/About.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import Courses from "./pages/Courses.jsx";
import Home from "./pages/Home.jsx";
import Topics from "./pages/Topics.jsx";
import TopicPage from "./pages/TopicPage.jsx";
import { useRoute } from "./hooks/useRoute.js";
import useAuth from "./hooks/useAuth.js";
import { useTheme } from "./hooks/useTheme.js";

function App() {
  const { page, navigate } = useRoute();
  const { darkTheme, toggleTheme } = useTheme();
  const auth = useAuth();

  const pages = {
    home: <Home onNavigate={navigate} />,
    about: <About />,
    courses: <Courses onNavigate={navigate} />,
    topics: <Topics onNavigate={navigate} />,
    sat: <TopicPage topic="sat" onNavigate={navigate} />,
    computerScience: <TopicPage topic="computerScience" onNavigate={navigate} />,
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header auth={auth} darkTheme={darkTheme} onNavigate={navigate} onToggleTheme={toggleTheme} />
      <main className="app-main" id="main-content">
        {pages[page] ?? <CourseDetail page={page} onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </>
  );
}

export default App;
