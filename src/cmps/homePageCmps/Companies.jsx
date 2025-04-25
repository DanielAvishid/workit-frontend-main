import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { utilService } from "../../services/util.service";

export function Companies({ responsive }) {

    const companiesLogos = utilService.getLogos()

    return (
        <div className="companies-section">
            <div className="title-container">
                <h2>Trusted by 180,000+ customers worldwide</h2>
            </div>
            <div className="logos-container desktop">
                {companiesLogos.map((logo, idx) =>
                    <div key={logo} className="logo">
                        <div className="flex align-center">
                            <img className="logo-img" src={companiesLogos[idx]} alt="" />
                        </div>
                    </div>
                )}
            </div>
            <Carousel className="logos-container phone" responsive={responsive} infinite={true} arrows={false} centerMode={true}>
                {companiesLogos.map((logo, idx) =>
                    <div key={logo} className="logo">
                        <div className="flex align-center">
                            <img className="logo-img" src={companiesLogos[idx]} alt="" />
                        </div>
                    </div>
                )}
            </Carousel>
        </div>
    )
}