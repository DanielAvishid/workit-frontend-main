import { Icon } from "monday-ui-react-core"
import { useNavigate } from "react-router-dom"
import { MoveArrowRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function SideBySide() {

    const navigate = useNavigate()

    return (
        <div className="side-by-side-text-section">
            <div className="content">
                <div className="big-title">
                    <b>The Work OS that lets you <br /> shape workflows, your way</b>
                </div>
                <div className="right-container">
                    <p>Boost your team's alignment, efficiency, and productivity by customizing any workflow to fit your needs.</p>
                    <div className="btn-container">
                        <button className="btn" onClick={() => navigate('/login')}>
                            <span className="span">Get Started</span>
                            <Icon className="icon" icon={MoveArrowRight} iconSize="14" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}