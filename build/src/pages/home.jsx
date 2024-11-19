import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from "../components/FooterComponent";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <NavbarComponent />
            <div style={{width: '100%', height: 'calc(100vh - 56px)', position: 'relative'}}>
                <img src="/background/bg-home.jpeg" alt="fondo de imagen de helados" style={{width: '100%', height: '100%'}} />
                <div className="p-3" style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                    <h1 style={{textAlign: 'center'}}>Helados Frutal</h1>
                    <p>
                    En Helados Frutal, celebramos la frescura de las frutas y la dulzura de los momentos especiales. Disfruta de nuestros deliciosos helados elaborados con ingredientes naturales, frescos y de la mejor calidad. Ofrecemos una amplia variedad de sabores que cautivarán tus sentidos, desde los clásicos hasta los más innovadores. ¡Haz de cualquier día un buen momento con Helados Frutal!
                    </p>
                    <div className="d-flex justify-content-center" style={{gap: '20px'}}>
                        <Button onClick={() => navigate('/products')}>Productos</Button>
                        <Button onClick={() => navigate('/catalog')}>Ver catalogo</Button>
                    </div>
                </div>
            </div>
            {/* <div>
                <div>Frescura</div>
                <div>Calidad</div>
                <div>Variedad</div>
            </div> */}
            <div className="p-3">
                <h2>Nuestro helados destacados</h2>
                <div className="d-flex justify-content-between" style={{gap: '30px'}}>
                    <div style={{width: 'calc(100% / 3)'}}>
                        <div style={{width: '200px', height: '200px', overflow: 'hidden', margin: '0 auto'}}><img src="/img/banana-split.jpg" alt="banana split" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                        <h3 style={{textAlign: 'center'}}>Banana split</h3>
                        <p style={{textAlign: 'justify'}}>Un postre clásico que combina una base de plátano partido a la mitad, acompañado de tres bolas de helado, decorado con crema batida, jarabe de chocolate, frutas y una cereza en la cima.</p>
                    </div>
                    <div style={{width: 'calc(100% / 3)'}}>
                        <div style={{width: '200px', height: '200px', overflow: 'hidden', margin: '0 auto'}}><img src="/img/mateada-fresa.jpeg" alt="mateada de fresa" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                        <h3 style={{textAlign: 'center'}}>Malteada de fresa</h3>
                        <p style={{textAlign: 'justify'}}>Una bebida cremosa y refrescante preparada con helado de fresa y leche. Mezclada a la perfección para obtener un sabor suave y dulce, ideal para disfrutar en cualquier momento del día.</p>
                    </div>
                    <div style={{width: 'calc(100% / 3)'}}>
                        <div style={{width: '200px', height: '200px', overflow: 'hidden', margin: '0 auto'}}><img src="/img/copa-mediana.jpeg" alt="Helado copa mediana" style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}} /></div>
                        <h3 style={{textAlign: 'center'}}>Copa mediana</h3>
                        <p style={{textAlign: 'justify'}}>Una porción perfecta de helado servida en una copa mediana decorado con galleta, ideal para disfrutar solo o acompañado.</p>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button onClick={() => navigate('/catalog')}>Descubre más en nuestro catalogo</Button>
                </div>
            </div>
            <FooterComponent />
        </>
    )
}

export default Home;