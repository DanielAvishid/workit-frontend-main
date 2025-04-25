import { useState } from "react"
import { Hero } from "../cmps/homePageCmps/hero"
import { HomePageHeader } from "../cmps/homePageCmps/HomePageHeader"
import { Companies } from "../cmps/homePageCmps/Companies"
import { SideBySide } from "../cmps/homePageCmps/SideBySide"
import { ReviewCards } from "../cmps/homePageCmps/ReviewCards"
import { HomePageFooter } from "../cmps/homePageCmps/HomePageFooter"

export function Home() {

    const [isScroll, setIsScroll] = useState(false)

    const responsive = {
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 1
        }
    }

    return (
        <section className="home-page">
            <HomePageHeader isScroll={isScroll} />
            <Hero responsive={responsive} setIsScroll={setIsScroll} />

            <div className="big-img-section">
                <img className="big-img" src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/uploads/NaamaGros/HP_tests/HP_asset_white_bg.png" alt="" />
            </div>

            <Companies responsive={responsive} />
            <SideBySide />
            <ReviewCards />
            <HomePageFooter />
        </section >
    )
}