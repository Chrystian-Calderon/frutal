import { useEffect, useState } from "react"
import {getTaskRequest} from "../../api/tasks.api"

function Users() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        async function loadTask() {
            const response = await getTaskRequest()
            setTasks(response.data)
        }
        loadTask()
    }, [])
    return (
        <div>
            <h1>Lista de usuarios</h1>

            {
                tasks.map(task => (
                    <div>
                        <h2>{task.username}</h2>
                        <p>{task.password}</p>
                        <p>{task.email}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Users