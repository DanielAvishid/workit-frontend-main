
import { useOutletContext } from "react-router"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { boardService } from "../services/board.service";
import { BoardListMobile } from "../cmps/boardListCmps/BoardListMobile";
import { BoardListDesktop } from "../cmps/boardListCmps/BoardListDesktop";

export function BoardList() {

    const [onSaveBoard, , , , , , , boards] = useOutletContext()
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const [isAbove600px, setIsAbove600px] = useState(window.innerWidth > 600)

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function handleResize() {
        setIsAbove600px(window.innerWidth > 600)
    }

    function onAddBoard(ev) {
        ev.stopPropagation()
        const board = boardService.getEmptyBoard()
        onSaveBoard({ board })
    }

    return (
        <>
            {!isAbove600px && <BoardListMobile boards={boards} onSaveBoard={onSaveBoard} onAddBoard={onAddBoard} />}
            {isAbove600px && <BoardListDesktop boards={boards} user={user} onSaveBoard={onSaveBoard} />}
        </>
    )
}