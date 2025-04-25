import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { boardService } from "../services/board.service";
import { Checkbox } from "monday-ui-react-core";

export function GroupFooter({ group, board, onSaveBoard }) {

    const [taskTitleToAdd, setTaskTitleToAdd] = useState('')
    const [opacity, setOpacity] = useState('80')
    const [addTaskBgc, setAddTaskBgc] = useState('')


    function onAddTask(title) {
        setAddTaskBgc('')
        setOpacity('80')
        if (title === '') return
        const newTask = boardService.getEmptyTask(title)
        const value = [...group.tasks, newTask]
        setTaskTitleToAdd('')
        onSaveBoard({ type: 'group', board, groupId: group.id, key: 'tasks', value })
    }

    function onChangeBgc() {
        setOpacity('')
        setAddTaskBgc('focus-bgc')
    }

    function handleAddTask(ev) {
        if (ev.key === 'Enter') {
            onAddTask(ev.target.value)
        }
    }

    return (
        <div className="group-footer full main-layout">
            <table className="add-task full main-layout" onMouseEnter={() => setOpacity('')} onMouseLeave={() => setOpacity('80')}>
                <tbody className={`table-container table last ${addTaskBgc}`} style={{ borderColor: group.style.backgroundColor + opacity }}>
                    <tr className="table-row flex">
                        <td className=" title-col flex align-center justify-center">
                            <div className="checkbox flex align-center justify-center"><Checkbox disabled /></div>
                            <div className="title-name flex align-center justify-center">
                                <input
                                    type="text"
                                    placeholder={"+ Add Item"}
                                    value={taskTitleToAdd}
                                    onBlur={(ev) => onAddTask(ev.target.value)}
                                    onFocus={onChangeBgc}
                                    onChange={(ev) => setTaskTitleToAdd(ev.target.value)}
                                    onKeyPress={handleAddTask}
                                />
                                <span className="guidance" style={{ opacity: taskTitleToAdd ? 1 : 0 }}>Enter to add another item</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <ProgressBar board={board} group={group} />
        </div>
    )
} 