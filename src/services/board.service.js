import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { httpService } from './http.service.js';
import { SOCKET_EMIT_UPDATE_BOARD, socketService } from './socket.service.js';

const STORAGE_KEY = 'boardDB'
const BASE_URL = 'board/'

export const boardService = {
    query,
    getById,
    update,
    remove,
    duplicate,
    addBoard,
    addTaskFromHeader,
    getEmptyBoard,
    getEmptyGroup,
    getEmptyTask,
    getEmptyStatusLabel,
    getBoardById
}

async function query(filterBy = {}) {
    try {
        const boards = await httpService.get(BASE_URL, { ...filterBy })
        return boards
    } catch (err) {
        throw err
    }
    // let boards = await storageService.query(STORAGE_KEY)
    // if (filterBy.title) {
    //     const regax = new RegExp(filterBy.title, 'i')
    //     boards = boards.filter(board => regax.test(board.title))
    // }
    // return boards
}

async function getById({ board, boardId, taskId }) {
    if (!board) {
        try {
            board = await httpService.get(BASE_URL + boardId)
        } catch (err) {
            throw err
        }
    }
    if (taskId) {
        return board.groups.map(group => group.tasks.find(task => task.id === taskId))
            .filter(Boolean)[0];
    } else {
        return board
    }
    // if (!board) {
    //     board = await storageService.get(STORAGE_KEY, boardId)
    // }
    // if (taskId) {
    //     return board.groups.map(group => group.tasks.find(task => task.id === taskId))
    //         .filter(Boolean)[0];

    // } else {
    //     return storageService.get(STORAGE_KEY, boardId)
    // }
}

async function remove({ board, boardId, groupId, taskId }) {
    const user = userService.getLoggedinUser()
    if (!board) {
        try {
            board = await httpService.get(BASE_URL + boardId)
        } catch (err) {
            throw err
        }
    }
    // if (!board) {
    //     board = await storageService.get(STORAGE_KEY, boardId);
    // }

    const createChange = (prevValue, title, key = "Deleted") => ({
        prevValue,
        newValue: [],
        timestamp: Date.now(),
        key,
        title,
        by: user ? user : userService.getDefaultUser()
    });

    let change = null;

    if (taskId) {
        const groupsToSave = board.groups.map(group => {
            const updatedTasks = group.tasks.filter(task => {
                if (task.id === taskId) {
                    change = createChange(task, task.title);
                }
                return task.id !== taskId;
            });
            return { ...group, tasks: updatedTasks };
        });
        board = { ...board, groups: groupsToSave };
    } else if (groupId) {
        const groupToRemove = board.groups.find(group => group.id === groupId);
        if (groupToRemove) {
            change = createChange(groupToRemove, groupToRemove.title, 'Group Deleted');
            board.groups = board.groups.filter(group => group.id !== groupId);
        }
    } else {
        try {
            return await httpService.delete(BASE_URL + boardId)
        } catch (err) {
            throw err
        }
        // return await storageService.remove(STORAGE_KEY, boardId);
    }

    if (change) {
        board.activities.unshift(change);
    }

    try {
        return await httpService.put(BASE_URL + board._id, board)
    } catch (err) {
        throw err
    }
    // return await storageService.put(STORAGE_KEY, board);
}

async function addBoard(board) {
    const user = userService.getLoggedinUser()
    board.createdBy = user ? user : userService.getDefaultUser()
    delete board._id
    try {
        return await httpService.post(BASE_URL, board)
    } catch (err) {
        throw err
    }
    // return await storageService.post(STORAGE_KEY, board)
}

async function addTaskFromHeader(board, task = getEmptyTask()) {
    board.groups[0].tasks.unshift(task)
    try {
        return await httpService.put(BASE_URL + board._id, board)
    } catch (err) {
        throw err
    }
    // const savedBoard = await storageService.put(STORAGE_KEY, board)
    // return savedBoard
}

