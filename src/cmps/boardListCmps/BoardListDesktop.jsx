import { useNavigate } from "react-router-dom"
import { userService } from "../../services/user.service"
import { Icon, IconButton } from "monday-ui-react-core"
import { Favorite, Board } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { GoStarFill } from "react-icons/go";


export function BoardListDesktop({ boards, user, onSaveBoard }) {

    const navigate = useNavigate()

    return (
        <section className="board-list">
            <div className="header">
                <div className="header-content">
                    <div className="titles-container">
                        <p className="welcome-user">
                            {`Welcome, ${user ? user.fullname : userService.getDefaultUser().fullname}!`}
                        </p>
                        <p className="welcome-info">
                            Quickly access your recent boards and Inbox
                        </p>
                    </div>
                    <div className="welcome-img">
                        <img src="https://cdn.monday.com/images/homepage-desktop/header-background-v2.svg" alt="" />
                    </div>
                </div>
            </div>
            <div className="main-container">
                <div className="boards-container">
                    {boards.map(board =>
                        <div key={board._id} className="board-card flex" onClick={() => navigate(`/board/${board._id}`)}>
                            <div className="img-container flex">
                                <img src="https://cdn.monday.com/images/quick_search_recent_board.svg" alt="" />
                            </div>
                            <div className="flex justify-between align-center">
                                <div className="flex align-center">
                                    <Icon className="board-icon" icon={Board} />
                                    <span className="board-title">{board.title}</span>
                                </div>
                                <IconButton
                                    className={`favorite-icon ${board.isStarred ? 'isFavorite' : ''}`}
                                    icon={board.isStarred ? GoStarFill : Favorite}
                                    onClick={(ev) => { ev.stopPropagation(); onSaveBoard({ board, key: 'isStarred', value: !board.isStarred }) }}
                                    ariaLabel="Add to favorites"
                                />
                            </div>
                        </div>)}
                </div>
            </div>
        </section>
    )
}