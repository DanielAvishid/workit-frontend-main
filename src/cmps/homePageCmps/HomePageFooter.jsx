import { useNavigate } from "react-router-dom"
import { Icon } from "monday-ui-react-core"
import { MoveArrowRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function HomePageFooter() {

    const navigate = useNavigate()

    return (
        <div className="full-width-section">
            <div className="container">
                <div className="content">
                    <h2>
                        <br />
                        <br />
                        <span>Deliver your best work </span><b>with workit.com</b>
                    </h2>
                    <div className="small-words">
                        <span>No credit card needed   <span className="icon">✦</span>    Unlimited time on Free plan</span>
                    </div>
                    <div className="btn-container" >
                        <button
                            className="btn"
                            onClick={() => navigate('/board')}>
                            <span className="span">Get Started</span>
                            <Icon className="icon" icon={MoveArrowRight} iconSize="18" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}