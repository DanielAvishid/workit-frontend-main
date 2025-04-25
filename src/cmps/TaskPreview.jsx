import { useRef } from "react";

import { useClickOutside } from "../hooks/useClickOutside";
import { Priority } from "./dynamicCmps/Priority";
import { TaskTitle } from "./dynamicCmps/TaskTitle";
import { Status } from "./dynamicCmps/Status";
import { Members } from "./dynamicCmps/Members";
import { Timeline } from "./dynamicCmps/Timeline";
import { DueDate } from "./dynamicCmps/DueDate";

import { Duplicate, Delete } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Menu, MenuButton, MenuItem } from "monday-ui-react-core";

export function TaskPreview({ board, group, task, onSaveBoard, onDuplicateTask, onRemoveTask, isChecked, handleCheckboxChange }) {

    const tableRow = useRef();
    const { isFocus: isTaskFocus, setIsFocus: setIsTaskFocus } = useClickOutside(tableRow);


    return (
        <div className="task-preview full main-layout">
            <div className="start flex align-center justify-center">
                <MenuButton className="task-menu">
                    <Menu id="menu" size="large">
                        {/* <MenuItem icon={Duplicate} title="Duplicate Boarder" /> */}
                        <MenuItem icon={Duplicate} title="Duplicate Task" onClick={() => onDuplicateTask({ boardId: board._id, groupId: group.id, taskId: task.id })} />
                        <MenuItem icon={Delete} title="Delete" onClick={() => onRemoveTask({ boardId: board._id, taskId: task.id })} />
                    </Menu>
                </MenuButton>
            </div>
            <table className="table-container table" style={{ borderColor: group.style.backgroundColor }} >
                <tbody className="table-container">
                    <tr
                        className={`table-row flex ${isChecked || isTaskFocus ? 'checked' : ''}`}
                        ref={tableRow}
                    >
                        <TaskTitle
                            task={task}
                            group={group}
                            board={board}
                            onSaveBoard={onSaveBoard}
                            isChecked={isChecked}
                            handleCheckboxChange={handleCheckboxChange}
                            setIsTaskFocus={setIsTaskFocus}
                        />

                        {board.cmpsOrder.map((cmp, idx) => (
                            <DynamicCmp
                                key={idx}
                                task={task}
                                group={group}
                                board={board}
                                cmpType={cmp.type}
                                info={task[cmp.type]}
                                onSaveBoard={onSaveBoard}
                                setIsTaskFocus={setIsTaskFocus}
                            />
                        ))}
                    </tr>
                </tbody>
            </table>
        </div >
    )
}

const DynamicCmp = ({ task, group, board, cmpType, info, onSaveBoard, setIsTaskFocus }) => {

    switch (cmpType) {
        case "priority":
            return <Priority group={group} task={task} cmpType={cmpType} labelId={info} board={board} onSaveBoard={onSaveBoard} setIsTaskFocus={setIsTaskFocus} />;
        case "status":
            return <Status group={group} task={task} cmpType={cmpType} labelId={info} board={board} onSaveBoard={onSaveBoard} setIsTaskFocus={setIsTaskFocus} />;
        case "members":
            return <Members info={info} task={task} group={group} board={board} onSaveBoard={onSaveBoard} setIsTaskFocus={setIsTaskFocus} />;
        case "timeline":
            return <Timeline info={info} task={task} group={group} board={board} onSaveBoard={onSaveBoard} setIsTaskFocus={setIsTaskFocus} />
        case "date":
            return <DueDate info={info} task={task} group={group} board={board} onSaveBoard={onSaveBoard} setIsTaskFocus={setIsTaskFocus} />
        default:
            break;
    }
};