import { Avatar } from 'monday-ui-react-core'
import { utilService } from '../services/util.service';

export function MembersFilterModal({ members, setFilterBy, filterBy }) {

    const filteredPersonId = members.find(member => member._id === filterBy.person)?._id || '';


    function onSetFilterBy(memberId) {
        console.log('memberId', memberId);
        setFilterBy((prevFilterBy) => ({
            ...prevFilterBy,
            person: memberId,
        }))
    }

    return (
        <div className="person-picker-container">
            <p className="first-title">Quick person filter</p>
            <p className="second-title">Filter items and subitems by person</p>

            <div className="member-list-container">
                {members.map(member => (
                    <div className={`person-img-container ${filteredPersonId === member._id ? 'selected' : ''}`} key={member._id}>
                        {(!member.imgUrl) ? (
                            <Avatar
                                className='avatar-img'
                                size={Avatar.sizes.SMALL}
                                type={Avatar.types.TEXT}
                                text={utilService.getNameInitials(member.fullname)}
                                backgroundColor={Avatar.colors.BLACKISH}
                                ariaLabel={member.fullname}
                                onClick={() => onSetFilterBy(member)} />
                        ) : (
                            <Avatar
                                className='avatar-img'
                                ariaLabel={member.fullname}
                                size={Avatar.sizes.SMALL}
                                src={member.imgUrl}
                                type="img"
                                onClick={() => onSetFilterBy(member._id)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}