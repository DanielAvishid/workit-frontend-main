import { Tooltip } from "monday-ui-react-core";

export function SummaryItem({ dataCount, totalDataCount, color, title }) {

    const percentage = ((dataCount / totalDataCount) * 100).toFixed(1);

    const style = {
        width: `${percentage}%`,
        backgroundColor: color,
    };

    return (
        <Tooltip content={`${title} ${dataCount}/${totalDataCount} ${percentage}%`}>
            <div className="summary-item" style={style}></div>
        </Tooltip>
    );
}