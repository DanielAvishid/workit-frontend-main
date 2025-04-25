import { Menu, MenuButton, Search as SearchInput, MenuItem, EditableHeading, MenuTitle, Button, MenuDivider, TabList, Tab, Table, SplitButton, SplitButtonMenu, IconButton, Icon, AvatarGroup, Avatar, Tooltip } from "monday-ui-react-core"
import { NavigationChevronLeft, Activity, Sort, DropdownChevronDown, DropdownChevronUp, Home, Delete, Download, Group, Search, PersonRound, CloseSmall, Chart, Edit, Favorite, ShortText, Info, AddSmall, Duplicate, Table as TableIcon, Menu as MenuIcon, Invite, SettingsKnobs } from "/node_modules/monday-ui-react-core/src/components/Icon/Icons"
import { GoStarFill } from "react-icons/go";
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { boardService } from "../services/board.service"
import { BoardModal } from "./BoardModal"
import { MembersFilterModal } from "./MembersFilterModal"
import { useClickOutside } from "../hooks/useClickOutside"

export function BoardHeader({ onAddTaskFromHeader, board, onRemoveBoard, onSaveBoard, onDuplicateBoard, filterBy, setFilterBy, sortBy, setSortBy, onAddGroup, isScrolling }) {

    const [isCollapse, setIsCollapse] = useState(false)
    const [isInputFocus, setIsInputFocus] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const inputRef = useRef(null)

    const personBtn = useRef();
    const { isFocus: isPersonModalOpen, setIsFocus: setIsPersonModalOpen } = useClickOutside(personBtn);

    const navigate = useNavigate()

    const activityUrl = `/board/${board._id}/activity_log`

    function handleKeyPress(ev) {
        if (ev.key === 'Enter') {
            ev.target.blur()
        }
    }

    function onCloseModal() {
        setIsModalOpen(false)
    }

    function handleInputFocus() {
        setIsInputFocus(true)
    }

    function handleInputBlur() {
        if (!inputValue) {
            setIsTyping(false)
        }
        setIsInputFocus(false)
    }

    function handleInputChange(ev) {
        setFilterBy({ ...filterBy, txt: ev.target.value })
        if (ev.target.value) {
            setIsTyping(true)
            setInputValue(ev.target.value)
        } else {
            setIsTyping(false)
        }
    }

    function handleClearInputClick() {
        inputRef.current.value = ''
        inputRef.current.focus()
        setIsTyping(false)
        setIsInputFocus(true)
    }

    const filteredPersonUrl = board.members
        .filter(member => member._id === filterBy.person)
        .map(member => member.imgUrl);

    // if (window.innerWidth < 600) return <BoardHeaderMobile />

    return (
        <section className={`board-header full ${isCollapse ? 'collapse' : ''} ${isScrolling ? 'scrolling' : ''}`}>
            {!isCollapse && !isScrolling && <section className="container first-row-container">
                {window.innerWidth < 600 && <IconButton icon={NavigationChevronLeft} kind={IconButton.kinds.TERTIARY} onClick={() => navigate('/board')} />}

                <div className="title-container">
                    <EditableHeading
                        className="board-title-input"
                        type={EditableHeading.types.h1}
                        value={board.title}
                        tooltip='Click to Edit'
                        tooltipPosition="bottom"
                        customColor="#323338" //change to variable
                        onBlur={(ev) => onSaveBoard({ board, key: 'title', value: ev.target.value })}
                        onKeyDown={handleKeyPress}
                    />
                    <div className="info-icons-container">
                        <IconButton
                            iconClassName='info-icon'
                            icon={Info}
                            kind={IconButton.kinds.TERTIARY}
                            size={IconButton.sizes.SMALL}
                            ariaLabel="Show board description"
                            onClick={() => setIsModalOpen(true)} />
                        <IconButton
                            iconClassName={`info-icon ${board.isStarred ? 'favorite' : ''}`}
                            icon={board.isStarred ? GoStarFill : Favorite}
                            kind={IconButton.kinds.TERTIARY}
                            size={IconButton.sizes.SMALL}
                            ariaLabel={board.isStarred ? "Remove from favorites" : "Add to favorites"}
                            onClick={() => onSaveBoard({ board, key: 'isStarred', value: !board.isStarred })} />
                    </div>
                </div>
                <div className="options-container">
                    <Button className="activity-btn" kind={Button.kinds.TERTIARY} size={Button.sizes.SMALL} onClick={() => navigate(activityUrl)}>
                        Activity
                        <AvatarGroup max={2} size={Avatar.sizes.SMALL}>
                            {board.members.map(member =>
                                <Avatar className="avatar" type={Avatar.types.IMG} src={member.imgUrl} ariaLabel={member.fullname} />
                            )}
                        </AvatarGroup>
                    </Button>
                    <Link className="btn" to='#'>
                        <Button className="invite-btn" noSidePadding={true} kind={Button.kinds.SECONDARY}>
                            <Icon className="invite-icon" icon={Invite} />
                            <span>Invite / 1</span>
                        </Button>
                    </Link>
                    <MenuButton tooltipContent='Options' tooltipPosition="top"
                        className="menu-btn" component={MenuIcon}>
                        <Menu id="menu">
                            <MenuTitle caption="Board options" captionPosition={MenuTitle.positions.TOP} />
                            <MenuItem icon={Edit} iconType={MenuItem.iconType.SVG} title="Rename board" onClick={() => setIsModalOpen(true)} />
                            <MenuItem icon={Activity} iconType={MenuItem.iconType.SVG} title="Activity log" onClick={() => navigate(activityUrl)} />
                            <MenuItem icon={board.isStarred ? GoStarFill : Favorite} iconType={MenuItem.iconType.SVG} title={board.isStarred ? "Remove from favorites" : "Add to favorites"} onClick={() => onSaveBoard({ board, key: 'isStarred', value: !board.isStarred })} />
                            <MenuItem icon={Info} iconType={MenuItem.iconType.SVG} title="Show board description" onClick={() => setIsModalOpen(true)} />
                            <MenuItem icon={Duplicate} iconType={MenuItem.iconType.SVG}
                                title="Duplicate board" onClick={() => { onDuplicateBoard({ boardId: board._id }) }} />
                            <MenuItem icon={Delete} iconType={MenuItem.iconType.SVG} title="Delete board"
                                onClick={() => { onRemoveBoard({ board, boardId: board._id }) }} />
                        </Menu>
                    </MenuButton>
                </div>
            </section>}
            {(!isCollapse && !isScrolling && board.description) && <section className={`second-row-container`}>
                <div className="flex align-center">
                    <p className="board-description" onClick={() => setIsModalOpen(true)}>{board.description}</p>
                    <span className="see-more" onClick={() => setIsModalOpen(true)}>See More</span>
                </div>
            </section>}
            <section className={`container third-row-container ${!board.description ? 'no-description' : ''} ${isCollapse || isScrolling ? 'collapse' : ''}`}>
                <div className="board-view-container">
                    {(isCollapse || isScrolling) && <div className="title-container">
                        <EditableHeading
                            style={{ fontSize: '24px' }}
                            className="board-title-input"
                            type={EditableHeading.types.h2}
                            value={board.title}
                            tooltip='Click to Edit'
                            tooltipPosition="bottom"
                            customColor="#323338" //change to variable
                            onBlur={(ev) => onSaveBoard({ board, key: 'title', value: ev.target.value })}
                            onKeyDown={handleKeyPress}
                        />
                    </div>}
                    <TabList className="tab-list">
                        <Tab key='main' tabInnerClassName='main-tab' icon={Home} onClick={() => (navigate(`/board/${board._id}`))}>Main Table</Tab>
                        {/* <Tab key='kanban' tabInnerClassName='tab'>Kanban</Tab> */}
                        <Tab key='dashboard' tabInnerClassName='tab' onClick={() => (navigate('views/dashboard'))}>Dashboard</Tab>
                    </TabList>
                    <div>
                        <MenuButton tooltipContent='Add View' className="add-button" component={AddSmall} >
                            <Menu id="menu" size={Menu.sizes.MEDIUM}>
                                <MenuTitle caption="Board views" captionPosition={MenuTitle.positions.TOP} />
                                <MenuItem icon={TableIcon} iconType={MenuItem.iconType.SVG} title="Table" />
                                <MenuItem icon={Chart} iconType={MenuItem.iconType.SVG} title="Chart" />
                                <MenuItem icon={CloseSmall} iconType={MenuItem.iconType.SVG} title="Kanban" />
                            </Menu>
                        </MenuButton>
                    </div>
                </div>
                <div className="options-container">
                    {(isCollapse || isScrolling) && <Link className="btn" to='#'>
                        <Button className="invite-btn" noSidePadding={true} kind={Button.kinds.SECONDARY}>
                            <Icon className="invite-icon" icon={Invite} />
                            <span>Invite / 1</span>
                        </Button>
                    </Link>}
                    {(isCollapse || isScrolling) && <MenuButton tooltipContent='Options' tooltipPosition="top"
                        className="menu-btn" component={MenuIcon}>
                        <Menu id="menu">
                            <MenuTitle caption="Board options" captionPosition={MenuTitle.positions.TOP} />
                            <MenuItem icon={Edit} iconType={MenuItem.iconType.SVG} title="Rename board" onClick={() => setIsModalOpen(true)} />
                            <MenuItem icon={Duplicate} iconType={MenuItem.iconType.SVG}
                                title="Duplicate board" onClick={() => onDuplicateBoard({ boardId: board._id })} />
                            <MenuItem icon={Delete} iconType={MenuItem.iconType.SVG} title="Delete board"
                                onClick={() => { onRemove({ board, boardId: board._id }); navigate('/board') }} />
                        </Menu>
                    </MenuButton>}
                    {!isScrolling && <IconButton className='collapse-btn' icon={isCollapse ? DropdownChevronDown : DropdownChevronUp} kind={IconButton.kinds.SECONDARY}
                        size={IconButton.sizes.XXS} ariaLabel={isCollapse ? "Expand header" : "Collapse header"} onClick={() => setIsCollapse(!isCollapse)} />}
                </div>
            </section>
            <MenuDivider className='menu-divider' />
            <section className="fourth-row-container">
                <SplitButton className='split-btn' children="New Item" size={SplitButton.sizes.SMALL}
                    onClick={() => onAddTaskFromHeader(board)}
                    secondaryDialogContent={<SplitButtonMenu id="split-menu">
                        <MenuItem icon={Group} title="New group of Items" onClick={() => onAddGroup('top')} />
                        {/* <MenuItem icon={Download} title="import Items" /> */}
                    </SplitButtonMenu>} />
                <div className="btns-container">
                    <div className={`search-container ${isInputFocus ? 'is-focus' : ''} ${isTyping ? 'typing' : ''}`}>
                        <Icon className="search-icon" icon={Search} />
                        <input
                            className={`search-input`}
                            type="text"
                            ref={inputRef}
                            value={filterBy.txt}
                            onFocus={handleInputFocus}
                            onChange={(ev) => handleInputChange(ev)}
                            onBlur={handleInputBlur}
                            placeholder="Search" />
                        {isTyping && <Button className="clear-btn btn" kind={Button.kinds.TERTIARY} onClick={() => handleClearInputClick()}>
                            <Icon className="x-icon" icon={CloseSmall} onClick={() => setFilterBy({ ...filterBy, txt: '' })} />
                        </Button>}
                        {(isInputFocus || isTyping) && <Button className="options-btn btn" kind={Button.kinds.TERTIARY}>
                            <Icon className="setting-icon" icon={SettingsKnobs} />
                        </Button>}
                    </div>
                    <div className="person-filter-container">
                        <Tooltip
                            content='Filter by person'
                            animationType="expand"
                        >
                            <div className="relative">
                                <Button
                                    className={`person-btn ${filterBy.person ? 'active' : ''} ${isPersonModalOpen ? 'focused' : ''}`}
                                    leftIcon={PersonRound}
                                    kind="tertiary"
                                    size="small"
                                    ref={personBtn}
                                    active={filterBy.person ? true : false}
                                    onClick={() => setIsPersonModalOpen(!isPersonModalOpen)}
                                >
                                    Person
                                </Button>
                                {filterBy.person &&
                                    <>
                                        <div className="remove-filter show" onClick={() => setFilterBy({ ...filterBy, person: null })}>
                                            <Icon icon={CloseSmall} />
                                        </div>
                                        <Avatar
                                            size={Avatar.sizes.SMALLX}
                                            type={Avatar.types.IMG}
                                            src={filteredPersonUrl}
                                            className="filter-avatar"
                                        />
                                    </>
                                }
                            </div>
                        </Tooltip>
                        {isPersonModalOpen &&
                            <div className="modal" onClick={(ev) => ev.stopPropagation()}>
                                <MembersFilterModal members={board.members} filterBy={filterBy} setFilterBy={setFilterBy} />
                            </div>
                        }

                    </div>
                    <Tooltip
                        content='Sort groups'
                        animationType="expand">
                        <Button
                            className={`sortby-btn ${sortBy ? 'focused' : ''}`}
                            onClick={() => setSortBy(!sortBy)}
                            leftIcon={Sort}
                            kind="tertiary"
                            size="small"
                        >
                            Sort
                        </Button>
                    </Tooltip>
                </div>
            </section>
            {isModalOpen && <BoardModal board={board} onSaveBoard={onSaveBoard} handleKeyPress={handleKeyPress} onCloseModal={onCloseModal} />}
        </section >
    )
}