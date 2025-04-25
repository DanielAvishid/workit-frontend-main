import { Button } from "monday-ui-react-core";
import { useState } from "react";
import { utilService } from "../../services/util.service";

export function InviteMemberModal({ task, group, board, membersIds, setIsInviteModalOpen, onSaveBoard }) {
    const [emailToAdd, setEmailToAdd] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)

    const handleChange = (ev) => {
        const email = ev.target.value
        setEmailToAdd(email)
        setIsButtonDisabled(!utilService.isEmailValid(email))
    }

    const onInviteMember = () => {
        const memberId = utilService.makeId()
        const value = [...board.members, { _id: memberId, fullname: emailToAdd, imgUrl: "https://as1.ftcdn.net/v2/jpg/02/43/12/34/1000_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }]

        onSaveBoard({ board, key: "members", value })
        onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: "members", value: [...membersIds, memberId] })
        setIsInviteModalOpen(false)
    }


    return (
        <div className="invite-member-modal" >
            <div className="header-container">
                <span>Type in email address to invite</span>
            </div>

            <input
                type="text"
                placeholder="Enter email"
                value={emailToAdd}
                onChange={handleChange} />

            <div className="buttons-container flex">
                {/* <button onClick={(ev) => console.log(ev)}>Cancel</button>
                                    <button onClick={(ev) => console.log(ev)}>Invite new member</button> */}
                <Button kind={Button.kinds.TERTIARY} size={Button.sizes.SMALL} onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                <Button size={Button.sizes.SMALL} disabled={isButtonDisabled} onClick={onInviteMember}>Invite new member</Button>
            </div>
        </div>
    )
}