async function update({ type, board, groupId, taskId, key, value }) {
    const user = userService.getLoggedinUser()
    const groupIdx = board.groups.findIndex((group) => group.id === groupId);
    let change = null

    switch (type) {

        case 'task':
            const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId)
            const prevTask = board.groups[groupIdx].tasks[taskIdx]
            board.groups[groupIdx].tasks[taskIdx] = { ...prevTask, [key]: value }
            const updatedTask = board.groups[groupIdx].tasks[taskIdx]
            if (key === 'updates') break
            change = createChange(prevTask[key], value, updatedTask.title, key, user)
            break

        case 'group':
            const prevValue = board.groups[groupIdx][key]
            board.groups[groupIdx][key] = value

            switch (key) {
                case 'tasks':
                    change = createChange(prevValue, value, value[value.length - 1].title, 'created', user)
                    break
                case 'title':
                    change = createChange(prevValue, value, board.groups[groupIdx].title, 'Group Title Change', user)
                    break
                default:
                    change = createChange(prevValue, value, board.groups[groupIdx].title, key, user)
                    break
            }
            break

        default:
            board[key] = value
    }

    if (change) board.activities.unshift(change)

    try {
        let updatedBoard = await httpService.put(BASE_URL + board._id, board);
        return updatedBoard
    } catch (err) {
        throw err
    }
}

const createChange = (prevValue, newValue, title, key, user = null) => ({
    prevValue,
    newValue,
    timestamp: Date.now(),
    title,
    key,
    by: user ? user : userService.getDefaultUser()
})

async function duplicate({ boardId, groupId, taskId }) {
    let board
    try {
        board = await httpService.get(BASE_URL + boardId)
    } catch (err) {
        throw err
    }
    // const board = await storageService.get(STORAGE_KEY, boardId)
    if (taskId) {
        const groupIdx = board.groups.findIndex((group) => group.id === groupId)
        const task = { ...board.groups[groupIdx].tasks.find((task) => task.id === taskId) }
        task.id = utilService.makeId()
        task.title += '(copy)'
        console.log(task);
        board.groups[groupIdx].tasks.push(task)
    } else if (groupId) {
        const group = { ...board.groups.find(group => group.id === groupId) }
        console.log(group)
        group.tasks = group.tasks.map(task => ({ ...task, id: utilService.makeId() }))
        group.id = utilService.makeId()
        group.title = 'Duplicate of ' + group.title
        board.groups.push(group)
    } else {
        board.title = 'Duplicate of ' + board.title
        return await addBoard(board)
    }

    try {
        return await httpService.put(BASE_URL + board._id, board)
    } catch (err) {
        throw err
    }
    // return await storageService.put(STORAGE_KEY, board)
}

async function getBoardById(boardId, filterBy = { txt: '', person: null }, sortBy) {
    let board
    try {
        board = await httpService.get(BASE_URL + boardId)
    } catch (err) {
        throw err
    }
    // let board = await storageService.get(STORAGE_KEY, boardId)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        board.groups = board.groups.map((group) => {
            const filteredTasks = group.tasks.filter((task) => regex.test(task.title))

            // If there are matching tasks or the group title matches, include the group
            if (filteredTasks.length > 0 || regex.test(group.title)) {
                if (filteredTasks.length > 0) {
                    group.tasks = filteredTasks
                }
                return group;
            }
            // If no matching tasks and group title doesn't match, exclude the group
            return null
        }).filter((group) => group !== null) // Remove groups without matching tasks or title
    }

    if (filterBy.person) {
        board.groups = board.groups.map((group) => {
            const filteredTasks = group.tasks.filter((task) => task.members.includes(filterBy.person))

            console.log(filteredTasks);
            if (filteredTasks.length > 0) {
                group.tasks = filteredTasks
                return group;
            }

            return null;
        }).filter((group) => group !== null)
    }
    if (sortBy) {
        board.groups = board.groups.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();

            if (titleA < titleB) {
                return -1
            } else if (titleA > titleB) {
                return 1
            } else {
                return 0
            }
        })
    }
    return board;
}

