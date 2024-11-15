import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carrousel.css";

const Carrousel = ({ storeData, role, stores }) => {
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    const handleClick = (id, store) => {
        if (stores.includes(id)) {
            localStorage.setItem('number', id);
            localStorage.setItem('storeName', store);
            const name = store.toLowerCase().replace(/\s+/g, '');
            localStorage.setItem('store', name);
            navigate(`/admin/statistics/${name}`);
        } else {
            alert('No puede ingresar');
        }
    }
    return (
        <div className="px-5" style={{marginBottom: '40px'}}>
            {role == 'Administrador' || role == 'Gerente' ?
                <Slider {...settings}>
                {storeData.map((store, key) => (
                    <div key={key}>
                        <div className="d-flex border p-3 stores" style={{backgroundColor: 'var(--color-columbia-blue)', borderRadius: "8px"}} onClick={() => handleClick(store.idStore, store.name)}>
                            <div className="d-flex justify-content-center align-items-center" style={{ width: '30%'}}>
                                <div style={{width: "100%", height: "100px"}}>
                                    <img
                                        style={{width: "100%", height: "100%"}}
                                        src={`/store/${store.name}.png`}
                                        alt={store.name}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column justify-content-between" style={{width: "70%", marginLeft: '10px'}}>
                                <div>
                                    <h4 className="card-title">{store.name}</h4>
                                </div>
                                <div className="d-flex justify-content-between flex-column">
                                    <p className="card-text">Ventas mes: Bs. {store.sales_month}</p>
                                    <p className="card-text">Ventas día: Bs. {store.sales_day}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </Slider>
                :
                <div className="d-flex border p-3 stores" style={{backgroundColor: 'var(--color-columbia-blue)', borderRadius: "8px"}} onClick={() => handleClick(storeData[0].idStore, store[0].name)}>
                    <div className="d-flex justify-content-center align-items-center p-2" style={{ width: '30%'}}>
                        <div style={{width: "100%", height: "100px"}}>
                            <img
                                style={{width: "100%", height: "100%"}}
                                src={`/store/${store.name}.png`}
                                alt={store.name}
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-between" style={{width: "70%"}}>
                        <div>
                            <h4 className="card-title">{store.name}</h4>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="card-text">Ventas mes: Bs. {store.sales_day}</p>
                            <p className="card-text">Ventas día: Bs. {store.sales_month}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Carrousel;