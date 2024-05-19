import React, { useEffect, useState } from "react";

const Home = () => {
    const [task, setTask] = useState("");
    const [user, setUser] = useState();

    const createUser = async () => {
        await fetch('https://playground.4geeks.com/todo/users/BENJA', {
            method: 'POST'
        }).then(resp => {
            if (resp.ok) {
                alert('Usuario creado correctamente');
                getUser();
            }
        });
    };

    const getUser = async () => {
        await fetch('https://playground.4geeks.com/todo/users/BENJA')
            .then(resp => {
                if (!resp.ok) {
                    createUser();
                }
                return resp.json();
            })
            .then(user => setUser(user));
    };

    useEffect(() => {
        getUser();
    }, []);

    const createTask = async () => {
        if (!task || !task.trim()) {
            alert('El valor de la tarea no puede estar vacío');
            return;
        }

        await fetch('https://playground.4geeks.com/todo/todos/BENJA', {
            method: 'POST',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                label: task,
                is_done: false
            })
        }).then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        }).then(respJson => {
            const newUser = {
                ...user,
                todos: [...user.todos, respJson]
            };
            setUser(newUser);
            setTask("");
        });
    };

    const deleteTask = async (taskId) => {
        const id = parseInt(taskId);
        await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                const updatedUserTasks = user.todos.filter(item => item.id !== id);
                const newUser = {
                    ...user,
                    todos: updatedUserTasks
                };
                setUser(newUser);
            }
        }).catch(error => {
            console.error('Error al eliminar la tarea:', error);
        });
    };

    return (
        <div className="container">
            <h1>to-do</h1>
            <div className="to_do">
                <input className="form-control"
                    placeholder="What do you need to do?"
                    onChange={(evt) => setTask(evt.target.value)}
                    onKeyDown={(evt) => evt.key === 'Enter' && createTask()}
                    type="text"
                    value={task}
                />
            </div>
            <div className="row">
                <div>
                    {user && user.todos.map((item) => (
                        <p key={item.id}>
                            {item.label}
                            <button className="far fa-trash-alt" onClick={() => deleteTask(item.id)}></button>
                        </p>
                    ))}
                </div>
                <p className="text-center">
                    {user && user.todos.length ?
                        <span>Tienes {user.todos.length} tareas pendientes</span> :
                        <span>No tienes tareas pendientes</span>}
                </p>
                <button className="butt" onClick={() => setUser(null)}>Eliminar Usuario</button>
            </div>
        </div>
    );
};

export default Home;