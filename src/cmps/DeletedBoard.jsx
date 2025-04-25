import { Button } from "monday-ui-react-core";
import { Link } from "react-router-dom";

export function DeletedBoard() {

    return (
        <div className="deleted-board-page full">
            <img src="https://cdn.monday.com/images/recycle_bin/empty_state_deleted_3.svg" alt="" />
            <h2 className="title">{`board has been deleted`}</h2>
            <div className="subtitle">
                <span>
                    Recently deleted boards can be restored from <a href="#">Trash.</a>
                </span>
            </div>
            <Link to={'/board'}>
                <Button className="back-btn">
                    Back to workspace
                </Button>
            </Link>
        </div>
    )
}