import { Draggable, Droppable } from "react-beautiful-dnd";
import { TaskPreview } from "./TaskPreview";

export function TaskList({ index, board, group, onSaveBoard, onDuplicateTask, onRemoveTask, checkboxes, handleCheckboxChange }) {
    return (
        <Droppable droppableId={group.id}>
            {(provided) => (
                <div
                    className="task-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    {board.groups[index].tasks.map((task, index) => (
                        <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                        >
                            {(provided) => (
                                <div
                                    key={task.id}
                                    className="dnd-task main-layout full"
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                >
                                    <TaskPreview
                                        key={task.id}
                                        board={board}
                                        group={group}
                                        task={task}
                                        onSaveBoard={onSaveBoard}
                                        onDuplicateTask={onDuplicateTask}
                                        onRemoveTask={onRemoveTask}
                                        isChecked={checkboxes[task.id]}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}