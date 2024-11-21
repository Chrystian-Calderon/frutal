import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div style={styles.container}>
            <div style={styles.iceCream}>
                <div style={styles.scoop}></div>
                <div style={styles.cone}></div>
                <div style={styles.melt}></div>
            </div>
            <h1 style={styles.heading}>Error 404</h1>
            <p style={styles.message}>
                ¡Ups! Parece que este helado se ha derretido...  
                <br />
                La página que buscas no está disponible.
            </p>
            <button style={styles.button} onClick={() => navigate('/')}>
                Volver al inicio
            </button>
        </div>
    );
};
    
const styles = {
    container: {
        textAlign: "center",
        backgroundColor: "#fdf5e6",
        height: "100vh",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
    },
    iceCream: {
        position: "relative",
        display: "inline-block",
        marginBottom: "20px",
    },
    scoop: {
        width: "100px",
        height: "100px",
        backgroundColor: "#ff6b81",
        borderRadius: "50%",
        position: "relative",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
    cone: {
        width: "0",
        height: "0",
        borderLeft: "50px solid transparent",
        borderRight: "50px solid transparent",
        borderTop: "80px solid #f4a460",
        margin: "-10px auto 0",
    },
    melt: {
        width: "80px",
        height: "20px",
        backgroundColor: "#ff6b81",
        borderRadius: "50%",
        position: "absolute",
        bottom: "-15px",
        left: "10px",
    },
    heading: {
        fontSize: "48px",
        color: "#ff6b81",
        marginBottom: "20px",
    },
    message: {
        fontSize: "18px",
        color: "#333",
        marginBottom: "30px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#ff6b81",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default NotFound