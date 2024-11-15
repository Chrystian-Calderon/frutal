function About() {
    return (
        <div className="container my-5">
            <h2>Acerca de</h2>

            <h4>Descripción del Proyecto</h4>
            <p>
                El <strong>sistema web de Helados Frutal</strong> tiene como objetivo principal calcular las ventas diarias,
                así como realizar un análisis detallado de las ganancias de cada producto y de la empresa en general.
                Además, el sistema permite generar reportes de ventas, facilitando la gestión de las operaciones comerciales.
                Este sistema integral incluye funcionalidades para la gestión de ventas, productos, usuarios y tiendas,
                brindando a los administradores una herramienta eficaz para optimizar su negocio.
            </p>

            <h4>Tecnologías Utilizadas</h4>
            <ul>
                <li><strong>Frontend</strong>: React, Bootstrap</li>
                <li><strong>Backend</strong>: Node.js</li>
                <li><strong>Base de datos</strong>: MySQL</li>
            </ul>

            <h4>Equipo de Desarrollo</h4>
            <p>
                El sistema fue desarrollado por <strong>Chrystian Calderon</strong>, quien se encargó del análisis, desarrollo
                y diseño del sistema, asegurando que cada funcionalidad se adapte a las necesidades del negocio.
            </p>

            <h4>Contacto</h4>
            <p>
                Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto conmigo a través de:
            </p>
            <ul>
                <li><strong>Correo electrónico</strong>: <a href="mailto:tu-email@gmail.com">tu-email@gmail.com</a></li>
                <li><strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/tu-perfil-linkedin" target="_blank" rel="noopener noreferrer">tu-perfil-linkedin</a></li>
            </ul>
        </div>
    )
}

export default About;