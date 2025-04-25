import { useNavigate } from "react-router"
import { Close, Home, Delete } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Avatar, AvatarGroup, Button, EditableHeading, Icon, Menu, MenuButton, MenuItem, Tab, TabList } from "monday-ui-react-core"
import { AvatarGroupCmp } from "./utilsCmps/AvatarGroupCmp"
import { useSelector } from "react-redux"

export function TaskDetailsHeader({ boardId, task, onRemoveTask, setCurrentTab, onTaskTitleChange, handleKeyPress }) {

    const navigate = useNavigate()
    const board = useSelector(storeState => storeState.boardModule.board)

    const membersArr = task.members.map((memberId) => board.members.find((member) => member._id === memberId))

    return (
        <section className="task-details-header">
            <div className="title-container">
                <div className="close-btn-container">
                    <Button
                        className="close-btn"
                        kind={Button.kinds.TERTIARY}
                        onClick={() => navigate(`/board/${boardId}`)}>
                        <Icon className="close-icon" icon={Close} />
                    </Button>
                </div>
                <div className="task-edit-container">
                    <EditableHeading
                        className="task-title-input"
                        type="h2"
                        value={task.title}
                        onBlur={(ev) => onTaskTitleChange(ev)}
                        onKeyDown={handleKeyPress} />
                    <div className="subscribe-container">
                        <button className="subscribe-btn flex">
                            {/* <AvatarGroupCmp members={membersArr} /> */}
                            <AvatarGroup
                                className="avatar-group"
                                size="small">
                                {membersArr && membersArr.map(member =>
                                    <Avatar
                                        key={member._id}
                                        ariaLabel={member.fullname}
                                        src={member.imgUrl}
                                        type="img"
                                    />
                                )}
                            </AvatarGroup>
                        </button>
                        <MenuButton className="subscriber-menu">
                            <Menu
                                id="menu"
                                size="large"
                                className="menu-modal">
                                <MenuItem
                                    icon={Delete}
                                    title="Delete"
                                    onClick={() => onRemoveTask({ boardId, taskId })} />
                            </Menu>
                        </MenuButton>
                    </div>
                </div>
            </div>
            <div className="tabs-container">
                <TabList className="tab-list">
                    {['Updates', 'Files', 'Activity Log'].map((tab, idx) =>
                        <Tab
                            icon={tab === 'Updates' ? Home : null}
                            key={tab[idx]}
                            tabInnerClassName={tab === 'Updates' ? 'tab updates-tab' : 'tab'}
                            onClick={() => setCurrentTab(tab)}>
                            {tab}
                        </Tab>
                    )}
                </TabList>
            </div>
        </section>
    )
}