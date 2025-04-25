import { useEffect, useRef, useState } from "react"
import { LabelModal } from "./LabelModal"
import { useClickOutside } from "../../hooks/useClickOutside"

export function Status({ task, group, board, labelId, onSaveBoard, cmpType, setIsTaskFocus, }) {
    const [currLabel, setCurrLabel] = useState(getCurrLabel())
    const statusCell = useRef()
    const { isFocus, setIsFocus } = useClickOutside(statusCell)
    const { isFocus: isModalOpen, setIsFocus: setIsModalOpen } = useClickOutside(statusCell)

    useEffect(() => {
        setCurrLabel(getCurrLabel())
    }, [board.statusLabels, task.status])

    function getCurrLabel() {
        return board[cmpType + 'Labels'].find((label) => label.id === labelId)
    }

    const customStyle = {
        backgroundColor: currLabel.color
    }

    //change to normal function (non-arrow-function)
    const onClickStatusCell = () => {
        setIsTaskFocus(true)
        setIsFocus(true)
        setIsModalOpen(!isModalOpen)
    }

    return (
        <td
            style={customStyle}
            className={`status status-col grid align-center justify-center ${isFocus ? 'focus' : ''}`}
            ref={statusCell}
            onClick={onClickStatusCell}>
            <span>{currLabel.title}</span>
            {isModalOpen && <LabelModal
                task={task}
                group={group}
                board={board}
                keyName={cmpType + 'Labels'}
                labels={board[cmpType + 'Labels']}
                onSaveBoard={onSaveBoard}
                cmpType={cmpType} />}
        </td>
    )
}