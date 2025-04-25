import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Icon, Menu, MenuButton, MenuItem, MenuTitle, SplitButton, Tooltip } from "monday-ui-react-core";
import { Home, MyWeek, AddSmall, Menu as MenuIcon, Favorite, Filter, Board, Duplicate, Gantt, Delete, Add, DropdownChevronDown, Search, NavigationChevronLeft, NavigationChevronRight, CloseSmall } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { useEffect, useRef, useState } from "react";
import { boardService } from "../services/board.service";
import { GoHomeFill, GoStarFill } from "react-icons/go";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export function AppSidebar({ boards, onSaveBoard, onDuplicateBoard, onRemoveBoard, updateBoards, handleBoardsFilter, filterBy }) {
    const [isSideBarHover, setIsSideBarHover] = useState(false)
    const [isSidBarOpen, setIsSideBarOpen] = useState(true)
    const [showBorder, setShowBorder] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFavoriteMode, setIsFavoriteMode] = useState(false)
    const [boardHoverState, setBoardHoverState] = useState({})
    const [searchHoverState, setSearchHoverState] = useState(false)
    const [favoriteBoards, setFavoriteBoards] = useState([])
    const [openState, setOpenState] = useState({})
    const inputRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        setFavoriteBoards(boards.filter(board => board.isStarred === true))
    }, [boards])

    function onAddBoard() {
        const board = boardService.getEmptyBoard()
        onSaveBoard({ board })
    }

    function toggleSidebar() {
        setIsSideBarOpen(!isSidBarOpen)
    }

    function toggleBorder() {
        setShowBorder(!showBorder)
    }

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const newBoards = [...boards]
        const board = newBoards.splice(result.source.index, 1)[0];
        newBoards.splice(result.destination.index, 0, board)
        updateBoards(newBoards)
    }

    function toggleModal() {
        setIsModalOpen(!isModalOpen)
    }

    function toggleHoverMenu(boardId) {
        setBoardHoverState((prevState) => ({
            ...prevState,
            [boardId]: !prevState[boardId]
        }))
    }

    function handleContainerMouseEnter(ev) {
        if (ev.target === ev.currentTarget) {
            setIsSideBarHover(true)
        }
    }

    function handleContainerMouseLeave() {
        setIsSideBarHover(false)
    }

    function toggleOpenMenu(boardId) {
        setOpenState((prevState) => ({
            ...prevState,
            [boardId]: !prevState[boardId]
        }))
    }

    function selectedClass() {
        if (isModalOpen) return 'selected'
        else return ''
    }

    function toggleFavoriteMode(state) {
        setIsFavoriteMode(state)
        toggleModal()
    }

    function resetHoverAndOpen() {
        setOpenState({})
        setBoardHoverState({})
    }

    function emptyFunction() {
        return
    }

    return (
        <section
            className={`app-sidebar ${isSidBarOpen ? '' : 'close'} ${(isSideBarHover && !isSidBarOpen) ? 'hover' : ''}`}
            onMouseEnter={(ev) => handleContainerMouseEnter(ev)}
            onMouseLeave={handleContainerMouseLeave}>
            {<button
                className={`close-btn ${!isSidBarOpen ? 'close' : ''}`}
                onClick={toggleSidebar} >
                <Icon
                    className="icon"
                    icon={isSidBarOpen ? NavigationChevronLeft : NavigationChevronRight} />
            </button>}
            <section className="expand-sidebar">
                {isSideBarHover && <button
                    className="close-btn"
                    onClick={toggleSidebar}
                    onMouseEnter={emptyFunction}>
                    <Icon
                        className="icon"
                        icon={isSidBarOpen ? NavigationChevronLeft : NavigationChevronRight} />
                </button>}
                <div className="general-btns">
                    <Button
                        leftIcon={Home}
                        kind="tertiary"
                        className={`home ${location.pathname === '/board' ? 'active' : ''}`}
                        onClick={() => navigate('/board')}>
                        Home
                    </Button>
                    <Button
                        leftIcon={MyWeek}
                        kind="tertiary"
                        className="my-week">
                        My work
                    </Button>
                </div>
                {!isFavoriteMode && <div className="workspace">
                    <div className="tools">
                        <div className="workspace-select">
                            <Button
                                className={`workspace-dropdown ${selectedClass()}`}
                                kind="tertiary"
                                onClick={() => toggleModal()}>
                                <div className="workspace-icon">
                                    <span className="letter">M</span>
                                    <Icon className="home-icon" icon={GoHomeFill} />
                                </div>
                                <span className="workspace-title">
                                    Main workspace
                                </span>
                                <Icon className="drop-icon" icon={DropdownChevronDown} />
                            </Button>
                            {isModalOpen && <div className={`workspace-modal ${isModalOpen ? 'open' : ''}`}>
                                <Button kind="tertiary" className={`favorite-btn ${isFavoriteMode ? 'active' : ''}`} onClick={() => { resetHoverAndOpen(); toggleFavoriteMode(true) }}>
                                    <Icon className="favorite-icon" icon={GoStarFill} />
                                    <span>Favorites</span>
                                </Button>
                                <Button
                                    className={`workspace-btn ${!isFavoriteMode ? 'active' : ''}`}
                                    kind="tertiary"
                                    onClick={() => { resetHoverAndOpen(); toggleFavoriteMode(false) }}>
                                    <div className="workspace-icon">
                                        <span className="letter">M</span>
                                        <Icon className="home-icon" icon={GoHomeFill} />
                                    </div>
                                    <span className="workspace-title">
                                        Main workspace
                                    </span>
                                </Button>
                            </div>}
                        </div>
                        <div className="search-add">
                            <div
                                className={`search-container ${showBorder ? 'is-focus' : ''}`}
                                onMouseEnter={() => setSearchHoverState(true)}
                                onMouseLeave={() => setSearchHoverState(false)}>
                                <Icon className="search-icon" icon={Search} onClick={() => inputRef.current.focus()} />
                                <input
                                    style={{ width: filterBy.title ? '104px' : '128px' }}
                                    onFocus={toggleBorder}
                                    onBlur={toggleBorder}
                                    className="search-input"
                                    type="text"
                                    placeholder="Search"
                                    onChange={(ev) => handleBoardsFilter(ev.target.value)}
                                    ref={inputRef} />
                                <div className="flex">
                                    <div className="clear-btn-container">
                                        {filterBy.title &&
                                            <Button
                                                className="clear-btn"
                                                kind={Button.kinds.TERTIARY}
                                                onClick={() => { handleBoardsFilter(''); inputRef.current.value = '' }}>
                                                <Icon className="close-icon" icon={CloseSmall} />
                                            </Button>}
                                    </div>
                                    <div className="filter-btn-container">
                                        {(searchHoverState || inputRef.current === document.activeElement) &&
                                            <Button
                                                className="filter-btn"
                                                kind={Button.kinds.TERTIARY} >
                                                <Icon className="filter-icon" icon={Filter} />
                                            </Button>}
                                    </div>
                                </div>
                            </div>
                            <Button className="new-btn" onClick={onAddBoard}>
                                <Icon className="plus-icon" icon={AddSmall} />
                            </Button>
                        </div>
                        <nav className="board-nav">
                            {boards.map(board =>
                                <div
                                    onMouseEnter={() => toggleHoverMenu(board._id)}
                                    onMouseLeave={() => toggleHoverMenu(board._id)}
                                    key={board._id}
                                    onClick={() => navigate(`/board/${board._id}`)}>
                                    <Button
                                        kind="tertiary"
                                        className={`board-btn ${openState[board._id] ? 'menu-focus' : ''} ${location.pathname.includes(board._id) ? 'active' : ''}`}>
                                        <div className="container flex align-center">
                                            <Icon className="board-icon" icon={Board} />
                                            <span className="board-title">{board.title}</span>
                                        </div>
                                        <div
                                            style={{ display: (openState[board._id] || boardHoverState[board._id]) ? 'flex' : 'none' }}
                                            key={board.id}
                                            onClick={(ev => ev.stopPropagation())}>
                                            <MenuButton
                                                className="board-options"
                                                onMenuShow={() => toggleOpenMenu(board._id)}
                                                onMenuHide={() => toggleOpenMenu(board._id)}>
                                                <Menu id="menu" size="large" className="menu-modal">
                                                    <MenuItem
                                                        icon={Duplicate}
                                                        title="Duplicate Board"
                                                        onClick={() => onDuplicateBoard({ boardId: board._id })} />
                                                    <MenuItem
                                                        icon={Delete}
                                                        title="Delete"
                                                        onClick={() => onRemoveBoard({ boardId: board._id })} />
                                                    <MenuItem
                                                        icon={Favorite}
                                                        title={board.isStarred ? 'Remove from favorite' : 'Add to favorite'}
                                                        onClick={() => onSaveBoard({ board, key: 'isStarred', value: !board.isStarred })} />
                                                </Menu>
                                            </MenuButton>
                                        </div>
                                    </Button>
                                </div>)}
                        </nav>
                    </div>
                </div>}
                {isFavoriteMode && <div className="workspace">
                    <div className="tools">
                        <div className="workspace-select">
                            <Button
                                className={`workspace-dropdown favorite-dropdown ${selectedClass()}`}
                                kind="tertiary"
                                onClick={() => toggleModal()}>
                                <div className="flex align-center">
                                    <Icon className="favorite-icon" icon={GoStarFill} />
                                    <span className="workspace-title">Favorites</span>
                                </div>
                                <Icon className="drop-icon" icon={DropdownChevronDown} />
                            </Button>
                            {isModalOpen && <div className={`workspace-modal ${isModalOpen ? 'open' : ''}`}>
                                <Button kind="tertiary" className={`favorite-btn ${isFavoriteMode ? 'active' : ''}`} onClick={() => { resetHoverAndOpen(); toggleFavoriteMode(true) }}>
                                    <Icon className="favorite-icon" icon={GoStarFill} />
                                    <span>Favorites</span>
                                </Button>
                                <Button
                                    className={`workspace-btn ${!isFavoriteMode ? 'active' : ''}`}
                                    kind="tertiary"
                                    onClick={() => { resetHoverAndOpen(); toggleFavoriteMode(false) }}>
                                    <div className="workspace-icon">
                                        <span className="letter">M</span>
                                        <Icon className="home-icon" icon={GoHomeFill} />
                                    </div>
                                    <span className="workspace-title">
                                        Main workspace
                                    </span>
                                </Button>
                            </div>}
                        </div>
                        <nav className="board-nav">
                            {favoriteBoards.map(board =>
                                <div
                                    onMouseEnter={() => toggleHoverMenu(board._id)}
                                    onMouseLeave={() => toggleHoverMenu(board._id)}
                                    key={board._id}
                                    onClick={() => navigate(`/board/${board._id}`)}>
                                    <Button
                                        kind="tertiary"
                                        className={`board-btn ${openState[board._id] ? 'menu-focus' : ''} ${location.pathname.includes(board._id) ? 'active' : ''}`}>
                                        <div className="container flex align-center">
                                            <Icon className="board-icon" icon={Board} />
                                            <span className="board-title">{board.title}</span>
                                        </div>
                                        <div
                                            style={{ display: (openState[board._id] || boardHoverState[board._id]) ? 'flex' : 'none' }}
                                            key={board.id}
                                            onClick={(ev => ev.stopPropagation())}>
                                            <MenuButton
                                                className="board-options"
                                                onMenuShow={() => toggleOpenMenu(board._id)}
                                                onMenuHide={() => toggleOpenMenu(board._id)}>
                                                <Menu id="menu" size="large" className="menu-modal">
                                                    <MenuItem
                                                        icon={Favorite}
                                                        title={board.isStarred ? 'Remove from favorite' : 'Add to favorite'}
                                                        onClick={() => onSaveBoard({ board, key: 'isStarred', value: !board.isStarred })} />
                                                </Menu>
                                            </MenuButton>
                                        </div>
                                    </Button>
                                </div>)}
                        </nav>
                    </div>
                </div>}

                {(filterBy.title && !boards.length && !isFavoriteMode) && (isSideBarHover || isSidBarOpen) && <div className="no-result">
                    <div className="img-container">
                        <img className="img" src="https://cdn.monday.com/images/search_empty_state.svg" />
                    </div>
                    <p className="heading">No results found</p>
                    <p className="text">Please check your search terms or filters.</p>
                </div>}

                {(isFavoriteMode && !favoriteBoards.length) && (isSideBarHover || isSidBarOpen) && <div className="no-result-favorite">
                    <div className="img-container">
                        <img className="img" src="https://cdn.monday.com/images/favorites-no-bg.gif" />
                    </div>
                    <div className="message">
                        <b className="heading">No favorite boards yet</b>
                        <span className="text">"Star" any board so that you can easily access it later</span>
                    </div>
                </div>}

            </section>
        </section >
    )
}



