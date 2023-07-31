import { useEffect, useState } from "react";
import FormTextLabel from "../../components/FormTextLabel";
import axios from "axios";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, FormControl, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const TaskForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [order, setOrder] = useState('');
    const [roster_id, setRosterId] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchRoster();  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const fetchRoster = () => {
        axios.get("http://localhost:8000/api/task/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            const task = response.data;
            setName(task.name);
            setOrder(task.order);
            setRosterId(task.roster_id);
        }).catch((error) => {
            console.log(error);
        });
    }
    const sendData = (e) => {
        e.preventDefault();
        const roster = {
            name,
            order,
            roster_id,
        };
        if (id) {
            updateTask(roster);
        } else {
            createTask(roster);
        }
    }
    const updateTask = (roster) => {
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
    const createTask = (roster) => {
        axios.post("http://localhost:8000/api/task/", roster, {
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
                                        <FormTextLabel inputId="title" titulo="Title" />
                                        <FormControl value={name} required type="text" id="title" onChange={(e) => {
                                            setName(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="order" titulo="Order" />
                                        <FormControl value={order} required type="text" id="order" onChange={(e) => {
                                            setOrder(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormTextLabel inputId="roster_id" titulo="Roster" />
                                        <FormControl value={roster_id} required type="text" id="roster_id" onChange={(e) => {
                                            setRosterId(e.target.value);
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

export default TaskForm;