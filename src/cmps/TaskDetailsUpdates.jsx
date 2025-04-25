import { Avatar, Button, Icon, Menu, MenuButton, MenuItem } from "monday-ui-react-core"
import { useRef } from "react"
import { Time, Delete } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { utilService } from "../services/util.service"

export function TaskDetailsUpdates({ task, onRemoveUpdate, onUpdateClick, setIsUpdateEditor, isUpdateEditor }) {

    const textareaRef = useRef(null)

    function handleTextareaHeight() {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
    }

    return (
        <section className="task-details-updates">
            <div className="container">
                <div className="header-container">
                    {!isUpdateEditor && <button className="update-btn" onClick={() => setIsUpdateEditor(true)}>
                        Write an update...
                    </button>}
                    {isUpdateEditor && <div className="update-editor">
                        <div className="editor-toolbar"></div>
                        <div className="textarea-container">
                            <textarea
                                ref={textareaRef}
                                onInput={handleTextareaHeight}
                                rows={1}>
                            </textarea>
                        </div>
                    </div>}
                    {isUpdateEditor && <div className="submit-container">
                        <Button size="small" onClick={() => onUpdateClick(textareaRef.current.value)}>
                            Update
                        </Button>
                    </div>}
                </div>
                <div className="updates-list">
                    {task.updates && task.updates.map(update =>
                        <div key={update.id} className="update">
                            <div className="update-header">
                                <Avatar
                                    className="avatar"
                                    size="large"
                                    src={update.by.imgUrl}
                                    type="img"
                                />
                                <div className="fullname">
                                    <span>{update.by.fullname}</span>
                                </div>
                                <div className="update-info">
                                    <div className="flex align-center">
                                        <Icon icon={Time} className="time-icon" />
                                        <span>{utilService.getTimePassed(update.at)}</span>
                                    </div>
                                    <MenuButton
                                        className="update-menu">
                                        <Menu id="menu" size="large" className="menu-modal">
                                            <MenuItem
                                                icon={Delete}
                                                title="Delete"
                                                onClick={() => onRemoveUpdate(update.id)} />
                                        </Menu>
                                    </MenuButton>
                                </div>
                            </div>
                            <div className="update-body">
                                <p>{update.text}</p>
                            </div>
                        </div>
                    )}
                    {!task.updates.length && <div className="no-updates">
                        <div>
                            <img src="https://cdn.monday.com/images/pulse-page-empty-state.svg" alt="" />
                            <h2>No updates yet for this item</h2>
                            <p>
                                Be the first one to update about progress, mention someone <br />
                                or upload files to share with your team members
                            </p>
                        </div>
                    </div>}
                </div>
            </div>
        </section>
    )
}