import { Checkbox, DatePicker } from "monday-ui-react-core";

export function TimelineModal({ newDate, handleDatePick }) {
    return (
        <div className="modal">
            <div className="pointer"></div>
            <div className="date-picker-container">
                <div className="date-picker-header flex align-center"><span>Set Dates</span></div>
                <DatePicker
                    className="date-picker"
                    numberOfMonths={2}
                    date={newDate.startDate}
                    endDate={newDate.endDate}
                    range
                    data-testid="date-picker"
                    onPickDate={handleDatePick}
                />
                <div className="date-picker-footer flex align-center">
                    <Checkbox label="Set as timeline" />
                </div>
            </div>
        </div>
    )
}