////////////////////////////////////////////////////////////////////////////// get empty
function getEmptyBoard() {
    return {
        title: "New Board",
        description: "Manage any type of project. Assign owners, set timelines and keep track of where your project stands.",
        isStarred: false,
        archivedAt: Date.now(),
        createdBy: {
            "_id": "UjCos",
            "fullname": "Carmel Amarillio",
            "imgUrl": "https://ca.slack-edge.com/T057RE2PDLK-U059L5BAL4X-c085d0e44c2f-512"
        },
        style: {
            backgroundImage: ""
        },
        statusLabels: [
            {
                "id": "ls101",
                "title": "Working on it",
                "color": "#fdab3d"
            },
            {
                "id": "ls102",
                "title": "Stuck",
                "color": "#e2445c"
            },
            {
                "id": "ls103",
                "title": "Done",
                "color": "#00c875"
            },
            {
                "id": "ls104",
                "title": "",
                "color": "#c4c4c4",
                "isDefault": true
            }
        ],
        priorityLabels: [
            {
                "id": "lp101",
                "title": "Critical ⚠️️",
                "color": "#333333"
            },
            {
                "id": "lp102",
                "title": "High",
                "color": "#401694"
            },
            {
                "id": "lp103",
                "title": "Medium",
                "color": "#5559df"
            },
            {
                "id": "lp104",
                "title": "Low",
                "color": "#579bfc"
            },
            {
                "id": "lp105",
                "title": "",
                "color": "#c4c4c4",
                "isDefault": true
            }
        ],
        groups: [
            {
                "id": utilService.makeId(),
                "title": "Programming",
                "archivedAt": Date.now(),
                "tasks": [
                    {
                        "id": utilService.makeId(),
                        "title": "Fix handle change func",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp103",
                        "timeline": [1698155558000, 1698955558000],
                        "members": ["WOWOWO"],
                        "date": 1699635558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Remove tasks",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp101",
                        "timeline": [1697855558000, 1696755558000],
                        "members": ["UjCos"],
                        "date": 1699435558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Update response time",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp102",
                        "timeline": [],
                        "members": ["KKLLSS", "UjCos"],
                        "date": 1699235558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Add rating stars",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp101",
                        "timeline": [1698825558000, 1698925558000],
                        "members": ["WOWOWO"],
                        "date": 1698255558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Update react version",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp101",
                        "timeline": [1698155558000, 1698955558000],
                        "members": ["UjCos"],
                        "date": 1699235558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Update response time",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp103",
                        "timeline": [1697655558000, 1699955558000],
                        "members": ["KKLLSS", "UjCos"],
                        "date": 1698555558000
                    },
                ],
                "style": { "backgroundColor": "#579BFC" }
            }, {
                "id": utilService.makeId(),
                "title": "Managment",
                "archivedAt": Date.now(),
                "tasks": [
                    {
                        "id": utilService.makeId(),
                        "title": "Implement Data Structures",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp103",
                        "timeline": [1698795558000, 1697153558000],
                        "members": ["KKLLSS", "WOWOWO", "UjCos"],
                        "date": 1698955558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Optimize Algorithms",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp102",
                        "timeline": [1698835558000, 1698875558000],
                        "members": ["UjCos", "WOWOWO"],
                        "date": 1697235558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Database Design",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp101",
                        "timeline": [],
                        "members": ["KKLLSS", "UjCos"],
                        "date": null
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "UI/UX Improvements",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp102",
                        "timeline": [1698815558000, 1698335558000],
                        "members": ["WOWOWO"],
                        "date": 1692835558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Security Audit",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp101",
                        "timeline": [1698155558000, 1698955558000],
                        "members": ["WOWOWO"],
                        "date": 1698155558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Machine Learning Module",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp102",
                        "timeline": [],
                        "members": ["UjCos"],
                        "date": null
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Integration Setup",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp101",
                        "timeline": [1697835558000, 1697835558000],
                        "members": ["WOWOWO", "KKLLSS"],
                        "date": 1699235558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Bug Fixes",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp101",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["WOWOWO", "UjCos"],
                        "date": 1698835558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Documentation Update",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp103",
                        "timeline": [],
                        "members": ["UjCos", "KKLLSS"],
                        "date": null
                    }
                ],
                "style": {
                    "backgroundColor": "#ff4d4d"
                }
            },

            {
                "id": utilService.makeId(),
                "title": "UI/UX",
                "archivedAt": Date.now(),
                "tasks": [
                    {
                        "id": utilService.makeId(),
                        "title": "Make it look better",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp102",
                        "timeline": [1698235558000, 1696835558000],
                        "members": ["UjCos"],
                        "date": 1698335558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Fix main button",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp101",
                        "timeline": [1697835558000, 1699235558000],
                        "members": ["KKLLSS", "WOWOWO"],
                        "date": 1679819200000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Check New libraries",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp103",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["KKLLSS"],
                        "date": 1698835558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Update modal layout",
                        "updates": [],
                        "activities": [],
                        "status": "ls103",
                        "priority": "lp101",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["KKLLSS", "WOWOWO", "UjCos"],
                        "date": 1698835558000
                    }
                ],
                "style": { "backgroundColor": "#A25DDC" }
            },
            {
                "id": utilService.makeId(),
                "title": "Analysis",
                "archivedAt": Date.now(),
                "tasks": [
                    {
                        "id": utilService.makeId(),
                        "title": "Data collection",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp103",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["UjCos"],
                        "date": 1698835558000
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Renew data",
                        "updates": [],
                        "activities": [],
                        "status": "ls102",
                        "priority": "lp101",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["KKLLSS", "WOWOWO"],
                        "date": null
                    },
                    {
                        "id": utilService.makeId(),
                        "title": "Check for duplicates",
                        "updates": [],
                        "activities": [],
                        "status": "ls101",
                        "priority": "lp102",
                        "timeline": [1698835558000, 1698835558000],
                        "members": ["WOWOWO"],
                        "date": 1698835558000
                    },
                ],
                "style": { "backgroundColor": "#00c875" }
            }
        ],

        activities: [],

        members: [
            {
                "_id": "UjCos",
                "fullname": "Carmel Amarillio",
                "imgUrl": "https://ca.slack-edge.com/T057RE2PDLK-U059L5BAL4X-c085d0e44c2f-512"
            },
            {
                "_id": "KKLLSS",
                "fullname": "Daniel Avishid",
                "imgUrl": "https://ca.slack-edge.com/T057RE2PDLK-U05GBTP3GBW-a584b2b1cd9d-72"
            },
            {
                "_id": "WOWOWO",
                "fullname": "Ofir Kaspi",
                "imgUrl": "https://ca.slack-edge.com/T057RE2PDLK-U05H4F34Z5K-127c79816e57-72"
            },
            {
                "_id": "BABABA",
                "fullname": "Hadas Fahri",
                "imgUrl": "https://style.monday.com/static/media/person1.de30c8ee.png"
            },
            {
                "_id": "DADADA",
                "fullname": "Sergey Roytman",
                "imgUrl": "https://style.monday.com/static/media/person2.24c7233e.png"
            },
            {
                "_id": "FAFAFA",
                "fullname": "Aviv kohavi",
                "imgUrl": "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
            },
            {
                "_id": "GAGAGA",
                "fullname": "Yossi Saadi",
                "imgUrl": "https://style.monday.com/static/media/person3.3661bfe5.png"
            },
        ],

        cmpsOrder: [
            {
                "id": "co101",
                "title": "Members",
                "type": "members"
            },
            {
                "id": "co102",
                "title": "Status",
                "type": "status"
            },
            {
                "id": "co103",
                "title": "Priority",
                "type": "priority"
            },
            {
                "id": "co104",
                "title": "Due Date",
                "type": "date"
            },
            {
                "id": "co105",
                "title": "Timeline",
                "type": "timeline"
            }
        ]
    }
}

