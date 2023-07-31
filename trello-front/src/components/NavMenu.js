import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const NavMenu = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("idUser");
        navigate("/");
    }
    return (<Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand href="#home">Trello</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {token ?
                        <>
                            <NavDropdown title="Boards" id="basic-nav-dropdown">
                                <NavLink className="dropdown-item" to="/board/list">List of Boards</NavLink>
                                <NavLink className="dropdown-item" to="/board/create">Create Board</NavLink>
                            </NavDropdown>
                            <NavDropdown title="Rosters">
                                <NavLink className="dropdown-item" to="/roster/create">Create Roster</NavLink>
                            </NavDropdown>
                            <NavDropdown title="Tasks">
                                <NavLink className="dropdown-item" to="/task/create">Create task</NavLink>
                            </NavDropdown>
                            <button onClick={cerrarSesion} className="nav-link btn btn-link cerrarSesionLink">Cerrar Sesión</button>
                        </> :
                        <>
                            <NavLink className="nav-link" to="/">Iniciar Sesión</NavLink>
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </>
                    }
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}

export default NavMenu;