import { Outlet, useOutletContext } from "react-router";
import { GroupPreview } from "./GroupPreview"
import { Add } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Button, Icon } from "monday-ui-react-core";
import { boardService } from "../services/board.service";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckboxModal } from "./CheckboxModal";

export function GroupList() {
    const [board, onSaveBoard, onRemoveGroup, onRemoveTask, onDuplicateGroup, onDuplicateTask, isCollapse, setIsCollapse, updateIsCollapse, onAddGroup] = useOutletContext()
    const selectedTasks = useSelector(state => state.boardModule.selectedTasks)

    return (
        <div className="group-list main-layout full relative">
            <Droppable droppableId="groups" type="groups">
                {(provided, snapshot) => (
                    <section
                        className="main-layout full"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {board.groups.map((group, index) => (

                            <article
                                key={group.id}
                                className="main-layout full"
                                data-group-id={group.id}
                            >
                                <GroupPreview
                                    index={index}
                                    board={board}
                                    group={group}
                                    onSaveBoard={onSaveBoard}
                                    onRemoveGroup={onRemoveGroup}
                                    onRemoveTask={onRemoveTask}
                                    onDuplicateGroup={onDuplicateGroup}
                                    onDuplicateTask={onDuplicateTask}
                                    isCollapse={isCollapse}
                                    setIsCollapse={setIsCollapse}
                                    updateIsCollapse={updateIsCollapse}
                                />
                            </article>
                        ))}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
            {Object.keys(selectedTasks).length > 0 && <CheckboxModal board={board} onSaveBoard={onSaveBoard} />}
            {board.groups.length !== 0 && <div className="add-group-container middle">
                <Button
                    className="new-group-btn"
                    noSidePadding={true}
                    kind={Button.kinds.SECONDARY}
                    onClick={onAddGroup}>
                    <Icon className="add-icon" icon={Add} />
                    <span>Add new group</span>
                </Button>
            </div>}
        </div>
    )
}
