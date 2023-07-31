import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const AddForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user_id, setUserId] = useState('');
    const [board_id, setBoardId] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        setBoardId(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const sendData = (e) => {
        e.preventDefault();
        const board = {
            user_id,
            board_id,
        };
        addBoardFriend(board);

    }

    const addBoardFriend = (board) => {
        axios.post("http://localhost:8000/api/userBoard/", board, {
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
                                <Card.Title>Form Task</Card.Title>
                                <form onSubmit={sendData}>
                                    <div>
                                        <FormTextLabel inputId="user_id" titulo="Friend You Want To Add" />
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

export default AddForm;