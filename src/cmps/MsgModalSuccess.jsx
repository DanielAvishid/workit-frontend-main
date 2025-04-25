import { useState } from "react"
import { eventBusService } from "../services/event-bus.service.js"
import { useEffect } from "react"
import { Toast } from "monday-ui-react-core"

export function MsgModalSuccess() {

    const [msg, setMsg] = useState(null)
    let actions = null
    if (msg && msg.txt.includes('delete')) {
        actions = [
            {
                content: 'Undo',
                type: 'button'
            }
        ]
    }

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', msg => {
            setMsg(msg)
            console.log(msg)
            setTimeout(onCloseMsg, 60000)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    function onCloseMsg() {
        setMsg(null)
    }

    if (!msg) return null

    return (
        <Toast
            actions={actions}
            className="msg-modal"
            type={Toast.types.POSITIVE}
            open
            onClose={() => onCloseMsg()}
        >
            {msg.txt}
        </Toast>
    )
}
