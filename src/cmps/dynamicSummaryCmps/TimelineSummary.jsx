import { useState } from "react"
import { utilService } from "../../services/util.service"

export function TimelineSummary({ group, type }) {

    const [isHover, setIsHover] = useState(false)

    const timelines = group.tasks.map(task => task[type]).filter(Boolean)
    const flattenedTimelines = [].concat(...timelines)
    const minTimeline = Math.min(...flattenedTimelines)
    const maxTimeline = Math.max(...flattenedTimelines)

    const finalDates = [minTimeline, maxTimeline]
    const { text, percentage } = utilService.getDateToShow(finalDates)

    const defaultGroupBgc = group.style.backgroundColor
    const darkerGroupBgc = utilService.darkenColor(defaultGroupBgc, 0.20)
    const bgcToShow = isHover ? darkerGroupBgc : defaultGroupBgc

    const backgroundStyle = {
        background: `linear-gradient(90deg, ${bgcToShow} ${+percentage}%, var(--inverted-color-background) 0%)`
    }

    return (
        <div
            style={backgroundStyle}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="timeline-summary date-container"
        >
            {timelines.length && minTimeline !== Infinity ? (
                <span>{isHover ? `${utilService.calculateDaysDifference(finalDates)}d` : text}</span>
            ) : (
                <span>{'-'}</span>
            )}
        </div>
    )
}