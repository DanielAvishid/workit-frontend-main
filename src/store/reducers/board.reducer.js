export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UNDO_REMOVE_BOARD = 'UNDO_REMOVE_BOARD'
export const BOARD_UNDO = 'BOARD_UNDO'
export const SET_BOARD = 'SET_BOARD'

export const SET_SELECTED_TASKS = 'SET_SELECTED_TASKS'

const initialState = {
    boards: [],
    lastBoards: [],
    selectedTasks: {},
    board: undefined,
}

export function boardReducer(state = initialState, action) {

    var boards
    var lastBoards
    switch (action.type) {
        case SET_BOARD:
            return { ...state, board: action.board }

        case SET_BOARDS:
            lastBoards = [...action.boards]
            return { ...state, boards: action.boards }

        case REMOVE_BOARD:
            lastBoards = [...state.boards]
            boards = state.boards.filter(board => board._id !== action.boardId)
            return { ...state, boards, lastBoards }

        case ADD_BOARD:
            console.log(action.board)
            boards = [...state.boards, action.board]
            return { ...state, boards }

        case UPDATE_BOARD:
            boards = state.boards.map(board => board._id === action.board._id ? action.board : board)
            return { ...state, boards }

        case BOARD_UNDO:
            boards = [...state.lastBoards]
            return { ...state, boards }

        case SET_SELECTED_TASKS: {
            return { ...state, selectedTasks: action.selectedTasks }
        }

        default:
            return state
    }
}