import { useState } from 'react';
import { Search, Filter, TrendingUp, Zap, Flame, Droplet, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router';
import logoImage from '../../assets/imgs/hero.png';
import '../Styling/HomeStyles.css';
import Navbar from '../Utils/Navbar';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  trending: boolean;
  stock: number;
  artist?: string;
  deck?: string;
  type?: string;
}

const categories = [
  { id: 1, name: 'Fire', icon: Flame, color: '#FF6B35' },
  { id: 2, name: 'Water', icon: Droplet, color: '#4A90E2' },
  { id: 3, name: 'Electric', icon: Sparkles, color: '#F4D03F' },
  { id: 4, name: 'Grass', icon: Leaf, color: '#52B788' },
];

const products: Product[] = [
  {
    id: 1,
    name: 'Charizard VMAX',
    category: 'Fire',
    price: 1200,
    originalPrice: 400,
    image: 'https://storage.googleapis.com/images.pricecharting.com/ea2feaf756d181ca5a835e8f6fb60896f58f83fce599e57f0276b38a40de5a02/240.jpg',
    trending: true,
    stock: 1,
    artist: 'aky CJ',
    deck: 'Champion\'s Path',
    type: 'Fire',
  },
  {
    id: 2,
    name: 'Pikachu V',
    category: 'Electric',
    price: 45,
    originalPrice: 25,
    image: 'https://pokemeister.nl/cdn/shop/products/43_hires_2a01f414-4ac0-4b52-abd1-c9a9156726eb.png?v=1643673019&width=200',
    trending: true,
    stock: 5,
    artist: 'Mitsuhiro Arita',
    deck: 'Vivid Voltage',
    type: 'Electric',
  },
  {
    id: 3,
    name: 'Blastoise GX',
    category: 'Water',
    price: 85,
    originalPrice: 50,
    image: 'https://storage.googleapis.com/images.pricecharting.com/05a741d8eaa64049012b1f3e83149816c9b65bb7434d00dd00dd8a7a9068a7a9/240.jpg',
    trending: true,
    stock: 3,
    artist: '5ban Graphics',
    deck: 'Team Up',
    type: 'Water',
  },
  {
    id: 4,
    name: 'Venusaur VMAX',
    category: 'Grass',
    price: 120,
    originalPrice: 70,
    image: 'https://storage.googleapis.com/images.pricecharting.com/fzwc5obo2qofaer4/240.jpg',
    trending: true,
    stock: 4,
    artist: 'Planeta Mochizuki',
    deck: 'Champion\'s Path',
    type: 'Grass',
  },
  {
    id: 5,
    name: 'Raichu GX',
    category: 'Electric',
    price: 65,
    originalPrice: 40,
    image: 'https://storage.googleapis.com/images.pricecharting.com/0fc3999e14441935023081f70a2580d7d8b0e9dbe756ea12ec56d41c8b26b9b0/240.jpg',
    trending: false,
    stock: 8,
    artist: 'sowsow',
    deck: 'Shining Legends',
    type: 'Electric',
  },
  {
    id: 6,
    name: 'Gyarados VMAX',
    category: 'Water',
    price: 95,
    originalPrice: 60,
    image: 'https://storage.googleapis.com/images.pricecharting.com/1f9002ac81b724335d272cccac29cbcc6cbabbf9770092cc180acd0a3c4c6b5c/240.jpg',
    trending: true,
    stock: 2,
    artist: 'Kouki Saitou',
    deck: 'Evolving Skies',
    type: 'Water',
  },
  {
    id: 7,
    name: 'Leafeon VMAX',
    category: 'Grass',
    price: 78,
    originalPrice: 45,
    image: 'https://storage.googleapis.com/images.pricecharting.com/22eb93693a71ea35685dd8a5b3eb3f984431df24027dcef335dc187e0636b5e5/240.jpg',
    trending: false,
    stock: 6,
    artist: 'PLANETA Tsuji',
    deck: 'Evolving Skies',
    type: 'Grass',
  },
  {
    id: 8,
    name: 'Moltres V',
    category: 'Fire',
    price: 55,
    originalPrice: 30,
    image: 'https://storage.googleapis.com/images.pricecharting.com/b0946df58642866426d70b2ebf104a6e55b63dc54dc5885bf5a3ce57e8b5da51/240.jpg',
    trending: true,
    stock: 7,
    artist: 'Kouki Saitou',
    deck: 'Chilling Reign',
    type: 'Fire',
  },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [showOnlyTrending, setShowOnlyTrending] = useState(false);
  const [filterArtist, setFilterArtist] = useState('');
  const [filterDeck, setFilterDeck] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesTrending = !showOnlyTrending || product.trending;
    const matchesArtist = !filterArtist || (product.artist?.toLowerCase().includes(filterArtist.toLowerCase()) ?? false);
    const matchesDeck = !filterDeck || (product.deck?.toLowerCase().includes(filterDeck.toLowerCase()) ?? false);
    const matchesType = filterType === 'All' || product.type === filterType;

    return matchesSearch && matchesCategory && matchesPrice && matchesTrending && matchesArtist && matchesDeck && matchesType;
  });

  return (
    <div className="retro-container-home">
      <div className="scanlines"></div>
      <div className="retro-grid"></div>

      <Navbar />

      <main className="retro-main">
        <div className="retro-content-wrapper">
          <div className="retro-search-section">
            <div className="retro-search-bar">
              <Search className="retro-search-icon" size={20} />
              <input
                type="text"
                placeholder="SEARCH POKEMON CARDS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-search-input"
              />
              <button
                className="retro-filter-button"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                FILTERS
              </button>
            </div>

            {showFilters && (
              <div className="retro-filters-panel">
                <div className="retro-filter-group">
                  <label className="retro-filter-label">PRICE RANGE: ${priceRange[0]} - ${priceRange[1]}</label>
                  <div className="retro-price-inputs">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="retro-filter-input"
                      placeholder="MIN"
                    />
                    <span className="retro-filter-separator">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="retro-filter-input"
                      placeholder="MAX"
                    />
                  </div>
                </div>

                <div className="retro-filter-group">
                  <label className="retro-filter-label">ARTIST</label>
                  <input
                    type="text"
                    value={filterArtist}
                    onChange={(e) => setFilterArtist(e.target.value)}
                    className="retro-filter-input"
                    placeholder="SEARCH BY ARTIST"
                  />
                </div>

                <div className="retro-filter-group">
                  <label className="retro-filter-label">DECK</label>
                  <input
                    type="text"
                    value={filterDeck}
                    onChange={(e) => setFilterDeck(e.target.value)}
                    className="retro-filter-input"
                    placeholder="SEARCH BY DECK"
                  />
                </div>

                <div className="retro-filter-group">
                  <label className="retro-filter-label">TYPE</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="retro-filter-input"
                  >
                    <option value="All">ALL TYPES</option>
                    <option value="Fire">FIRE</option>
                    <option value="Water">WATER</option>
                    <option value="Electric">ELECTRIC</option>
                    <option value="Grass">GRASS</option>
                    <option value="Psychic">PSYCHIC</option>
                    <option value="Fighting">FIGHTING</option>
                    <option value="Dark">DARK</option>
                    <option value="Steel">STEEL</option>
                    <option value="Dragon">DRAGON</option>
                    <option value="Fairy">FAIRY</option>
                  </select>
                </div>

                <div className="retro-filter-group">
                  <label className="retro-checkbox-label">
                    <input
                      type="checkbox"
                      checked={showOnlyTrending}
                      onChange={(e) => setShowOnlyTrending(e.target.checked)}
                      className="retro-checkbox"
                    />
                    TRENDING ONLY
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="retro-categories-section">
            <h2 className="retro-section-title">
              <TrendingUp size={24} className="inline-block mr-2" />
              POKEMON TYPES
            </h2>
            <div className="retro-categories-grid">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`retro-category-card ${selectedCategory === 'All' ? 'active' : ''}`}
              >
                <Zap size={32} />
                <span>ALL</span>
              </button>
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`retro-category-card ${selectedCategory === category.name ? 'active' : ''}`}
                  >
                    <Icon size={32} style={{ color: category.color }} />
                    <span>{category.name.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="retro-products-section">
            <h2 className="retro-section-title">
              <Zap size={24} className="inline-block mr-2" />
              POKEMON CARDS
              <span className="retro-product-count">({filteredProducts.length})</span>
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="retro-no-results">
                NO CARDS FOUND
              </div>
            ) : (
              <div className="retro-products-grid">
                {filteredProducts.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <div className="retro-product-card">
                      {product.trending && (
                        <div className="retro-trending-badge">
                          <TrendingUp size={16} />
                          HOT
                        </div>
                      )}
                      <div className="retro-product-image-wrapper">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="retro-product-image"
                        />
                      </div>
                      <div className="retro-product-info">
                        <div className="retro-product-category">{product.category.toUpperCase()}</div>
                        <h3 className="retro-product-name">{product.name}</h3>
                        <div className="retro-product-stock">
                          STOCK: {product.stock} UNITS
                        </div>
                        <div className="retro-product-prices">
                          <span className="retro-product-original-price">${product.originalPrice}</span>
                          <span className="retro-product-price">${product.price}</span>
                        </div>
                        <button className="retro-product-button">
                          [ ADD TO CART ]
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="retro-footer-main">
        <img src={logoImage} alt="ScalpCentral" style={{ height: '60px', marginBottom: '1rem' }} />
        <div>© 2026 ScalpCentral - Your investment, Your platform!</div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Secure Pokemon card trading • Authenticity guaranteed • Fast shipping worldwide
        </div>
      </footer>
    </div>
  );
}
