import { Button, Icon, IconButton, TextField } from "monday-ui-react-core";
import { DropdownChevronDown, PersonRound, Rotate, DocShareable } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { ActivityList } from "./ActivityList";

export function ActivityDetails({ board, searchTerm, handleSearch }) {
    return (
        <main className="activity-details">

            {/* <div className="automation-activity flex align-center justify-between">
                <span>Other activities</span>
                <div>
                    <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}>Integration Activity</Button>
                    <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}>Automations Activity</Button>
                </div>
            </div> */}

            <div className="activity-filter flex justify-between">
                <div className="flex">
                    <Button size={Button.sizes.SMALL} className="filter-log">
                        <span>Filter Log</span>
                        <Icon icon={DropdownChevronDown} iconSize={18} className="icon" />
                    </Button>
                    <TextField value={searchTerm} onChange={handleSearch} placeholder="Filter by name" />
                    <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} className="person" ariaLabel="Filter by person">
                        <Icon icon={PersonRound} iconSize={22} className="icon" />
                        <span>person</span>
                    </Button>
                </div>
                {/* <div className="options flex">
                    <IconButton icon={Rotate} kind={IconButton.kinds.TERTIARY} size={IconButton.sizes.SMALL} ariaLabel="Refresh" />
                    <IconButton icon={DocShareable} kind={IconButton.kinds.TERTIARY} size={IconButton.sizes.SMALL} ariaLabel="Export" />
                </div> */}
            </div>

            <ActivityList board={board} />

        </main>
    )
}