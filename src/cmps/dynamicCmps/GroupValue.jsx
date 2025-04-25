export function GroupValue({ activity, board }) {

    const style = {
        color: board.groups[board.groups.length - 1].style.backgroundColor
    }

    return (
        <div className="group-value flex relative">
            <span>Group:</span>
            <span style={style} className="group-title ellipsis-text">{activity.title}</span>
        </div>
    )
} 