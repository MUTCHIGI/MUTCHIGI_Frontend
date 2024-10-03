import Header_top from "../components/Header_top.jsx";
import Header_bottom from "../components/Header_bottom.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Print_quiz from "../components/Print_quiz.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
    return <div>
        <Header_top/>
        <Header_bottom/>
        <SearchBar/>
        <Print_quiz/>
        <Footer/>
    </div>
}

export default Home;