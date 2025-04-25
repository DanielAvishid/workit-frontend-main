import { Avatar, Button, Icon } from "monday-ui-react-core"
import { DropdownChevronDown, PersonRound, Time, TextCopy, DropdownChevronRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { utilService } from "../services/util.service"
import { TaskActivityPreview } from "./TaskActivityPreview"

export function TaskDetailsActivity({ filteredActivities }) {

    return (
        <section className="task-details-activity">
            <div className="container">
                <div className="automation">
                    <span>Other activities</span>
                    <div className="flex align-center">
                        <button className="btn">Integrations Activity</button>
                        <button className="btn">Automations Activity</button>
                    </div>
                </div>
                <div className="filter">
                    <div className="filter-log">
                        <Button className="filter-log-btn" noSidePadding={true}>
                            <span>Filter Log</span>
                            <Icon className="arrow-icon" icon={DropdownChevronDown} />
                        </Button>
                    </div>
                    <div className="filter-person">
                        <Button className="filter-person-btn" noSidePadding={true} kind={Button.kinds.TERTIARY}>
                            <Icon className="person-icon" icon={PersonRound} />
                            <span>Person</span>
                        </Button>
                    </div>
                </div>
                <div className="activity-log">
                    {filteredActivities.map((activity, idx) =>
                        <TaskActivityPreview key={idx} activity={activity} />
                    )}
                </div>
            </div>
        </section>
    )
}