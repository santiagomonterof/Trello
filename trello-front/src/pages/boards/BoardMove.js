import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const BoardMove = () => {
    const [list, setList] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadFromApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    const loadFromApi = () => {
        axios
            .get("http://localhost:8000/api/board/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const boardData = response.data;
                const rostersWithTasks = boardData.rosters_with_tasks;
                const lasColumnas = new Map();

                rostersWithTasks.forEach((roster) => {
                    const filas = roster.tasks
                        .sort((a, b) => parseInt(a.order) - parseInt(b.order))
                        .map((task) => ({
                            id: task.id,
                            name: task.name,
                            order: task.order,
                            created_at: task.created_at,
                            updated_at: task.updated_at
                        }));
                    lasColumnas.set(roster, filas);
                });

                setList(lasColumnas);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const moveRight = (indexCol, indexFila) => {
        const columnKeys = Array.from(list.keys());
        const currentCol = columnKeys[indexCol];
        const nextCol = columnKeys[indexCol + 1];
        const nextColValue = list.get(nextCol);
        nextColValue.push(list.get(currentCol)[indexFila]);
        const newCols = new Map(list);
        newCols.set(nextCol, nextColValue);
        const currentColValue = newCols.get(currentCol);
        currentColValue.splice(indexFila, 1);
        newCols.set(currentCol, currentColValue);
        setList(newCols);

        const taskId = list.get(nextCol)[nextColValue.length - 1].id;
        axios.post(`http://localhost:8000/api/task/moveNextRoster/${id}/${taskId}`)
            .then((response) => {
                console.log("Task moved to the next roster: ", response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const moveLeft = (indexCol, indexFila) => {
        if (indexCol > 0) {
            const columnKeys = Array.from(list.keys());
            const currentCol = columnKeys[indexCol];
            const prevCol = columnKeys[indexCol - 1];
            const prevColValue = list.get(prevCol);
            prevColValue.push(list.get(currentCol)[indexFila]);

            const newCols = new Map(list);
            newCols.set(prevCol, prevColValue);

            const currentColValue = newCols.get(currentCol);
            currentColValue.splice(indexFila, 1);
            newCols.set(currentCol, currentColValue);

            setList(newCols);

            const taskId = list.get(prevCol)[prevColValue.length - 1].id;
            axios.post(`http://localhost:8000/api/task/moveBackRoster/${id}/${taskId}`)
                .then((response) => {
                    console.log("Task moved to the previous roster: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const moveUp = (indexCol, indexFila, taskId) => {
        if (indexFila > 0) {
            const columnKeys = Array.from(list.keys());
            const currentCol = columnKeys[indexCol];
            const currentColValue = list.get(currentCol);
            const movedItem = currentColValue.splice(indexFila, 1)[0];
            currentColValue.splice(indexFila - 1, 0, movedItem);
            const newCols = new Map(list);
            newCols.set(currentCol, currentColValue);
            setList(newCols);

            axios.post(`http://localhost:8000/api/task/orderRest/${taskId}`)
                .then((response) => {
                    console.log("Task order updated: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const moveDown = (indexCol, indexFila, taskId) => {
        const columnKeys = Array.from(list.keys());
        const currentCol = columnKeys[indexCol];
        const currentColValue = list.get(currentCol);
        if (indexFila < currentColValue.length - 1) {
            const movedItem = currentColValue.splice(indexFila, 1)[0];
            currentColValue.splice(indexFila + 1, 0, movedItem);
            const newCols = new Map(list);
            newCols.set(currentCol, currentColValue);
            setList(newCols);

            axios.post(`http://localhost:8000/api/task/orderSum/${taskId}`)
                .then((response) => {
                    console.log("Task order updated: ", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const editColumn = (id) => {
        navigate("/roster/edit/" + id);
    }
    const deleteColum = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/roster/" + id, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                loadFromApi();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const editFila = (id) => {
        navigate("/task/edit/" + id);
    }
    const deleteFila = (id) => {
        if (window.confirm("Are you sure?") === false) {
            return;
        }
        axios.delete("http://localhost:8000/api/task/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            loadFromApi();
        }).catch((error) => {
            console.log(error);
        });
    }


    return (
        <div>
            <NavMenu />
            {list && (
                <Container>
                    <Row className="mt-5">
                        {Array.from(list.keys()).map((columna, indexCol) => (
                            <Col key={columna.id}>
                                <Card className="p-1 text-white bg-info mb-2">{columna.id}</Card>
                                <Card className="p-1 text-white bg-dark mb-2">{columna.name}</Card>
                                <Button variant="secondary" size="sm"  onClick={() => editColumn(columna.id)}>
                                    {"Edit"}
                                </Button>
                                <Button variant="warning" size="sm" onClick={() => deleteColum(columna.id)}>
                                    {"Delete"}
                                </Button>
                                {list.get(columna).map((fila, indexFila) => (
                                    <Card key={fila.id} className="mb-3 mt-2">
                                        <Card.Header>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => moveLeft(indexCol, indexFila, fila.id)}
                                            >
                                                {"<"}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => moveRight(indexCol, indexFila, fila.id)}
                                            >
                                                {">"}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => moveUp(indexCol, indexFila, fila.id)}
                                            >
                                                {"Up"}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => moveDown(indexCol, indexFila, fila.id)}
                                            >
                                                {"Down"}
                                            </Button>
                                            <Button variant="success" size="sm" onClick={() => editFila(fila.id)}>
                                                {"Edit"}
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => deleteFila(fila.id)}>
                                                {"Delete"}
                                            </Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>{fila.id}</Card.Text>
                                            <Card.Text>{fila.name}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default BoardMove;