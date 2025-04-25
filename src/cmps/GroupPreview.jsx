
import { GroupPreviewCollapse } from "./GroupPreviewCollapse";
import { SET_SELECTED_TASKS } from "../store/reducers/board.reducer"
import { Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { GroupFooter } from "./GroupFooter";
import { TaskList } from "./TaskList";
import { GroupHeader } from "./GroupHeader";

export function GroupPreview({ index, board, group, onSaveBoard, onRemoveGroup, onRemoveTask,
    onDuplicateGroup, onDuplicateTask, isCollapse, setIsCollapse, updateIsCollapse }) {

    const selectedTasks = useSelector(state => state.boardModule.selectedTasks)
    const dispatch = useDispatch()

    const [tasks, setTasks] = useState(group.tasks)

    const tasksCheck = tasks.reduce((acc, task) => {
        acc[task.id] = false;
        return acc;
    }, {})

    const [checkboxes, setCheckboxes] = useState(tasksCheck);
    const [masterChecked, setMasterChecked] = useState(false);

    useEffect(() => {
        setTasks(group.tasks)
    }, [group])

    useEffect(() => {
        if (Object.keys(selectedTasks).length === 0) {
            setCheckboxes(tasksCheck)
            setMasterChecked(false)
        }
    }, [selectedTasks])


    const handleMasterChange = () => {
        setMasterChecked(!masterChecked);
        const updatedCheckboxes = { ...checkboxes };

        for (const taskId in updatedCheckboxes) {
            updatedCheckboxes[taskId] = !masterChecked;
        }

        setCheckboxes(updatedCheckboxes);

        const updatedSelectedTasks = { ...selectedTasks };

        if (!masterChecked) {
            updatedSelectedTasks[group.id] = Object.keys(checkboxes).reduce((acc, taskId) => {
                acc[taskId] = true;
                return acc;
            }, {});
        } else {
            delete updatedSelectedTasks[group.id];
        }

        dispatch({ type: SET_SELECTED_TASKS, selectedTasks: updatedSelectedTasks })
    }

    const handleCheckboxChange = (taskId) => {
        const updatedCheckboxes = { ...checkboxes };
        updatedCheckboxes[taskId] = !updatedCheckboxes[taskId];
        setCheckboxes(updatedCheckboxes);

        const updatedSelectedTasks = { ...selectedTasks };
        if (!updatedSelectedTasks[group.id]) {
            updatedSelectedTasks[group.id] = {};
        }

        if (updatedCheckboxes[taskId]) {
            updatedSelectedTasks[group.id][taskId] = true;
        } else {
            delete updatedSelectedTasks[group.id][taskId];
        }

        if (Object.keys(updatedSelectedTasks[group.id]).length === 0) {
            delete updatedSelectedTasks[group.id];
        }

        dispatch({ type: SET_SELECTED_TASKS, selectedTasks: updatedSelectedTasks })

        const allChecked = Object.values(updatedCheckboxes).every((value) => value);
        setMasterChecked(allChecked);
    }

    function handleKeyPress(ev, key, idValue) {
        console.log(ev);

        if (ev.key === 'Enter') {

            if (key === 'title') {
                ev.target.blur()
                // onSaveBoard(({ type: 'group', board, groupId: group.id, key, value: ev.target.value }))
            } else if (key === 'cmpsOrder') {
                const updatedCmpsOrder = board.cmpsOrder.map(cmp => {
                    if (cmp.id === idValue) {
                        return { ...cmp, title: ev.target.value }
                    }
                    return cmp;
                })

                onSaveBoard({ board, key, value: [...updatedCmpsOrder] })
            }

            ev.target.blur()
        }
    }

    if (isCollapse[group.id]) return (
        <GroupPreviewCollapse index={index} handleKeyPress={handleKeyPress} board={board}
            group={group} onDuplicateGroup={onDuplicateGroup} onSaveBoard={onSaveBoard}
            onRemoveGroup={onRemoveGroup} isCollapse={isCollapse} setIsCollapse={setIsCollapse}
            updateIsCollapse={updateIsCollapse} />
    )

    return (
        <Draggable draggableId={group.id} index={index}>
            {(provider) => (
                <div
                    {...provider.draggableProps}
                    {...provider.dragHandleProps}
                    ref={provider.innerRef}
                    className="group-preview main-layout full flex align-center justify-center"
                >

                    <GroupHeader
                        group={group}
                        board={board}
                        onSaveBoard={onSaveBoard}
                        onDuplicateGroup={onDuplicateGroup}
                        onRemoveGroup={onRemoveGroup}
                        masterChecked={masterChecked}
                        handleMasterChange={handleMasterChange}
                        handleKeyPress={handleKeyPress}
                        isCollapse={isCollapse}
                        setIsCollapse={setIsCollapse}
                        updateIsCollapse={updateIsCollapse} />

                    <TaskList
                        index={index}
                        board={board}
                        group={group}
                        onSaveBoard={onSaveBoard}
                        onDuplicateTask={onDuplicateTask}
                        onRemoveTask={onRemoveTask}
                        checkboxes={checkboxes}
                        handleCheckboxChange={handleCheckboxChange} />

                    <GroupFooter
                        group={group}
                        board={board}
                        onSaveBoard={onSaveBoard} />

                </div>
            )}
        </Draggable >
    )
}
