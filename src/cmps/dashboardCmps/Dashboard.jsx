import { useOutletContext } from 'react-router-dom'
import { MembersChart } from './membersChart'
import { LaunchDate } from './LaunchDate'
import { GroupListChart } from './GroupListChart'
import { UpcomingFeatures } from './UpcomingFeatures'

export function Dashboard() {
    const [board] = useOutletContext()

    return (
        <div className="dashboard full">
            <GroupListChart board={board} />
            <MembersChart board={board} />
            <div className='right-container'>
                <LaunchDate board={board} />
                <UpcomingFeatures board={board} />
            </div>
        </div>
    )
}