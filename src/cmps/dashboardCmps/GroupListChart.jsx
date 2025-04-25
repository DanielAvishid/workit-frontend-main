import { DoughnutChart } from "./DoughnutChart";

export function GroupListChart({ board }) {
    return (
        <div className="overall-progress-container">
            <h4 className="header">Task completion percentages</h4>
            {board.groups.map((group, index) => (
                <div
                    className="doughnut-container"
                    key={group.id}
                >
                    <h4 style={{ color: group.style.backgroundColor }}>{group.title}</h4>
                    <div>
                        <DoughnutChart group={group} />
                    </div>
                </div>
            ))}
        </div>
    );
}
