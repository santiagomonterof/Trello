import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const PersonaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [user_id, setUserId] = useState('');

    useEffect(() => {
        if (!id) {
            setUserId(localStorage.getItem("idUser"));
            return;
        }
        fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchBoard = () => {
        axios.get("http://localhost:8000/api/board/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const board = response.data;
            setTitle(board.title);
            setUserId(board.user_id);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    const sendData = (e) => {
        e.preventDefault();
        const board = {
            title,
            user_id,
        };
        if (id) {
            updateBoard(board);
        } else {
            createBoard(board);
        }
    }
    const updateBoard = (board) => {
        axios.put("http://localhost:8000/api/board/" + id, board, {
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
    const createBoard = (board) => {
        axios.post("http://localhost:8000/api/board", board, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                const boardId = response.data.id;

                return axios.post("http://localhost:8000/api/userBoard", {
                    user_id: localStorage.getItem("idUser"),
                    board_id: boardId
                }, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
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
                                <Card.Title>Form Board</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl value={title} required type="text" id="title" onChange={(e) => {
                                            setTitle(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="user_id" titulo="Creator" />
                                        <FormControl value={user_id} required type="text" id="user_id" onChange={(e) => {
                                            setUserId(e.target.value);
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

export default PersonaForm;