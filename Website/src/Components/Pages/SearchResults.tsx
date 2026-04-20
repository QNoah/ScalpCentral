import '../Styling/Search.css';
import Navbar from '../PageParts/Navbar';

export function SearchResults() {

    return (
        <div className="retro-container-search">
            <Navbar />
            <div className="search-content">
                <div className="sidebar">

                </div>
                <div className="results-content">
                    <div className="results-header">

                    </div>
                    <div className="results-grid">

                    </div>
                </div>
            </div>
        </div>

    )
}

{/* <div className="retro-search-bar">
              <Search className="retro-search-icon" size={20} />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-search-input"
              />
            </div> */}