import { utilService } from "../../services/util.service";
import { DateRange } from "../dynamicCmps/DateRange";
import { GroupValue } from "../dynamicCmps/GroupValue";
import { LabelValue } from "../dynamicCmps/LabelValue";
import { MembersValue } from "../dynamicCmps/MembersValue";
import { TasksValue } from "../dynamicCmps/TasksValue";
import { TextValue } from "../dynamicCmps/TextValue";
import { Add, Calendar, Comment, Delete, Edit, Favorite, File, Invite, Person, Status, TextCopy, Time, Timeline, Update } from "monday-ui-react-core/icons"
import { Avatar, Icon } from "monday-ui-react-core";

export function ActivityPreview({ board, activity }) {

    const time = utilService.getTimePassed(activity.timestamp)
    const changeType = utilService.capitalizeFirstLetter(activity.key)
    const user = activity.by

    const title = activity.title

    let style = activity.key === 'Group Created' || activity.key === 'Group Title Change' ? {
        color: board.groups[board.groups.length - 1].style.backgroundColor
    } : {
        color: '#323338'
    }

    return (
        <div className="activity-preview flex align-center">
            <div className="activity-time flex">
                <Icon icon={Time} className="flex align-center" />
                <span className="ellipsis-text time-text">{time}</span>
            </div>
            <div className="activity-place flex align-center">
                <Avatar
                    type={Avatar.types.IMG}
                    src={user.imgUrl}
                    className="avatar"
                    ariaLabel={user.fullname}
                />
                <span className="ellipsis-text place-span" style={style}>{title}</span>
            </div>
            <div className="change-type flex align-center relative">
                <DynamicIcon type={changeType} />
                <span className="ellipsis-text">{changeType}</span>
            </div>
            <DynamicCmp activity={activity} board={board} />
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
            return null;
    }
};

function DynamicIcon({ type }) {
    switch (type) {
        case 'Members':
            return <Icon icon={Person} className="type-icon" />
        case 'Status':
        case 'Priority':
            return <Icon icon={Status} className="type-icon" />
        case 'Date':
            return <Icon icon={Calendar} className="type-icon" />
        case 'Timeline':
            return <Icon icon={Timeline} className="type-icon" />
        case 'Created':
        case 'Group Created':
            return <Icon icon={Add} className="type-icon" />
        case 'Title':
            return <Icon icon={TextCopy} className="type-icon" />
        case 'Group Title Change':
            return <Icon icon={Edit} className="type-icon" />
        case 'Deleted':
        case 'Group Deleted':
            return <Icon icon={Delete} className="type-icon" />
        // case 'File':
        //     return <Icon icon={File} className="type-icon" />
        // case 'Update':
        //     return <Icon icon={Update} className="type-icon" />
        // case 'Subscribed':
        //     return <Icon icon={Invite} className="type-icon" />
        // case 'Favorite':
        //     return <Icon icon={Favorite} className="type-icon" />
        // case 'Comment':
        //     return <Icon icon={Comment} className="type-icon" />
        default:
            break
    }
}