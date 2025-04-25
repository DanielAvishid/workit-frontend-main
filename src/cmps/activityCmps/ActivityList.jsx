import { useState } from "react";
import { ActivityPreview } from "./ActivityPreview";

export function ActivityList({ board }) {

    const activities = board.activities || []
    const [filteredActivities, setFilteredActivities] = useState(activities)

    return (
        <section className="activity-list">
            {filteredActivities.map((activity, idx) => (
                <ActivityPreview key={idx} board={board} activity={activity} />
            ))}
        </section>
    )
}