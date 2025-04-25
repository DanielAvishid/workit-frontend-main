import { Icon } from 'monday-ui-react-core'
import { Launch } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { utilService } from '../../services/util.service'
import { GiCheckeredFlag } from "react-icons/gi";

export function LaunchDate({ board }) {

    const allTaskDates = board.groups.flatMap(group =>
        group.tasks.map(task => task.date)
    );

    const validDates = allTaskDates.filter(date => date && date > Date.now());
    let farthestDate = validDates.length > 0 ? Math.max(...validDates) : null;
    const daysRemaining = farthestDate ? utilService.calculateDaysDifference([Date.now(), farthestDate]) : null;
    const farthestDateFormatted = farthestDate ? utilService.formatDateFromTimestamp(farthestDate, true) : 'N/A';

    return (
        <div className='date-counter-container flex column'>
            <h4>Days remaining: {daysRemaining}</h4>
            <div className='flex'>
                <div className='date-container'>
                    <h4>Start date</h4>
                    <span>{utilService.formatDateFromTimestamp(board.archivedAt, true)}</span>
                    <Icon icon={Launch} />
                </div>
                <div className='date-container'>
                    <h4>Completion date</h4>
                    <span>{farthestDateFormatted}</span>
                    <Icon icon={GiCheckeredFlag} />
                </div>
            </div>
        </div >
    )
}

