export function TasksValue({ activity, board }) {
    // console.log('TASKKKKK', activity);
    const currGroup = board.groups.find((group) => group.id === activity.location.group)
    const color = currGroup.style.backgroundColor

    const style = {
        color: color
    };


    return (
        <div className="tasks-values">
            <span>Group: </span>
            <span style={style}>{currGroup.title}</span>
        </div>
    )
}