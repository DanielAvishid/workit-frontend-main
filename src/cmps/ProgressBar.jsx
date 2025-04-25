import { utilService } from "../services/util.service";

import { TimelineSummary } from "./dynamicSummaryCmps/TimelineSummary";
import { MembersSummary } from "./dynamicSummaryCmps/MembersSummary";
import { LabelsSummary } from "./dynamicSummaryCmps/LabelsSummary";


export function ProgressBar({ board, group }) {

    const renderCmpSpan = (cmp) => {
        switch (cmp.type) {
            case 'timeline':
            case 'date':
                return <TimelineSummary group={group} type={cmp.type} />
            case 'status':
            case 'priority':
                return <LabelsSummary group={group} board={board} type={cmp.type} />
            case 'members':
                return <MembersSummary group={group} board={board} />
            default:
                return
        }
    }

    return (
        <table className="progress-bar full main-layout" >
            <tfoot className="table-container table" style={{ borderColor: "transparent" }}>
                <tr className="table-row flex">
                    {board.cmpsOrder.map((cmp, idx) => (
                        <td key={idx} className={`${cmp.type}-col ${cmp.type} flex align-center justify-center`}>
                            {renderCmpSpan(cmp)}
                        </td>
                    ))}
                </tr>
            </tfoot>
        </table >
    )
}