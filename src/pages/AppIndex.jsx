import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "../cmps/AppHeader";
import { AppSidebar } from "../cmps/AppSidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { duplicate, loadBoards, remove, saveBoard } from "../store/actions/board.action";
import { SET_BOARDS } from "../store/reducers/board.reducer";
import { store } from "../store/store";
import { showSuccessMsg } from "../services/event-bus.service";
import { TaskDetails } from "./TaskDetails";
import { BoardActivity } from "./BoardActivity";
import { logout } from "../store/actions/user.action";
import { TaskDetailsMobile } from "./TaskDetailsMobile";

export function AppIndex() {

    const [filterBy, setFilterBy] = useState({})
    const navigate = useNavigate()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const location = useLocation()
    const [isResizing, setIsResizing] = useState(false)
    const [width, setWidth] = useState(null)

    useEffect(() => {
        onLoadBoards(filterBy)
    }, [filterBy])

    async function onLoadBoards(filterBy) {
        try {
            loadBoards(filterBy)
        } catch (err) {
            console.log('ShowErrorMsg')
        }
    }

    async function onSaveBoard({ type, board, groupId = null, taskId = null, key, value }) {
        try {
            await saveBoard({ type, board, groupId, taskId, key, value })
            console.log('ShowSuccessesMsg')
        } catch (err) {
            console.log('Had issues in save board', err)
            console.log('ShowErrorMsg')
        }
    }

    async function onRemoveBoard({ board, boardId }) {
        try {
            await remove({ board, boardId })
            showSuccessMsg(`We successfully deleted the board`)
        } catch {
            console.log('Had issues in board details', err)
            console.log('ShowErrorMsg')
        }
    }

    async function onRemoveGroup({ boardId, groupId }) {
        try {
            await remove({ boardId, groupId })
            showSuccessMsg(`group was successfully deleted.`)
        } catch {
            console.log('Had issues in board details', err)
            console.log('ShowErrorMsg')
        }
    }

    async function onRemoveTask({ boardId, taskId }) {
        try {
            await remove({ boardId, taskId })
            showSuccessMsg(`We successfully deleted 1 item`)
            navigate(`${boardId}`)
        } catch {
            console.log('Had issues in board details', err)
            console.log('ShowErrorMsg')
        }
    }

    async function onDuplicateBoard({ boardId }) {
        try {
            await duplicate({ boardId })
            showSuccessMsg('Board has been duplicated successfully')
        } catch (err) {
            console.log('ShowErrorMsg')
        }
    }

    async function onDuplicateGroup({ boardId, groupId }) {
        try {
            await duplicate({ boardId, groupId })
            showSuccessMsg('Group has been duplicated successfully')
        } catch (err) {
            console.log('ShowErrorMsg')
        }
    }

    async function onDuplicateTask({ boardId, groupId, taskId }) {
        try {
            await duplicate({ boardId, groupId, taskId })
            showSuccessMsg('We successfully duplicated 1 item')
        } catch (err) {
            console.log('ShowErrorMsg')
        }
    }

    async function onLogout() {
        await logout()
        navigate('/login')
    }

    function handleBoardsFilter(value) {
        filterBy.title = value
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function updateBoards(boards) {
        store.dispatch({ type: SET_BOARDS, boards })
    }

    function handleMouseMove(ev) {
        if (isResizing) {
            setWidth(ev.clientX)
        }
    }

    function handleMouseUp() {
        setIsResizing(false)
    }

    return (
        <section
            className="app-index"
            onMouseMove={(ev) => handleMouseMove(ev)}
            onMouseUp={handleMouseUp}>
            <AppHeader user={user} onLogout={onLogout} />
            <section className="main-container">
                <AppSidebar
                    boards={boards}
                    onDuplicateBoard={onDuplicateBoard}
                    onRemoveBoard={onRemoveBoard}
                    onSaveBoard={onSaveBoard}
                    updateBoards={updateBoards}
                    handleBoardsFilter={handleBoardsFilter}
                    filterBy={filterBy} />
                <Outlet context={[onSaveBoard, onRemoveBoard, onRemoveGroup, onRemoveTask, onDuplicateBoard, onDuplicateGroup, onDuplicateTask, boards]} />
                {location.pathname.includes('task') && <TaskDetails onSaveBoard={onSaveBoard} onRemoveTask={onRemoveTask} setIsResizing={setIsResizing} width={width} />}
            </section>
            {location.pathname.includes('activity') && <BoardActivity setIsResizing={setIsResizing} width={width} />}
        </section>
    )
}