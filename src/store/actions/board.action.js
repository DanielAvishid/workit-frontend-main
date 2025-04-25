import { boardService } from "../../services/board.service";
import { SOCKET_EMIT_UPDATE_BOARD, socketService } from "../../services/socket.service";
import { ADD_BOARD, REMOVE_BOARD, SET_BOARD, SET_BOARDS, UPDATE_BOARD } from "../reducers/board.reducer";
import { store } from "../store"

export function getActionAddBoard(board) {
    return { type: ADD_BOARD, board }
}

export function getActionRemoveBoard(boardId) {
    return { type: REMOVE_BOARD, boardId: boardId }
}

export function getActionUpdateBoard(board) {
    return { type: UPDATE_BOARD, board }
}

export async function loadBoards(filterBy) {
    try {
        console.log(filterBy)
        const boards = await boardService.query(filterBy)
        console.log(boards)
        store.dispatch({ type: SET_BOARDS, boards })
    } catch (err) {
        console.log('board action -> Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId, filterBy, sortBy) {
    try {
        const board = await boardService.getBoardById(boardId, filterBy, sortBy)
        store.dispatch({ type: SET_BOARD, board })
    } catch (err) {
        console.log('board action -> Cannot load board', err)
        throw err
    }
}

export async function getById({ boardId, taskId }) {
    try {
        return await boardService.getById({ boardId, taskId })
    } catch (err) {
        console.log('board action -> Cannot load board/task', err)
    }

}

export async function remove({ board, boardId, groupId, taskId }) {
    try {
        // store.dispatch({ type: REMOVE_BOARD, boardId }) // Optimistic
        const savedBoard = await boardService.remove({ board, boardId, groupId, taskId })
        if (groupId || taskId) {
            store.dispatch({ type: UPDATE_BOARD, board: savedBoard })
        } else {
            store.dispatch({ type: REMOVE_BOARD, boardId })
            store.dispatch({ type: SET_BOARD, board: undefined })
        }
    } catch (err) {
        // store.dispatch({ type: BOARD_UNDO }) // Optimistic
        console.log('board action -> Cannot remove board', err)
        throw err
    }
}

export async function saveBoard({ type, board, groupId, taskId, key, value }) {
    try {
        let boardToSave
        const dispatchType = (board._id) ? UPDATE_BOARD : ADD_BOARD
        if (board._id) {
            boardToSave = await boardService.update({ type, board, groupId, taskId, key, value })
        } else {
            boardToSave = await boardService.addBoard(board)
        }
        store.dispatch({ type: dispatchType, board: boardToSave })
        return boardToSave
    } catch (err) {
        console.log('board action -> Cannot save board', err)
        throw err
    }
}

export async function duplicate({ boardId, groupId, taskId }) {
    try {
        const savedBoard = await boardService.duplicate({ boardId, groupId, taskId })
        if (groupId || taskId) {
            store.dispatch({ type: UPDATE_BOARD, board: savedBoard })
        } else {
            store.dispatch({ type: ADD_BOARD, board: savedBoard })
        }
    } catch (err) {
        console.log('board action -> Cannot duplicate board', err)
        throw err
    }
}




