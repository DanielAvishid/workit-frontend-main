import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel"
import { Icon } from "monday-ui-react-core"
import { MoveArrowRight, Check } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { utilService } from "../../services/util.service";

export function HeroCTA({ hoverCardsColorsBtn, setIsHeroBtnHover, cardsColors, cardsColorsBtn, isHeroBtnHover, scale, responsive, cardsIcon, isCardChecked, isCardHover, cardsTitles, handleCardClick, handleMouseHover }) {
    return (
        <div className="call-to-action">
            <div className="cards-container" >
                {cardsTitles.map((card, idx) =>
                    <div className="desktop" key={idx}>
                        <div
                            key={card}
                            className="card"
                            onMouseEnter={() => handleMouseHover(idx, true)}
                            onMouseLeave={() => handleMouseHover(idx, false)}
                            onClick={() => handleCardClick(idx, isCardChecked[idx])}
                            style={{ borderColor: (isCardHover[idx] || isCardChecked[idx]) ? cardsColors[idx].color : '' }}>
                            <div
                                className="checkbox"
                                style={{
                                    borderColor: (isCardHover[idx] || isCardChecked[idx]) ? cardsColors[idx].color : '',
                                    backgroundColor: isCardChecked[idx] ? cardsColors[idx].color : ''
                                }}>
                                {isCardChecked[idx] && <Icon className="check-icon" icon={Check} iconSize="20" />}
                            </div>
                            <img className="cluster-img" src={cardsIcon[idx]} />
                            <p>{cardsTitles[idx]}</p>
                        </div>
                    </div>
                )}
                <Carousel className="phone" responsive={responsive} infinite={true} autoPlay={true} arrows={false} centerMode={true}>
                    {cardsTitles.map((card, idx) =>
                        <div
                            key={card}
                            className="card"
                            onMouseEnter={() => handleMouseHover(idx, true)}
                            onMouseLeave={() => handleMouseHover(idx, false)}
                            onClick={() => handleCardClick(idx, isCardChecked[idx])}
                            style={{ borderColor: (isCardHover[idx] || isCardChecked[idx]) ? cardsColors[idx].color : '' }}>
                            <div
                                className="checkbox"
                                style={{
                                    borderColor: (isCardHover[idx] || isCardChecked[idx]) ? cardsColors[idx].color : '',
                                    backgroundColor: isCardChecked[idx] ? cardsColors[idx].color : ''
                                }}>
                                {isCardChecked[idx] && <Icon className="check-icon" icon={Check} iconSize="20" />}
                            </div>
                            <img className="cluster-img" src={cardsIcon[idx]} />
                            <p>{cardsTitles[idx]}</p>
                        </div>
                    )}
                </Carousel>
            </div>
            <div
                className="bottom-container"
                style={{ transform: `scale(${scale})` }} >
                <div className="btn-container" >
                    <button
                        className="start-btn"
                        onClick={() => navigate('/login')}
                        style={{ background: isHeroBtnHover ? utilService.getHeroBtnBg(hoverCardsColorsBtn, true) : utilService.getHeroBtnBg(cardsColorsBtn) }}
                        onMouseEnter={() => setIsHeroBtnHover(true)}
                        onMouseLeave={() => setIsHeroBtnHover(false)}>
                        <span className="span">Get Started</span>
                        <Icon className="icon" icon={MoveArrowRight} iconSize="18" />
                    </button>
                </div>
                <p className="small-words">No credit card needed   <span className="icon">✦</span>    Unlimited time on Free plan</p>
            </div>
        </div>
    )
}