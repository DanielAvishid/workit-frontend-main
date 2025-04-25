import { utilService } from "../../services/util.service";
import { PiWarningCircleFill, PiCheckCircleFill } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { MdAddCircle } from "react-icons/md";
import { Icon } from "monday-ui-react-core";
import { Calendar } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { DueDateModal } from "../dynamicModalCmps/DueDateModal";


export function DueDate({ info, task, group, board, onSaveBoard, setIsTaskFocus }) {

    const [newDate, setNewDate] = useState(new Date())

    const dueDateCell = useRef();
    const { isFocus, setIsFocus } = useClickOutside(dueDateCell);
    const { isFocus: isModalOpen, setIsFocus: setIsModalOpen } = useClickOutside(dueDateCell);

    const dueDate = (info) ? utilService.formatDateFromTimestamp(info) : null
    const statusLabels = board.statusLabels
    const taskStatus = task.status

    const isDone = statusLabels.some(label => label.color === '#00c875' && label.id === taskStatus);

    const currentDate = new Date();
    const isDatePass = new Date(info) < currentDate;

    const handleDatePick = (date) => {
        console.log('date', date);
        setNewDate(date)
        const startDate = date._d.getTime()
        console.log('startDate', startDate);
        if (startDate) {
            onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: "date", value: startDate })
        }
    }

    const onClickDueDateCell = () => {
        setIsTaskFocus(true)
        setIsFocus(true)
        setIsModalOpen(!isModalOpen)
    }


    return (
        <td
            className={`due-date date-col flex align-center justify-center ${isFocus ? 'focus' : ''}`}
            ref={dueDateCell}
            onClick={onClickDueDateCell}
        >
            {info ?
                <div className="inner-container flex align-center justify-center">
                    {isDone ?
                        isDatePass ?
                            <PiWarningCircleFill className="sign check" /> :
                            <PiCheckCircleFill className="sign check" />
                        :
                        <PiWarningCircleFill className="sign warning" />
                    }
                    <span className={`${isDatePass ? 'date-pass' : ''}`}>{dueDate}</span>
                    <AiOutlineClose className="remove-date" onClick={() => onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: "date", value: null })} />
                </div>
                :
                <div className="empty-inner-container flex align-center">
                    <MdAddCircle className="add-date" />
                    <Icon icon={Calendar} title="Calendar" iconSize={22} />
                </div>
            }

            {isModalOpen && <DueDateModal newDate={newDate} handleDatePick={handleDatePick} />}

        </td >
    );
}