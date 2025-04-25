import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { getById } from "../store/actions/board.action"
import { Icon } from "monday-ui-react-core"
import { Drag } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { utilService } from "../services/util.service"
import { useSelector } from "react-redux"
import { TaskDetailsHeader } from "../cmps/TaskDetailsHeader"
import { TaskDetailsUpdates } from "../cmps/TaskDetailsUpdates"
import { TaskDetailsActivity } from "../cmps/TaskDetailsActivity"
import { userService } from "../services/user.service"
import { TaskDetailsMobile } from "./TaskDetailsMobile"

export function TaskDetails({ onSaveBoard, onRemoveTask, setIsResizing, width }) {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const board = useSelector(storeState => storeState.boardModule.board)
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const [task, setTask] = useState(null)
    const [filteredActivities, setFilteredActivities] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentTab, setCurrentTab] = useState('Updates')
    const [isUpdateEditor, setIsUpdateEditor] = useState(false)
    let groupId
    let timeoutId

    if (board) groupId = board.groups.find((group) => group.tasks.some((task) => task.id === taskId))?.id || null;

    useEffect(() => {
        loadTask()
    }, [boards, taskId, boardId, board])

    async function loadTask() {
        try {
            const task = await getById({ boardId, taskId })
            // groupId = board.groups.find((group) => group.tasks.some((task) => task.id === taskId))?.id || null;
            setTask(task)
            setFilteredActivities(task.activities)

        } catch (err) {
            console.log('Had issues in board details', err)
            console.log('ShowErrorMsg')
            navigate('/board')
        }
    }

    function handleSearch(searchValue) {
        console.log('searchValue', searchValue);

        const filtered = activities.filter((activity) =>
            activity.title.toLowerCase().includes(searchValue.toLowerCase())
        )

        console.log('filtered', filtered);

        setSearchTerm(searchValue)
        setFilteredActivities(filtered)
    }

    function onTaskTitleChange(ev) {
        if (!ev.target.value) return
        onSaveBoard({ type: 'task', board, groupId, taskId, key: 'title', value: ev.target.value })
        // onSaveBoard({ key: 'title', value: ev.target.value, boardId, taskId })
    }

    function onUpdateClick(updateValue) {
        const value = task.updates || []
        const update = {
            id: utilService.makeId(),
            text: updateValue,
            at: Date.now(),
            by: user ? user : {
                "_id": "UjCos",
                "fullname": "Guest",
                "imgUrl": "https://style.monday.com/static/media/person2.24c7233e.png"
            }
        }
        value.unshift(update)
        onSaveBoard({ type: 'task', board, groupId, taskId, key: 'updates', value })
        setIsUpdateEditor(false)
    }

    function onRemoveUpdate(updateId) {
        const value = task.updates.filter(update => update.id !== updateId)
        onSaveBoard({ type: 'task', board, groupId, taskId, key: 'updates', value })
        // onSaveBoard({ key: 'updates', value, boardId, taskId })
    }

    function handleMouseDown(ev) {
        ev.preventDefault()
        setIsResizing(true)
    }

    function handleKeyPress(ev) {
        if (ev.key === 'Enter') {
            ev.target.blur()
        }
    }


    if (!task) return <span></span>
    if (window.innerWidth < 600) return (<TaskDetailsMobile task={task} groupId={groupId} board={board} onSaveBoard={onSaveBoard} handleKeyPress={handleKeyPress} />)

    return (
        <section
            className={`task-details`}
            style={{ width: width ? `calc(100vw - ${width}px)` : '570px' }}>
            <TaskDetailsHeader
                boardId={boardId}
                task={task}
                onRemoveTask={onRemoveTask}
                setCurrentTab={setCurrentTab}
                onTaskTitleChange={onTaskTitleChange}
                handleKeyPress={handleKeyPress} />

            {currentTab === 'Updates' && <TaskDetailsUpdates
                onRemoveUpdate={onRemoveUpdate}
                task={task}
                onUpdateClick={onUpdateClick}
                isUpdateEditor={isUpdateEditor}
                setIsUpdateEditor={setIsUpdateEditor} />}

            {currentTab === 'Activity Log' && <TaskDetailsActivity filteredActivities={filteredActivities} />}

            <button
                className="drag-btn"
                onMouseDown={(ev) => handleMouseDown(ev)}>
                <Icon className="close-icon" icon={Drag} />
            </button>
        </section >
    )
}