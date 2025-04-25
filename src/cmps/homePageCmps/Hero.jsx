import { useEffect, useState } from "react"
import { utilService } from "../../services/util.service"
import { HeroCTA } from "./HeroCTA";

export function Hero({ responsive, setIsScroll }) {

    const [isCardHover, setIsCardHover] = useState([false, false, false, false, false, false, false, false, false])
    const [isCardChecked, setIsCardChecked] = useState([false, false, false, false, false, false, false, false, false])
    const [isScale, setIsScale] = useState(false)
    const [isHeroBtnHover, setIsHeroBtnHover] = useState(false)
    const [cardsColorsBtn, setCardsColorsBtn] = useState([])
    const [hoverCardsColorsBtn, setHoverCardsColorsBtn] = useState([])

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 0) {
                setIsScroll(true)
            } else setIsScroll(false)
        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleCardClick)
        }
    }, [])

    const cardsIcon = utilService.getHeroIcons()
    const scale = isScale ? 1.05 : 1;
    const cardsColors = [{ color: '#ff158a', idx: 0 }, { color: '#00c875', idx: 1 }, { color: '#f04095', idx: 2 }, { color: '#ff9900', idx: 3 }, { color: '#00d2d2', idx: 4 }, { color: '#579bfc', idx: 5 }, { color: '#ff7575', idx: 6 }, { color: '#4eccc6', idx: 7 }, { color: '#6161ff', idx: 7 }]
    const hoverCardsColors = [{ color: '#d51273', idx: 0 }, { color: '#00a762', idx: 1 }, { color: '#c9367d', idx: 2 }, { color: '#d58000', idx: 3 }, { color: '#00b0b0', idx: 4 }, { color: '#4982d3', idx: 5 }, { color: '#d56262', idx: 6 }, { color: '#41aba6', idx: 7 }, { color: '#5151d5', idx: 7 }]


    function handleCardClick(idx, value) {
        isCardChecked[idx] = !value
        const newCheckedArray = [...isCardChecked]
        setIsCardChecked(newCheckedArray)
        setIsScale(true)
        setTimeout(() => {
            setIsScale(false);
        }, 200);

        if (!value) {
            cardsColorsBtn.push(cardsColors[idx])
            cardsColorsBtn.sort((a, b) => a.idx - b.idx)
            hoverCardsColorsBtn.push(hoverCardsColors[idx])
            hoverCardsColorsBtn.sort((a, b) => a.idx - b.idx)
            const newColorsArray = [...cardsColorsBtn]
            const newHoverColorsArray = [...hoverCardsColorsBtn]
            setCardsColorsBtn(newColorsArray)
            setHoverCardsColorsBtn(newHoverColorsArray)
        } else if (value && cardsColorsBtn.length === 1) {
            setCardsColorsBtn([])
            setHoverCardsColorsBtn([])
        } else {
            const colorIdx = cardsColorsBtn.findIndex(color => color.idx === idx)
            cardsColorsBtn.splice(colorIdx, 1)
            const hoverColorIdx = hoverCardsColorsBtn.findIndex(color => color.idx === idx)
            hoverCardsColorsBtn.splice(hoverColorIdx, 1)
            const newColorsArray = [...cardsColorsBtn]
            const newHoverColorsArray = [...hoverCardsColorsBtn]
            setCardsColorsBtn(newColorsArray)
            setHoverCardsColorsBtn(newHoverColorsArray)
        }
    }

    function handleMouseHover(idx, value) {
        isCardHover[idx] = value
        const newArray = [...isCardHover]
        setIsCardHover(newArray)
    }

    const cardsTitles = ['Creative & design', 'Software development', 'Marketing', 'Project management', 'Sales & CRM', 'Task management', 'HR', 'Operations', 'More workflows']

    return (
        <div className="hero">
            <div className="content">
                <div className="main-title">
                    <h1>A platform built for a new way of working</h1>
                </div>
                <h2 className="sub-title">What would you like to manage with workit Work OS?</h2>
            </div>

            <HeroCTA
                hoverCardsColorsBtn={hoverCardsColorsBtn}
                setIsHeroBtnHover={setIsHeroBtnHover}
                cardsColors={cardsColors}
                cardsColorsBtn={cardsColorsBtn}
                isHeroBtnHover={isHeroBtnHover}
                scale={scale}
                responsive={responsive}
                cardsIcon={cardsIcon}
                isCardChecked={isCardChecked}
                isCardHover={isCardHover}
                cardsTitles={cardsTitles}
                handleCardClick={handleCardClick}
                handleMouseHover={handleMouseHover} />

        </div>
    )
}