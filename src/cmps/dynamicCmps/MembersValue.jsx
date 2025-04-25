
import { Avatar } from "monday-ui-react-core";

export function MembersValue({ activity, board }) {
    console.log(activity);
    const prevValLength = activity.prevValue.length
    const newValLength = activity.newValue.length

    const memberId = (prevValLength > newValLength) ? activity.prevValue[prevValLength - 1] : activity.newValue[newValLength - 1]
    const text = (prevValLength > newValLength) ? 'Removed' : 'Added'

    const member = board.members.find(member => member._id === memberId);

    return (
        <div className="members-value change-values">
            <div className="flex align-center justify-center relative">
                <span className="ellipsis-text members-action">{text}</span>
            </div>
            <div></div>
            <div className="flex align-center justify-center">
                <Avatar
                    type={Avatar.types.IMG}
                    src={member.imgUrl}
                    className="avatar"
                />
            </div>
        </div >
    )
}