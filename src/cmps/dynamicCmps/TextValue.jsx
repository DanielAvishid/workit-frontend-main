import { utilService } from "../../services/util.service";
import { NavigationChevronRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Icon } from "monday-ui-react-core";

export function TextValue({ activity }) {

    let prevValue = activity.prevValue
    let newValue = activity.newValue

    if (activity.key === 'date') {
        prevValue = activity.prevValue ? utilService.formatDateFromTimestamp(activity.prevValue) : '-'
        newValue = activity.newValue ? utilService.formatDateFromTimestamp(activity.newValue) : '-'
    }

    return (
        <div className="members-value change-values">
            <div className="relative flex align-center justify-center">
                <span className="ellipsis-text">{prevValue}</span>
            </div>
            <Icon icon={NavigationChevronRight} className="change-icon" />
            <div className="relative flex align-center justify-center">
                <span className="ellipsis-text">{newValue}</span>
            </div>
        </div >
    )
}