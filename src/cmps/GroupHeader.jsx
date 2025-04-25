import { GroupTitle } from "./GroupTitle"
import { TableHeader } from "./TableHeader"

export function GroupHeader({ group, board, onSaveBoard, onDuplicateGroup, onRemoveGroup,
    masterChecked, handleMasterChange, handleKeyPress, isCollapse, setIsCollapse, updateIsCollapse }) {

    return (
        <div className="group-header main-layout full">

            <GroupTitle
                group={group}
                board={board}
                onSaveBoard={onSaveBoard}
                onDuplicateGroup={onDuplicateGroup}
                onRemoveGroup={onRemoveGroup}
                handleKeyPress={handleKeyPress}
                isCollapse={isCollapse}
                setIsCollapse={setIsCollapse}
                updateIsCollapse={updateIsCollapse} />


            <TableHeader
                group={group}
                board={board}
                masterChecked={masterChecked}
                handleMasterChange={handleMasterChange}
                handleKeyPress={handleKeyPress} />

        </div>
    )
}