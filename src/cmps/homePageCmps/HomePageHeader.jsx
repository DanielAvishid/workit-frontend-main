import { Icon } from "monday-ui-react-core"
import imgUrl from '../../assets/img/monday-img.png'
import { useNavigate } from "react-router-dom"
import { MoveArrowRight } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function HomePageHeader({ isScroll }) {

    const navigate = useNavigate()

    return (
        <div className={`header-container ${isScroll ? 'scrolled' : ''}`}>
            <header className={`header ${isScroll ? 'scrolled' : ''}`}>
                <div className="logo">
                    <img src={imgUrl} alt="" />
                    <span className="span">
                        workit
                    </span>
                </div>
                <div className="get-started">
                    <button className="start-btn" onClick={() => navigate('/login')}>
                        <span className="span">Get Started</span>
                        <Icon className="icon" icon={MoveArrowRight} iconSize="14" />
                    </button>
                </div>
            </header>
        </div>
    )
}