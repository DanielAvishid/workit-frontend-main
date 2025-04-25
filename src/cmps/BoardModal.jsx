import { Avatar, Button, EditableHeading, Icon } from "monday-ui-react-core"
import { Close, Board } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { GoHomeFill } from "react-icons/go";
import { utilService } from "../services/util.service";

export function BoardModal({ board, onSaveBoard, handleKeyPress, onCloseModal }) {

    return (
        <section className="modal-full" onClick={onCloseModal}>
            <div className="modal-container" onClick={(ev) => ev.stopPropagation()}>
                <div className="content-container">
                    <Button className="close-btn" kind={Button.kinds.TERTIARY} onClick={onCloseModal}>
                        <Icon className="close-icon" icon={Close} />
                    </Button>
                    <div className="container">
                        <div className="left-container">
                            <div className="heading">
                                <EditableHeading
                                    className="edit-board-title"
                                    onBlur={(ev) => onSaveBoard({ board, key: 'title', value: ev.target.value })}
                                    onKeyDown={handleKeyPress}
                                    type="h1"
                                    value={board.title} />

                            </div>
                            <div className={`description-container`}>
                                <EditableHeading
                                    placeholder="Add a description here to make sure your team is aligned on the purpose"
                                    value={board.description}
                                    className="edit-description"
                                    onBlur={(ev) => onSaveBoard({ board, key: 'description', value: ev.target.value })}
                                    onKeyDown={handleKeyPress}
                                    inputType="textarea"
                                    type="h6" />
                            </div>
                        </div>
                        <div className="info-container">
                            <h3 className="title">Board info</h3>
                            <div className="more-info">
                                <h5>Workspace</h5>
                                <div className="body">
                                    <div className="workspace-icon">
                                        <span className="letter">M</span>
                                        <Icon className="home-icon" icon={GoHomeFill} />
                                    </div>
                                    <p>Main workspace</p>
                                </div>
                            </div>
                            <div className="more-info">
                                <h5>Created by</h5>
                                <div className="body">
                                    <Avatar
                                        className="avatar"
                                        ariaLabel={board.createdBy.fullname}
                                        size="small"
                                        src={board.createdBy.imgUrl}
                                        type="img"
                                    />
                                    <p>{utilService.formatDateFromTimestamp(board.archivedAt)}</p>
                                </div>
                            </div>
                            <div className="more-info">
                                <h5>Owners</h5>
                                <div className="body">
                                    <Avatar
                                        className="avatar"
                                        ariaLabel={board.createdBy.fullname}
                                        size="small"
                                        src={board.createdBy.imgUrl}
                                        type="img"
                                    />
                                    <p>{board.createdBy.fullname}</p>
                                </div>
                            </div>
                            <div className="more-info">
                                <h5>Board type</h5>
                                <div className="body">
                                    <div className="board-info">
                                        <Icon className="board-icon" icon={Board} />
                                        <p>This board is public, visible to all team members.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}