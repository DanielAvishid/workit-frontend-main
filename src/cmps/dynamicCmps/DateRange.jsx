import { utilService } from "../../services/util.service"
import { NavigationChevronRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Icon } from "monday-ui-react-core";

export function DateRange({ activity }) {

    const { text: prevText } = utilService.getDateToShow(activity.prevValue)
    const { text: newText } = utilService.getDateToShow(activity.newValue)

    return (
        <div className="members-value change-values">
            <div className={`date-range relative flex align-center justify-center ${prevText ? 'prev-val' : ''}`}>
                <span className="ellipsis-text">{prevText ? prevText : '-'}</span>
            </div>
            <Icon icon={NavigationChevronRight} className="change-icon" />
            <div className={`date-range relative flex align-center justify-center ${newText ? 'new-val' : ''}`}>
                <span className="ellipsis-text">{newText ? newText : '-'}</span>
            </div>
        </div >
    )
}