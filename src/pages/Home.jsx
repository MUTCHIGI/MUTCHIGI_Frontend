import Header_top from "../components/Header_top.jsx";
import Header_bottom from "../components/Header_bottom.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Print_quizlist from "../components/Print_quiz.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
    return <div>
        <Header_top/>
        <Header_bottom/>
        <SearchBar/>
        <Print_quizlist/>
        <Footer/>
    </div>
}

export default Home;