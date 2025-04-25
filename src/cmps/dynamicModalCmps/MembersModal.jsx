import { Avatar, Icon, Search } from "monday-ui-react-core"
import { Invite, Close } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function MembersModal({ task, group, board, membersIds, handleSearch, searchTerm, participateMembers, filteredMembers, setIsInviteModalOpen, onRemoveMember, onSaveBoard }) {
    return (
        <div className="members-modal">
            <section className="participate-members flex">
                {participateMembers.length > 0 && participateMembers.map((member) => {
                    return (
                        <div className="member-container flex align-center" key={member._id}>
                            <Avatar
                                className="avatar"
                                key={member._id}
                                size={Avatar.sizes.SMALL}
                                type={Avatar.types.IMG}
                                src={member.imgUrl}
                                ariaLabel={member.fullname}
                            />
                            <span className="member-name">{member.fullname}</span>
                            <div className="remove-member flex align-center justify-center" onClick={() => onRemoveMember(member._id)}>
                                <Icon
                                    icon={Close}
                                    iconSize={8}
                                />
                            </div>
                        </div>
                    )
                })
                }
            </section>
            <section className="member-list-container">
                <Search
                    size={Search.sizes.SMALL}
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search names, roles or teams"
                    wrapperClassName="monday-storybook-search_size"
                />
                <div className="suggest-container">
                    <div className="suggest-header"><span>Suggested people</span></div>
                    {filteredMembers.map((member) => (
                        <div className="member-row flex align-center" key={member._id} onClick={() => onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: "members", value: [...membersIds, member._id] })}>
                            <div className="avatar-container flex align-center justify-center">
                                <Avatar
                                    className="avatar"
                                    key={member._id}
                                    size={Avatar.sizes.SMALL}
                                    type={Avatar.types.IMG}
                                    src={member.imgUrl}
                                    ariaLabel={member.fullname}
                                />
                            </div>
                            <span className="member-name">{member.fullname}</span>
                        </div>
                    ))}
                    <div className="invite-row flex align-center">
                        <div className="icon-container flex align-center justify-center">
                            <Icon
                                // customColor={group.style.backgroundColor}
                                className="invite-icon flex align-center justify-center"
                                icon={Invite}
                                iconSize={16}
                            />
                        </div>
                        <span className="invite-member" onClick={() => setIsInviteModalOpen(true)}>Invite a new member by email</span>
                    </div>
                </div>
            </section>
        </div>
    )
}