import { Icon } from "monday-ui-react-core"
import { Drag } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { ActivityHeader } from "../cmps/activityCmps/ActivityHeader"
import { ActivityDetails } from "../cmps/activityCmps/ActivityDetails"
import { useState } from "react"

export function BoardActivity({ setIsResizing, width }) {

    const board = useSelector(storeState => storeState.boardModule.board)
    const { boardId } = useParams()
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (searchValue) => {
        console.log('searchValue', searchValue);

        const filtered = activities.filter((activity) =>
            activity.title.toLowerCase().includes(searchValue.toLowerCase())
        )

        console.log('filtered', filtered);

        setSearchTerm(searchValue)
        setFilteredActivities(filtered)
    }

    function handleMouseDown(ev) {
        ev.preventDefault()
        setIsResizing(true)
    }

    if (!board) return

    return (
        <section
            className="board-activity flex column"
            style={{ width: width ? `calc(100vw - ${width}px)` : '' }}>

            <ActivityHeader board={board} />
            <ActivityDetails
                board={board}
                searchTerm={searchTerm}
                handleSearch={handleSearch} />

            <button
                className="drag-btn"
                onMouseDown={(ev) => handleMouseDown(ev)}>
                <Icon className="close-icon" icon={Drag} />
            </button>

        </section>
    )
}