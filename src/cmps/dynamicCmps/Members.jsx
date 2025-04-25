import { useEffect, useRef, useState } from "react"
import { InviteMemberModal } from "../dynamicModalCmps/InviteMemberModal"
import { MembersModal } from "../dynamicModalCmps/MembersModal"
import { useClickOutside } from "../../hooks/useClickOutside"
import { AvatarGroupCmp } from "../utilsCmps/AvatarGroupCmp"


export function Members({ info, task, group, board, onSaveBoard, setIsTaskFocus }) {

    const membersIds = info
    const participateMembers = membersIds.map((memberId) => {
        return board.members.find(member => member._id === memberId)
    })

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredMembers, setFilteredMembers] = useState([])

    const suggestedMembers = board.members.filter(member => !membersIds.includes(member._id));

    const membersCell = useRef();
    const { isFocus, setIsFocus } = useClickOutside(membersCell);
    const { isFocus: isModalOpen, setIsFocus: setIsModalOpen } = useClickOutside(membersCell);

    useEffect(() => {
        setFilteredMembers(suggestedMembers)
    }, [membersIds])


    const handleSearch = (searchValue) => {
        const filtered = suggestedMembers.filter((member) =>
            member.fullname.toLowerCase().includes(searchValue.toLowerCase())
        )

        setSearchTerm(searchValue)
        setFilteredMembers(filtered)
    }

    const onRemoveMember = (memberId) => {
        const updatedMembersIds = membersIds.filter((id) => id !== memberId)
        onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: "members", value: updatedMembersIds })
    }

    const onClickMembersCell = () => {
        setIsTaskFocus(true)
        setIsFocus(true)
        setIsInviteModalOpen(false)
        setIsModalOpen(!isModalOpen)
    }

    return (
        <td
            className={`members members-col flex align-center justify-center ${isFocus ? 'focus' : ''}`}
            ref={membersCell}
            onClick={onClickMembersCell}
        >
            <span className="plus-container flex align-center justify-center">+</span>
            <AvatarGroupCmp members={participateMembers} />

            {
                isModalOpen ?
                    <div className="modal" onClick={(ev) => ev.stopPropagation()}>
                        <div className="pointer"></div>
                        {!isInviteModalOpen ?
                            <MembersModal
                                task={task}
                                group={group}
                                board={board}
                                membersIds={membersIds}
                                handleSearch={handleSearch}
                                searchTerm={searchTerm}
                                participateMembers={participateMembers}
                                filteredMembers={filteredMembers}
                                setIsInviteModalOpen={setIsInviteModalOpen}
                                onRemoveMember={onRemoveMember}
                                onSaveBoard={onSaveBoard}
                            /> :

                            <InviteMemberModal
                                task={task}
                                group={group}
                                board={board}
                                membersIds={membersIds}
                                setIsInviteModalOpen={setIsInviteModalOpen}
                                onSaveBoard={onSaveBoard}
                            />
                        }
                    </div>
                    : <></>}
        </td >
    )
}    