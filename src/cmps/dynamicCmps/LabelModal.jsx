import { Button, ColorPicker, Divider, EditableHeading, Icon, IconButton } from "monday-ui-react-core";
import { Edit, Drag, Close, AddSmall, HighlightColorBucket } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useState } from "react";
import { utilService } from "../../services/util.service";
import { boardService } from "../../services/board.service";

export function LabelModal({ task, group, board, keyName, onSaveBoard, cmpType }) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [palleteOpenState, setPalleteOpenState] = useState({})
    const [hoverState, setHoverState] = useState({})
    const [editableLabels, setEditableLabels] = useState(board[keyName])

    const viewNum = (editableLabels.length >= 6) ? 6 : editableLabels.length
    const editNum = (editableLabels.length >= 6) ? 6 : editableLabels.length + 1

    const styleViewMode = {
        gridTemplateRows: `repeat(${viewNum}, 1fr)`
    }

    const styleEditMode = {
        gridTemplateRows: `repeat(${editNum}, 1fr)`,
        paddingBlockEnd: editableLabels.length >= 6 ? '16px' : '8px'
    }

    function onEditClick(ev) {
        ev.stopPropagation()
        setIsEditMode(!isEditMode)
    }

    function getPlaceHolder(isDefault) {
        if (!isDefault) return 'Add Label'
        else return 'Default Label'
    }

    function toggleRemove(labelId) {
        setHoverState((prevState) => ({
            ...prevState,
            [labelId]: !prevState[labelId]
        }))
    }

    function togglePallete(ev, labelId) {
        ev.stopPropagation()
        setPalleteOpenState((prevState) => ({
            ...prevState,
            [labelId]: !prevState[labelId]
        }))
    }

    function onRemoveLabel(labelId) {
        const value = editableLabels.filter(label => label.id !== labelId)
        setEditableLabels(value)
        onSaveBoard({ board, key: keyName, value })
    }

    function onAddLabel(ev) {
        ev.stopPropagation()
        const newLabels = [...editableLabels]
        const newLabel = boardService.getEmptyStatusLabel()
        newLabels.push(newLabel)
        setEditableLabels(newLabels)
        onSaveBoard({ board, key: keyName, value: newLabels })
    }

    function handleTitleChange(ev, index) {
        const newLabels = [...editableLabels]
        newLabels[index].title = ev.target.value
        setEditableLabels(newLabels)
    }

    function handleColorChange(value, index) {
        const colorToSave = utilService.getHexColor(value[0])
        const newLabels = [...editableLabels]
        newLabels[index].color = colorToSave
        setEditableLabels(newLabels)
        onSaveBoard({ board, key: keyName, value: editableLabels })
        setPalleteOpenState({})
    }

    function handleLabelPick(labelId) {
        onSaveBoard({ type: 'task', board, groupId: group.id, taskId: task.id, key: cmpType, value: labelId })
    }

    function stopPropagation(ev) {
        ev.stopPropagation()
    }

    return (
        <section className="label-modal relative">
            <div className="label-content">
                {!isEditMode && <div className="label-view-container" style={styleViewMode}>
                    {editableLabels.map((label, index) =>
                        <button
                            key={label.id}
                            className="label-picker"
                            style={{ backgroundColor: label.color }}
                            onClick={() => handleLabelPick(label.id)}>
                            {editableLabels[index].title}
                        </button>
                    )}
                </div>}
                {isEditMode && <div className="label-edit-container" style={styleEditMode}>
                    {editableLabels.map((label, index) =>
                        <div
                            key={label.id}
                            className="label-edit label-edit-layout"
                            onMouseEnter={() => toggleRemove(label.id)}
                            onMouseLeave={() => toggleRemove(label.id)}
                            onClick={(ev) => stopPropagation(ev)}>
                            {hoverState[label.id] && <Icon className='icon-drag' icon={Drag} />}
                            <div key={label.id} className="label-editable middle" >
                                <button
                                    className="color-btn"
                                    style={{ backgroundColor: label.color }}
                                    onClick={(ev) => togglePallete(ev, label.id)}
                                    disabled={label.isDefault}>
                                    <Icon iconType={Icon.type.SVG} icon={HighlightColorBucket} iconLabel="my bolt svg icon" iconSize={16} style={{ color: '#fff' }} />
                                </button>
                                <input
                                    className="label-input"
                                    placeholder={getPlaceHolder(label.isDefault)}
                                    value={editableLabels[index].title} type="text"
                                    onChange={(ev) => handleTitleChange(ev, index)}
                                    onBlur={() => onSaveBoard({ board, key: keyName, value: editableLabels })} />
                            </div>
                            {hoverState[label.id] && <Button
                                size={Button.sizes.XXS}
                                kind={Button.kinds.TERTIARY}
                                onClick={() => onRemoveLabel(label.id)}
                                disabled={(label.isDefault || board.groups.some(group => group.tasks.some(task => task[cmpType] === label.id)))}>
                                <Icon iconSize={16} icon={Close} />
                            </Button>}
                            {palleteOpenState[label.id] && <ColorPicker
                                className="color-picker"
                                colorSize="small"
                                showColorNameTooltip={true}
                                onSave={(value) => handleColorChange(value, index)} />}
                        </div>)}
                    <div className="add-btn-container label-edit-layout">
                        <Button className="add-btn middle" kind={Button.kinds.SECONDARY} onClick={(ev) => onAddLabel(ev)}>
                            <Icon iconSize={16} icon={AddSmall} />
                            <span>New label</span>
                        </Button>
                    </div>
                </div>}
            </div>
            <div className="label-picker-footer">
                <Divider className="divider" />
                {!isEditMode && <Button className="edit-btn" onClick={(ev) => onEditClick(ev)} leftIcon={Edit} kind={Button.kinds.TERTIARY}>
                    Edit Labels
                </Button>}
                {isEditMode && <Button className="edit-btn" onClick={(ev) => onEditClick(ev)} kind={Button.kinds.TERTIARY}>
                    Apply
                </Button>}
            </div>
            <div className="square">
            </div>
        </section>
    )

    //     import { Button, ColorPicker, Divider, EditableHeading, Icon, IconButton, Tooltip } from "monday-ui-react-core";
    // import { Edit, Close, AddSmall, HighlightColorBucket } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
    // import { useState } from "react";

    // export function LabelModal({ labelsKey, board, labels, onSaveBoard }) {

    //     const [isEditMode, setIsEditMode] = useState(false)
    //     const [palleteOpenState, setPalleteOpenState] = useState({})
    //     const [removeState, setRemoveState] = useState({})
    //     const num = (labels.length >= 6) ? 6 : labels.length
    //     const num2 = (labels.length >= 6) ? 6 : labels.length + 1

    //     const styleDiv1 = {
    //         gridTemplateRows: `repeat(${num}, 1fr)`
    //     }

    //     const styleDiv2 = {
    //         gridTemplateRows: `repeat(${num2}, 1fr)`
    //     }

    //     const editableAttrs = {
    //         suppressContentEditableWarning: true,
    //         contentEditable: true,
    //         onBlur: onUpdate
    //     }

    //     const whiteIcon = {
    //         color: '#fff'
    //     }

    //     function onEditClick(ev) {
    //         ev.stopPropagation()
    //         setIsEditMode(!isEditMode)
    //     }

    //     function stopPapa(ev) {
    //         ev.stopPropagation()
    //     }

    //     function onUpdate(color, labelId) {
    //         const toSave = labels.find(label => label.id === labelId)
    //         toSave.color = color[0]
    //         console.log(toSave)
    //         onSaveBoard(board, 'labels', toSave)
    //     }

    //     function togglePallete(labelId) {
    //         setPalleteOpenState((prevState) => ({
    //             ...prevState,
    //             [labelId]: !prevState[labelId]
    //         }))
    //     }

    //     function toggleRemove(labelId) {
    //         setRemoveState((prevState) => ({
    //             ...prevState,
    //             [labelId]: !prevState[labelId]
    //         }))
    //     }

    //     function onAddLabel(ev) {
    //         ev.stopPropagation()
    //         const newLabel = {
    //             "id": "ls107",
    //             "title": "",
    //             "color": "#a25ddc"
    //         }
    //         const value = { ...board.labels, [labelsKey]: [...labels.push(newLabel)] }
    //         onSaveBoard({ board, key: 'labels', value })
    //     }

    //     function onRemoveLabel(labelId) {
    //         const value = { ...board.labels, [labelsKey]: labels.filter(label => label.id !== labelId) }
    //         onSaveBoard({ board, key: 'labels', value })
    //     }

    //     function getPlaceHolder(isDefault) {
    //         if (!isDefault) return 'Add Label'
    //         else return 'Default Label'
    //     }

    //     return (
    //         <div className="label-modal-container modal-layout">
    //             {!isEditMode && <div className="label-container middle" style={styleDiv1} >
    //                 {labels.map(label =>
    //                     <button key={label.id} className="label-btn" style={{ backgroundColor: label.color }}>
    //                         {label.title}
    //                     </button>
    //                 )}
    //             </div>}
    //             {isEditMode && <div className="label-edit-container full" style={styleDiv2}>
    //                 {labels.map(label =>
    //                     <div key={label.id} className="modal-layout" onClick={(ev) => stopPapa(ev)} onMouseEnter={() => toggleRemove(label.id)} onMouseLeave={() => toggleRemove(label.id)}>
    //                         <div key={label.id} className="label-edit middle" >
    //                             <button className="color-btn" style={{ backgroundColor: label.color }} onClick={() => togglePallete(label.id)}>
    //                                 <span className="icon-container">
    //                                     <Icon iconType={Icon.type.SVG} icon={HighlightColorBucket} iconLabel="my bolt svg icon" iconSize={16} style={{ color: '#fff' }} />
    //                                 </span>
    //                             </button>
    //                             <input {...editableAttrs} placeholder={getPlaceHolder(label.isDefault)} value={label.title} className="label-input" type="text" onClick={onUpdate} />
    //                             {palleteOpenState[label.id] && <ColorPicker
    //                                 className="color-picker"
    //                                 colorSize="small"
    //                                 onSave={(color) => onUpdate(color, label.id)}
    //                             />}
    //                         </div>
    //                         {removeState[label.id] && <div className="label-delete-container end">
    //                             <button className="delete-btn" onClick={() => onRemoveLabel(label.id)}>
    //                                 <span className="icon-container">
    //                                     <Icon iconType={Icon.type.SVG} icon={Close} iconLabel="my bolt svg icon" iconSize={9} />
    //                                 </span>
    //                             </button>
    //                         </div>}
    //                     </div>)}
    //                 <div className="modal-layout" >
    //                     <Button className="add-btn middle" leftIcon={AddSmall} kind={Button.kinds.SECONDARY} onClick={onAddLabel}>New label</Button>
    //                 </div>
    //             </div>}
    //             <div className="divider-container full">
    //                 <Divider className="divider" />
    //             </div>
    //             <div className="add-label-container full">
    //                 {!isEditMode && <Button className="edit-btn" onClick={(ev) => onEditClick(ev)} leftIcon={Edit} kind={Button.kinds.TERTIARY}>Edit Labels</Button>}
    //                 {isEditMode && <Button className="edit-btn" onClick={(ev) => onEditClick(ev)} kind={Button.kinds.TERTIARY}>Apply</Button>}
    //             </div>
    //         </div >
    //     )
    // }
}