import { AvatarGroupCmp } from "../utilsCmps/AvatarGroupCmp"

export function MembersSummary({ board, group }) {

    const groupMembers = group.tasks.map(task => task.members)
    const flattenedGroupMembers = [].concat(...groupMembers)
    const uniqueGroupMemberIds = [...new Set(flattenedGroupMembers)]
    const boardMembers = board.members

    const membersInfo = uniqueGroupMemberIds.map(memberId => {
        const member = boardMembers.find(boardMember => boardMember._id === memberId);
        return member || {}; // Ensure a member object, even if not found
    })

    return (
        <div className="members-summary flex align-center justify-center">
            {membersInfo.length > 0 ? <AvatarGroupCmp members={membersInfo} /> : <span></span>}
        </div >
    )
}