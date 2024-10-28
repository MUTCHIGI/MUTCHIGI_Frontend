import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import SearchBar from "../components/Public/SearchBar.jsx";
import Print_quiz from "../components/Quiz/Print_quiz.jsx";
import Footer from "../components/Public/Footer.jsx";
import Playlist from "../components/Quiz/Playlist.jsx";

function Home() {
    return <div>
        <Header_top/>
        <Header_bottom/>
        <SearchBar multiplay={false}/>
        <Print_quiz/>
        <Footer/>
        {/*<Playlist/>*/}
    </div>
}

export default Home;