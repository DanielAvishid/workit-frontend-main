import { AvatarGroupCmp } from "../utilsCmps/AvatarGroupCmp";

export function UpcomingFeatures({ board }) {

    const upcomingTasks = board.groups
        .flatMap((group) =>
            group.tasks
                .filter((task) => task.date && task.date > Date.now())
                .map((task) => ({
                    bgc: group.style.backgroundColor,
                    title: task.title,
                    date: task.date,
                    membersIds: task.members
                }))
        )
        .sort((a, b) => a.date - b.date)
        .map((task) => ({
            bgc: task.bgc,
            title: task.title,
            date: timeAgo(task.date),
            membersIds: task.membersIds
        }));

    const membersArr = upcomingTasks.flatMap((task) =>
        task.membersIds.map((memberId) => board.members.find((member) => member._id === memberId))
    );
    console.log(membersArr);
    console.log(upcomingTasks);

    return (
        <div className="upcoming-features">
            <h4>Upcoming features</h4>
            <div className="tasks-container">

                {upcomingTasks.map((task, index) => {

                    const participateMembers = task.membersIds.map((memberId) => {
                        return board.members.find(member => member._id === memberId)
                    })

                    return (<div style={{ borderColor: task.bgc }} key={index} className="upcoming-task">
                        <span className="title">{task.title}</span>
                        <AvatarGroupCmp members={participateMembers} />
                        <span>{task.date}</span>
                    </div>)
                })}
            </div>
        </div>
    )
}

function timeAgo(timestamp) {
    const now = new Date();
    const targetDate = new Date(timestamp);

    // Calculate the time difference in milliseconds
    const timeDifference = targetDate - now;

    // Calculate the number of days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference >= 30) {
        const monthsDifference = Math.floor(daysDifference / 30);
        if (monthsDifference >= 12) {
            const yearsDifference = Math.floor(monthsDifference / 12);
            return yearsDifference > 1 ? `${yearsDifference} years` : "1 year";
        } else {
            return monthsDifference > 1 ? `${monthsDifference} months` : "1 month";
        }
    } else if (daysDifference >= 7) {
        const weeksDifference = Math.floor(daysDifference / 7);
        return weeksDifference > 1 ? `${weeksDifference} weeks` : "1 week";
    } else {
        return daysDifference > 1 ? `${daysDifference} days` : "1 day";
    }
}
