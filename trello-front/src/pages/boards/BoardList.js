import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RosterList = () => {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    useEffect(() => {
        fetchBoardList();
    }, [])


    const fetchBoardList = () => {
        axios.get("http://localhost:8000/api/userBoard/" + localStorage.getItem("idUser"), {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((response) => {
                setBoardList(response.data);
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    const editBoard = (id) => {
        navigate("/board/edit/" + id);
    }
    const deleteBoard = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/board/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
                fetchBoardList();
            }).catch((error) => {
                console.log(error);
            });
    }
    const goBoard = (id) => {
        navigate("/board/element/" + id);
    }
    const addFriend = (id) => {
        navigate("/board/addFriend/" + id);
    }
    
    return (<>
        <NavMenu />
        <Container>
            <Row className="mt-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>List of Boards</Card.Title>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Creator</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boardList.map(board =>
                                        <tr key={"tr-" + board.id}>                           
                                            <td>{board.board.id}</td>
                                            <td>{board.board.title}</td>
                                            <td>{board.user_id}</td>
                                            <td>
                                                <Button variant="dark" className="text-white bg-dark" onClick={() => {
                                                    goBoard(board.board.id)
                                                }}>Data</Button>
                                            </td>
                                            <td>
                                                <Button variant="secondary" className="text-white bg-secondary" onClick={() => {
                                                    addFriend(board.board.id)
                                                }}>Add Friend</Button>
                                            </td>
                                            <td>
                                                <Button variant="primary" onClick={() => {
                                                    editBoard(board.id)
                                                }}>Edit</Button>
                                            </td>
                                            <td>
                                                <Button variant="danger" onClick={() => {
                                                    deleteBoard(board.id)
                                                }}>Delete</Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
    );
}

export default RosterList;