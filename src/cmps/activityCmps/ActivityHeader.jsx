import { Tab, TabList, IconButton } from "monday-ui-react-core"
import { Close } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useNavigate } from "react-router-dom"

export function ActivityHeader({ board }) {

    const navigate = useNavigate()
    const location = `/board/${board._id}`

    return (
        <header className="activity-header">
            <div className="close-container">
                <IconButton className="close-btn" icon={Close} kind={IconButton.kinds.TERTIARY} onClick={() => navigate(location)} />
            </div>
            <div className="title-container flex align-center">
                <span className="board-title">{board.title}</span>
                <span className="activity-type">Log</span>
            </div>
            <div className="activity-view-container">
                <TabList className="tab-list" size="sm">
                    <Tab key='avtivity' tabInnerClassName='tab'>Activity</Tab>
                    <Tab key='last-viewed' tabInnerClassName='tab'>Last Viewed</Tab>
                    <Tab key='updates' tabInnerClassName='tab'>Updates</Tab>
                </TabList>
            </div>
        </header>
    )
}