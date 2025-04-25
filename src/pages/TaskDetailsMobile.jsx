import { Avatar, Icon } from "monday-ui-react-core";
import { LuSendHorizonal, LuMoreVertical } from "react-icons/lu";
import { BsFillShareFill } from "react-icons/bs";
import { MoveArrowLeft, DropdownChevronRight, Board, Update, AddNewDoc } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useEffect, useRef, useState } from "react";
import { getById } from "../store/actions/board.action";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { utilService } from "../services/util.service";

export function TaskDetailsMobile({ task, groupId, board, onSaveBoard }) {
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const inputRef = useRef()
    const navigate = useNavigate()

    function onUpdateClick(updateValue) {
        const value = task.updates || []
        const update = {
            id: utilService.makeId(),
            text: updateValue,
            at: Date.now(),
            by: user ? user : {
                "_id": "UjCos",
                "fullname": "Guest",
                "imgUrl": "https://style.monday.com/static/media/person2.24c7233e.png"
            }
        }
        value.unshift(update)
        onSaveBoard({ type: 'task', board, groupId, taskId: task.id, key: 'updates', value })
        inputRef.current.value = ''
    }

    return (
        < section className="task-details-mobile" >
            <div className="nav-container">
                <Icon className="nav-icon" icon={MoveArrowLeft} onClick={() => navigate(`/board/${board._id}`)} />
                <div className="icon-container">
                    <div>
                        <Icon className="share-icon" icon={BsFillShareFill} />
                    </div>
                    <div>
                        <Icon className="menu-icon" icon={LuMoreVertical} />
                    </div>
                </div>
            </div>
            <div className="task-info-container">
                <h2>{task.title}</h2>
                <div className="group-info-container">
                    <span>New Board</span>
                    <Icon className="arrow-right-icon" icon={DropdownChevronRight} />
                    <span>Group Title</span>
                </div>
                <div className="mode-nav-container">
                    <button className="btn">
                        <Icon className="icon" icon={Board} />
                        <span>Columns</span>
                    </button>
                    <button className="btn update-btn">
                        <Icon className="icon" icon={Update} />
                        <span>Updates</span>
                    </button>
                    <button className="btn">
                        <Icon className="icon" icon={AddNewDoc} />
                        <span>Files</span>
                    </button>
                </div>
                {task.updates && task.updates.map(update =>
                    <div className="update-container">
                        <div className="update-info flex align-center">
                            <Avatar
                                className="avatar"
                                ariaLabel={update.by.fullname}
                                size="medium"
                                src={update.by.imgUrl}
                                type="img"
                            />
                            <h3>{update.by.fullname}</h3>
                            <span>{utilService.getTimePassed(update.at)} ago</span>
                        </div>
                        <div className="update-content">{update.text}</div>
                        <Icon className="menu-icon" icon={LuMoreVertical} />
                    </div>
                )}
            </div>
            <div className="write-update">
                <div className="input-container">
                    <input className="update-input" ref={inputRef} type="text" placeholder="Write your update..." />
                    <Icon className="send-icon" icon={LuSendHorizonal} onClick={() => onUpdateClick(inputRef.current.value)} />
                </div>
            </div>
        </section >
    )
}