import { Checkbox, EditableHeading, IconButton } from "monday-ui-react-core"
import { Add } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"

export function TableHeader({ group, board, masterChecked, handleMasterChange, handleKeyPress }) {
    return (
        <table className="table-header full main-layout">
            <thead className="table-container table first" style={{ borderColor: group.style.backgroundColor }}>
                <tr className="table-row flex">
                    <th className=" title-col flex align-center justify-center">
                        <div className="checkbox flex align-center justify-center"><Checkbox checked={masterChecked} onChange={handleMasterChange} /></div>
                        <div className="title-name flex align-center justify-center"><span>Item</span></div>
                    </th>
                    {board.cmpsOrder.map((cmp, idx) => (
                        <th key={idx} className={` cmp-title ${cmp.type}-col flex align-center justify-center`}>
                            <div className="inner-container">
                                <span>
                                    <EditableHeading
                                        type={EditableHeading.types.h6}
                                        value={cmp.title}
                                        onKeyDown={(ev) => handleKeyPress(ev, 'cmpsOrder', cmp.id)}
                                    />
                                </span>
                            </div>
                        </th>
                    ))}
                    <th className="add-column">
                        <IconButton className="add-btn" icon={Add} kind={IconButton.kinds.TERTIARY} ariaLabel="Add Column" />
                    </th>
                </tr>
            </thead>
        </table>
    )
}