import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const RosterForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [order, setOrder] = useState('');
    const [board_id, setBoardId] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchRoster = () => {
        axios.get("http://localhost:8000/api/roster/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const board = response.data;
            setName(board.name);
            setOrder(board.order);
            setBoardId(board.board_id);
        }).catch((error) => {
            console.log(error);
        });
    }
    const sendData = (e) => {
        e.preventDefault();
        const roster = {
            name,
            order,
            board_id,
        };
        if (id) {
            updateRoster(roster);
        } else {
            createRoster(roster);
        }
    }
    const updateRoster = (roster) => {
        axios.put("http://localhost:8000/api/roster/" + id, roster, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                navigate("/board/list");
            }).catch((error) => {
                console.log(error);
            });
    }
    const createRoster = (roster) => {
        axios.post("http://localhost:8000/api/roster", roster, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                navigate("/board/list");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3">
                    <Col lg={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Form Roster</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl value={name} required type="text" id="title" onChange={(e) => {
                                            setName(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="order" titulo="order" />
                                        <FormControl value={order} required type="text" id="order" onChange={(e) => {
                                            setOrder(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="board_id" titulo="Board" />
                                        <FormControl value={board_id} required type="text" id="board_id" onChange={(e) => {
                                            setBoardId(e.target.value);
                                        }} />
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">Submit</Button>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default RosterForm;