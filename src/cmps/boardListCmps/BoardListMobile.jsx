import { useNavigate } from "react-router-dom";
import { Icon } from "monday-ui-react-core"
import { Favorite, Search, Add } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useRef } from "react";
import { GoHomeFill, GoStarFill } from "react-icons/go";

export function BoardListMobile({ boards, onSaveBoard, onAddBoard }) {

    const inputRef = useRef(null)
    const navigate = useNavigate()

    return (
        <section className="board-list-mobile">
            <div className="logo">
                <img src="https://res.cloudinary.com/dvcgvn34o/image/upload/v1700516255/monday-img_bigkmy.png" alt="" />
                <span className="logo-name">workit</span>
            </div>
            <div className="search-container">
                <Icon className="search-icon" icon={Search} onClick={() => inputRef.current.focus()} />
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search boards"
                    ref={inputRef} />
            </div>
            <div className="list">
                {boards.map(board =>
                    <div
                        className="board-preview"
                        key={board._id}
                        onClick={() => navigate(`/board/${board._id}`)}>
                        <div className="board-content">
                            <img src="https://cdn.monday.com/images/quick_search_recent_board.svg" alt="" />
                            <h3>{board.title}</h3>
                        </div>
                        <Icon
                            className={`favorite-icon ${board.isStarred ? 'isFavorite' : ''}`}
                            icon={board.isStarred ? GoStarFill : Favorite}
                            onClick={(ev) => { ev.stopPropagation(); onSaveBoard({ board, key: 'isStarred', value: !board.isStarred }) }} />
                    </div>
                )}
            </div>
            <div className="add-btn" onClick={onAddBoard}>
                <Icon className="add-icon" icon={Add} />
            </div>
        </section>
    )
}