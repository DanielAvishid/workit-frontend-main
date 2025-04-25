import { TextCopy, Time, DropdownChevronRight } from "monday-ui-react-core/icons"
import { utilService } from "../services/util.service"
import { Avatar, Icon } from "monday-ui-react-core"

export function TaskActivityPreview({ activity }) {

    const time = utilService.getTimePassed(activity.timestamp)
    const title = activity.title

    return (
        <div className="activity-container" key={activity.title}>
            <div className="time">
                <Icon icon={Time} className="time-icon" />
                <span>{time}</span>
            </div>
            <div className="activity-and-user">
                <Avatar
                    className="avatar"
                    size="large"
                    src="https://style.monday.com/static/media/person1.de30c8ee.png"
                    type="img"
                />
                <div className="text">
                    <span>{title}</span>
                </div>
            </div>
            <div className="additional-info">
                <div className="separator"></div>
                <div className="column-type">
                    <Icon className="dynamic-icon" icon={TextCopy} />
                    <div className="text">
                        <span>Name</span>
                    </div>
                </div>
                <div className="separator"></div>
                <div className="values-log">
                    <div className="values-container">
                        <div className="old-value">
                            <span>Research</span>
                        </div>
                        <Icon className="arrow-icon" icon={DropdownChevronRight} />
                        <div className="new-value">
                            <span>Task 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DynamicCmp = ({ activity, board }) => {

    switch (activity.key) {
        case 'timeline':
            return <DateRange activity={activity} />
        case 'date':
        case 'Group Title Change':
        case 'title':
            return <TextValue activity={activity} />
        case 'status':
        case 'priority':
            return <LabelValue activity={activity} board={board} cmpType={activity.key} />
        case 'members':
            return <MembersValue activity={activity} board={board} />
        case 'tasks':
            return <TasksValue activity={activity} board={board} />
        case 'created':
            return <GroupValue activity={activity} board={board} />
        default:
            return null
    }
}