{/* {isModalOpen && <div className="workspace-modal">
                            <div className="modal-top">
                                <div className="search">
                                    <Search className="search-input" placeholder="Search for a board" />
                                </div>
                                <div className="select">
                                    <Button kind="tertiary" className="favorite-btn">
                                        <Icon className="favorite-icon" icon={GoStarFill} />
                                        <span>Favorites</span>
                                    </Button>
                                    <div className="title">
                                        <span className="my-workspace-title">My workspaces</span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-bottom">
                                <Button kind="tertiary" className="favorite-btn">
                                    <Icon className="favorite-icon" icon={AddSmall} />
                                    <span>Add workspace</span>
                                </Button>
                                <Button kind="tertiary" className="favorite-btn">
                                    <Icon className="favorite-icon" icon={GoStarFill} />
                                    <span>Browse all</span>
                                </Button>
                            </div>
                        </div>} */}


//     return (
//         <section className="app-sidebar flex column">
//             <button className="close-btn" onClick={toggleSidebar}>
//                 <Icon className="icon" icon={showSidebar ? NavigationChevronLeft : NavigationChevronRight} />
//             </button>
//             <section className={`flex column main-sidebar ${showSidebar ? '' : 'close'}`}>
//                 <Button leftIcon={Home} kind="tertiary" className="home btn">Home</Button>
//                 <Button leftIcon={MyWeek} kind="tertiary" className="my-week btn">My Week</Button>

