import { Avatar, AvatarGroup } from "monday-ui-react-core"

export function AvatarGroupCmp({ members }) {
    return (
        <AvatarGroup max={1} size={Avatar.sizes.SMALL} className="avatar-group-cmp">
            {members.length > 0 ? members.map((member) => {
                return (
                    <Avatar
                        key={member._id}
                        size={Avatar.sizes.SMALL}
                        type={Avatar.types.IMG}
                        src={member.imgUrl}
                        ariaLabel={member.fullname}
                    />
                )
            }) :
                <Avatar
                    className="default-avatar"
                    size={Avatar.sizes.SMALL}
                    type={Avatar.types.IMG}
                    src={"https://cdn.monday.com/icons/dapulse-person-column.svg"}
                />
            }
        </AvatarGroup>
    )
}