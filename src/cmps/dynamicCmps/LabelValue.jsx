import { NavigationChevronRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { Icon } from "monday-ui-react-core";

export function LabelValue({ activity, board, cmpType }) {

    const prevLabel = board[cmpType + 'Labels'].find((label) => label.id === activity.prevValue)
    const newLabel = board[cmpType + 'Labels'].find((label) => label.id === activity.newValue)

    const newLabelStyle = {
        backgroundColor: newLabel.color
    }

    const prevLabelStyle = {
        backgroundColor: prevLabel.color
    }

    const prevTitle = prevLabel.title
    const newTitle = newLabel.title

    return (
        <div className="change-values flex align-center">
            <div className="label-value relative flex align-center justify-center" style={prevLabelStyle}>
                <span className="ellipsis-text">{prevTitle}</span>
            </div>
            <Icon icon={NavigationChevronRight} className="change-icon" />
            <div className="label-value relative flex align-center justify-center" style={newLabelStyle}>
                <span className="ellipsis-text">{newTitle}</span>
            </div>
        </div>
    )
}