//                 <article className="flex align-center justify-between main-sec">
//                     <Button kind="tertiary" rightIcon={DropdownChevronDown}>
//                         <span></span>Main workspace
//                     </Button>
//                     <MenuButton>
//                         <Menu id="menu" size="large">
//                             <MenuItem icon={Add} title="Add new Workspace" />
//                             <MenuItem icon={Home} title="Add new Workspace" />
//                             <MenuItem icon={Home} title="Add new Workspace" />
//                         </Menu>
//                     </MenuButton>

//                 </article>
//                 <article className="flex align-center justify-between search-sec">
//                     <Search placeholder="Search" iconName={Filter} className="search" />
//                     <span><Button
//                         size="md"
//                         onClick={onAddBoard}>
//                         <Add />
//                     </Button></span>
//                 </article>
//                 <Button leftIcon={Gantt} kind="tertiary" className="test_board btn">Test_board</Button>

//                 <DragDropContext onDragEnd={handleOnDragEnd}>
//                     <Droppable droppableId="board" type="group">
//                         {(provided) => (
//                             <div {...provided.droppableProps} ref={provided.innerRef}>
//                                 {boards.length > 0 && boards.map((board, index) => (
//                                     <Draggable draggableId={board._id} index={index} key={board._id}>
//                                         {(provided) => (
//                                             <article
//                                                 className="flex align-center justify-between board-label"
//                                                 {...provided.dragHandleProps}
//                                                 {...provided.draggableProps}
//                                                 ref={provided.innerRef}
//                                             >
//                                                 <Button
//                                                     key={board._id}
//                                                     onClick={() => navigate(`/board/${board._id}`)}
//                                                     leftIcon={Board}
//                                                     kind="tertiary"
//                                                     className="board btn">
//                                                     {board.title}
//                                                 </Button>
//                                                 <MenuButton className="board-menu">
//                                                     <Menu id="menu" size="large">
//                                                         <MenuItem icon={Duplicate} title="Duplicate Board" onClick={() => onDuplicateBoard({ boardId: board._id })} />
//                                                         <MenuItem icon={Delete} title="Delete" onClick={() => onRemoveBoard({ boardId: board._id })} />
//                                                     </Menu>
//                                                 </MenuButton>
//                                             </article>
//                                         )}
//                                     </Draggable>
//                                 ))}
//                                 {provided.placeholder}
//                             </div>
//                         )}
//                     </Droppable>
//                 </DragDropContext>
//             </section>
//         </section >
//     )
// }





// {
//     boards.length > 0 && boards.map(board =>
//         <article key={board._id} className="flex align-center justify-between board-label">
//             <Button
//                 key={board._id}
//                 onClick={() => navigate(`/board/${board._id}`)}
//                 leftIcon={Board}
//                 kind="tertiary"
//                 className="board btn">
//                 {board.title}
//             </Button>
//             <MenuButton className="board-menu">
//                 <Menu id="menu" size="large">
//                     <MenuItem icon={Duplicate} title="Duplicate Boarder" onClick={() => onDuplicate({ boardId: board._id })} />
//                     <MenuItem icon={Delete} title="Delete" onClick={() => onRemove({ boardId: board._id })} />
//                 </Menu>
//             </MenuButton>
//         </article>
//     )
// }