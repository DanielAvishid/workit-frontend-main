import { EditableHeading, Icon, Menu, MenuButton, MenuItem } from "monday-ui-react-core";
import { Add, Duplicate, Delete, DropdownChevronRight, Open, Minimize } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { ProgressBar } from "./ProgressBar";
import { MembersSummary } from "./dynamicSummaryCmps/MembersSummary";
import { LabelsSummary } from "./dynamicSummaryCmps/LabelsSummary";
import { TimelineSummary } from "./dynamicSummaryCmps/TimelineSummary";
import { Draggable } from "react-beautiful-dnd";

export function GroupPreviewCollapse({ index, handleKeyPress, board, group, onDuplicateGroup, onSaveBoard, onRemoveGroup, isCollapse, setIsCollapse, updateIsCollapse }) {

    const style = {
        borderColor: group.style.backgroundColor
    }

    const renderCmpSpan = (cmp) => {
        switch (cmp.type) {
            case 'timeline':
            case 'date':
                return <TimelineSummary group={group} type={cmp.type} />
            case 'status':
            case 'priority':
                return <LabelsSummary group={group} board={board} type={cmp.type} />
            default:
                return
        }
    }

    return (
        <Draggable draggableId={group.id} index={index}>
            {(provider) => (
                <div
                    {...provider.draggableProps}
                    {...provider.dragHandleProps}
                    ref={provider.innerRef}
                    className="collapse group-preview main-layout full"
                >


                    <div className="group-menu-container start flex justify-end ">
                        <MenuButton className="group-menu">
                            <Menu id="menu" size="large">
                                <MenuItem icon={Open} title="Expand all groups" onClick={() => updateIsCollapse(false, isCollapse)} />
                                <MenuItem icon={Minimize} title="Collapse all groups" onClick={() => updateIsCollapse(true, isCollapse)} />
                                <MenuItem icon={Duplicate} title="Duplicate this group" onClick={() => onDuplicateGroup({ boardId: board._id, groupId: group.id })} />
                                <MenuItem icon={Delete} title="Delete" onClick={() => onRemoveGroup({ boardId: board._id, groupId: group.id })} />
                            </Menu>
                        </MenuButton>
                    </div>
                    <div className="table table-container first last" style={style}>
                        <div className="table-row flex group-preview-collapse">
                            <header className="title-col flex column justify-center">
                                <div className="flex">
                                    <div className="flex align-center">
                                        <Icon
                                            customColor={group.style.backgroundColor}
                                            icon={DropdownChevronRight}
                                            iconSize={22}
                                            style={{ color: group.style.backgroundColor }}
                                            className="Collapse-group"
                                            onClick={() => setIsCollapse({ ...isCollapse, [group.id]: false })}
                                        />
                                        <EditableHeading
                                            type={EditableHeading.types.h4}
                                            value={group.title}
                                            tooltip='Click to Edit'
                                            tooltipPosition="bottom"
                                            customColor={group.style.backgroundColor}
                                            onBlur={(ev) => onSaveBoard({ type: 'group', board, groupId: group.id, key: 'title', value: ev.target.value })}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </div>
                                </div>
                                <div className="count">
                                    {group.tasks.length === 0 && "No items"}
                                    {group.tasks.length === 1 && "1 project"}
                                    {group.tasks.length > 1 && `${group.tasks.length} Items`}
                                </div>
                            </header>
                            {board.cmpsOrder.map((cmp, idx) => (
                                <div className={`${cmp.type}-container flex column align-center justify-center`}>
                                    <div className="flex align-center justify-center">
                                        <span className="cmp-title">{cmp.title}</span>
                                    </div>
                                    <div key={idx} className={`${cmp.type}-col ${cmp.type} flex align-center justify-center`}>
                                        {renderCmpSpan(cmp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Draggable >
    )
}