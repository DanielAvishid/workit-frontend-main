import { useEffect, useRef, useState } from "react"
import { LabelModal } from "./LabelModal"
import { useClickOutside } from "../../hooks/useClickOutside";

export function Priority({ task, group, board, labelId, onSaveBoard, cmpType, setIsTaskFocus, }) {
    const [currLabel, setCurrLabel] = useState(getCurrLabel())
    const priorityCell = useRef();
    const { isFocus, setIsFocus } = useClickOutside(priorityCell);
    const { isFocus: isModalOpen, setIsFocus: setIsModalOpen } = useClickOutside(priorityCell);

    useEffect(() => {
        setCurrLabel(getCurrLabel())
    }, [board.priorityLabels, task.priority])

    function getCurrLabel() {
        return board[cmpType + 'Labels'].find((label) => label.id === labelId)
    }

    const customStyle = {
        backgroundColor: currLabel.color
    }

    //change to normal function (non-arrow-function)
    const onClickPriorityCell = () => {
        setIsTaskFocus(true)
        setIsFocus(true)
        setIsModalOpen(!isModalOpen)
    }

    return (
        <td
            style={customStyle}
            className={` priority priority-col grid align-center justify-center ${isFocus ? 'focus' : ''}`}
            ref={priorityCell}
            onClick={onClickPriorityCell}>
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