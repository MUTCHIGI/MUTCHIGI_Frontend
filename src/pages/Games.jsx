import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import SearchBar from "../components/Public/SearchBar.jsx";
import Print_games from "../components/Games/Print_games.jsx";
import Footer from "../components/Public/Footer.jsx";

function Games() {
    return <div>
        <Header_top/>
        <Header_bottom quiz={false}/>
        <SearchBar multiplay={true}/>
        <Print_games/>
        <Footer/>
    </div>
}

export default Games;