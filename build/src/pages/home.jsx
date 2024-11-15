import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Acceder</h1>
            <Button type="submit" style={{width: "100%", backgroundColor: "var(--bg)", color: "var(--color-white)"}} onClick={() => {navigate('/login')}}>Login</Button>
        </>
    )
}

export default Home;