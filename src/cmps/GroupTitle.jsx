import { EditableHeading, Icon, Menu, MenuButton, MenuItem } from "monday-ui-react-core"
import { Duplicate, Delete, DropdownChevronDown, Minimize, Open } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function GroupTitle({ group, board, onSaveBoard, onDuplicateGroup,
    onRemoveGroup, handleKeyPress, isCollapse, setIsCollapse, updateIsCollapse }) {

    return (
        <div className="group-title main-layout full">
            <div className="group-menu-container start flex justify-end align-center">
                <MenuButton className="group-menu">
                    <Menu id="menu" size="large">
                        <MenuItem icon={Open} title="Expand all groups" onClick={() => updateIsCollapse(false, isCollapse)} />
                        <MenuItem icon={Minimize} title="Collapse all groups" onClick={() => updateIsCollapse(true, isCollapse)} />
                        <MenuItem icon={Duplicate} title="Duplicate this group" onClick={() => onDuplicateGroup({ boardId: board._id, groupId: group.id })} />
                        <MenuItem icon={Delete} title="Delete" onClick={() => onRemoveGroup({ boardId: board._id, groupId: group.id })} />
                    </Menu>
                </MenuButton>
            </div>
            <div className="title-name flex align-center">
                <span className="arrow-icon flex" style={{ color: group.style.backgroundColor }}>

                    <Icon
                        customColor={group.style.backgroundColor}
                        icon={DropdownChevronDown}
                        iconSize={22}
                        ariaLabel="Collapse group"
                        onClick={() => setIsCollapse({ ...isCollapse, [group.id]: true })}
                    />
                </span>
                <span className="title-name-edit flex align-center">
                    <EditableHeading
                        type={EditableHeading.types.h4}
                        value={group.title}
                        tooltip='Click to Edit'
                        tooltipPosition="bottom"
                        customColor={group.style.backgroundColor}
                        onBlur={(ev) => onSaveBoard({ type: 'group', board, groupId: group.id, key: 'title', value: ev.target.value })}
                        onKeyDown={(ev) => handleKeyPress(ev, 'title')}
                    />
                    <span className="items-count">
                        {group.tasks.length === 0 && "No items"}
                        {group.tasks.length === 1 && "1 project"}
                        {group.tasks.length > 1 && `${group.tasks.length} Items`}
                    </span>
                </span>
            </div>
        </div>
    )
}