function getEmptyGroup() {
    console.log('get here');
    return {
        id: utilService.makeId(),
        title: 'New Group',
        archivedAt: Date.now(),
        tasks: [],
        style: {
            backgroundColor: utilService.getRandomLabelColor()
        }
    }
}

function getEmptyTask(title = 'New Item') {
    return {
        id: utilService.makeId(),
        title,
        updates: [],
        status: "ls104",
        priority: "lp102",
        members: [],
        timeline: [1699522460000, 1699622460000],
        date: 1699522460000
    }
}

function getEmptyStatusLabel() {
    return {
        id: utilService.makeId(),
        title: '',
        color: utilService.getRandomLabelColor()
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function _createBoard() {
    const board = {
        title: "Robot dev proj",
        isStarred: false,
        archivedAt: 1589983468418,
        createdBy: {
            "_id": "UjCos",
            "fullname": "Carmel Amarillio",
            "imgUrl": "https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*"
        },
        style: {
            backgroundImage: ""
        },
        labels: {
            status: [
                {
                    "id": "ls101",
                    "title": "Done",
                    "color": "#00c875"
                },
                {
                    "id": "ls102",
                    "title": "Working on it",
                    "color": "#fdab3d"
                },
                {
                    "id": "ls103",
                    "title": "Stuck",
                    "color": "#e2445c"
                },
                {
                    "id": "ls104",
                    "title": "",
                    "color": "#c4c4c4",
                    "isDefault": true
                }
            ],
            priority: [
                {
                    "id": "lp101",
                    "title": "Critical ⚠️️",
                    "color": "#333333"
                },
                {
                    "id": "lp102",
                    "title": "High",
                    "color": "#401694"
                },
                {
                    "id": "lp103",
                    "title": "Medium",
                    "color": "#5559df"
                },
                {
                    "id": "lp104",
                    "title": "Low",
                    "color": "#579bfc"
                },
                {
                    "id": "lp105",
                    "title": "",
                    "color": "#c4c4c4",
                    "isDefault": true
                }
            ]
        },
        members: [
            {
                "_id": "DOGWC",
                "fullname": "Daniel Avishid",
                "imgUrl": "https://hips.hearstapps.com/hmg-prod/images/happy-dog-outdoors-royalty-free-image-1652927740.jpg?crop=0.447xw:1.00xh;0.187xw,0&resize=980:*"
            }
        ],
        groups: [
            {
                "id": "g101",
                "title": "Group 1",
                "archivedAt": 1589983468418,
                "tasks": [
                    {
                        "id": "c101",
                        "title": "Replace logo",
                        "status": "Done", // monday
                        "priority": "lp101",
                        "timeline": [1696280400000, 1679040000000],
                        "members": ["UjCos"],
                    },
                    {
                        "id": "c102",
                        "title": "Add Samples",
                        "status": "Waiting for QA", // monday
                        "priority": "lp103",
                        "timeline": [1679040000000, 1696907932000],
                        "members": ["DOGWC", "UjCos"],
                    }
                ],
                "style": { "backgroundColor": "#0073ea" }
            },
            {
                "id": "g102",
                "title": "Group 2",
                "tasks": [
                    {
                        "id": "c103",
                        "title": "Do that",
                        "archivedAt": 1589983468418,
                        "status": "Done", // monday
                        "priority": "lp101",
                        "timeline": [1679040000000, 1697407100000],
                        "members": ["UjCos", "tZQiB", "DOGWC"],
                    },
                    {
                        "id": "c104",
                        "title": "Help me",
                        "status": "Working on it", // monday
                        "priority": "lp102",
                        "description": "description",
                        "comments": [
                            {
                                "id": "ZdPnm",
                                "txt": "also @yaronb please CR this",
                                "createdAt": 1590999817436,
                                "byMember": {
                                    "_id": "UjCos",
                                    "fullname": "Carmel Amarillio",
                                    "imgUrl": "ttps://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*"
                                }
                            }
                        ],
                        "checklists": [
                            {
                                "id": "YEhmF",
                                "title": "Checklist",
                                "todos": [
                                    {
                                        "id": "212jX",
                                        "title": "To Do 1",
                                        "isDone": false
                                    }
                                ]
                            }
                        ],
                        "members": ["UjCos", "DOGWC", "tZQiB"],
                        "labelIds": ["l101", "l102"],
                        "timeline": [1695418275139, 1698407932000],
                        "byMember": {
                            "_id": "DOGWC",
                            "username": "danielavishid",
                            "fullname": "Daniel Avishid",
                            "imgUrl": "https://hips.hearstapps.com/hmg-prod/images/happy-dog-outdoors-royalty-free-image-1652927740.jpg?crop=0.447xw:1.00xh;0.187xw,0&resize=980:*"
                        },
                        "style": {
                            "backgroundColor": "#a25ddc"
                        }
                    }
                ],
                "style": { "backgroundColor": "#a25ddc" }
            }
        ],
        activities: [
            {
                "id": "a101",
                "txt": "Changed Color",
                "createdAt": 154514,
                "byMember": {
                    "_id": "tZQiB",
                    "fullname": "Ofir Kaspi",
                    "imgUrl": "https://hips.hearstapps.com/hmg-prod/images/lonely-pug-royalty-free-image-1652974264.jpg?crop=0.447xw:1.00xh;0.355xw,0&resize=980:*"
                },
                "group": {
                    "id": "g101",
                    "title": "Urgent Stuff"
                },
                "task": {
                    "id": "c101",
                    "title": "Replace Logo"
                }
            }
        ],

        cmpsOrder: [
            {
                "id": "co101",
                "title": "Members",
                "type": "members"
            },
            {
                "id": "co102",
                "title": "Status",
                "type": "status"
            },
            {
                "id": "co103",
                "title": "Priority",
                "type": "priority"
            },
            {
                "id": "co104",
                "title": "Date",
                "type": "timeline"
            }
        ]
    }
    addBoard(board)
}

// CHECK WITH ME BEFORE USING !!!! (OFIR)

async function saveUser(user) {
    const savedUsers = await storageService.post('userDB', user)
    return savedUsers
}

// _createUser()

function _createUser() {
    const user =
        // {
        //     "fullname": "Daniel Avishid",
        //     "username": "danielavishid",
        //     "email": "danielavishid@workit.com",
        //     "password": "danielavishid",
        //     "imgUrl": "https://hips.hearstapps.com/hmg-prod/images/happy-dog-outdoors-royalty-free-image-1652927740.jpg?crop=0.447xw:1.00xh;0.187xw,0&resize=980:*",
        //     // "mentions": [{ //optional
        //     //     "id": "m101",
        //     //     "boardId": "m101",
        //     //     "taskId": "t101"
        //     // }]
        // }

        // {
        //     "fullname": "Ofir Kaspi",
        //     "username": "ofirkaspi",
        //     "email": "ofirkaspi@workit.com",
        //     "password": "ofirkaspi",
        //     "imgUrl": "https://hips.hearstapps.com/hmg-prod/images/lonely-pug-royalty-free-image-1652974264.jpg?crop=0.447xw:1.00xh;0.355xw,0&resize=980:*",
        //     // "mentions": [{ //optional
        //     //     "id": "m101",
        //     //     "boardId": "m101",
        //     //     "taskId": "t101"
        //     // }]
        // }

        // {
        //     "fullname": "Carmel Amarillio",
        //     "username": "carmelamarillio",
        //     "email": "carmelamarillio@workit.com",
        //     "password": "carmelamarillio",
        //     "imgUrl": "https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*",
        //     // "mentions": [{ //optional
        //     //     "id": "m101",
        //     //     "boardId": "m101",
        //     //     "taskId": "t101"
        //     // }]
        // }
        saveUser(user)
}