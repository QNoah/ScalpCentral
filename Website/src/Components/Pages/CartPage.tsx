import '../Styling/CartStyle.css';
import Navbar from '../PageParts/Navbar';

export function CartPage() {
        return (
            <div className="retro-container-search">
                <Navbar />
                <div className="cart-page">
                    <div className="sidebar">

                    </div>
                    <div className="results-content">
                        <div className="carts-header">
                            <h1>Cart</h1>
                        </div>
                        <div className="cart-content">
    
                        </div>
                    </div>
                </div>
            </div>
    
        )
}