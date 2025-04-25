import { SummaryItem } from "../utilsCmps/SummaryItem";

export function LabelsSummary({ group, board, type }) {
    const groupData = group.tasks.map((task) => task[type]);

    const dataCountMap = groupData.reduce((acc, dataId) => {
        acc[dataId] = (acc[dataId] || 0) + 1;
        return acc;
    }, {});

    const key = type + 'Labels';
    const labels = board[key];
    const filteredLabels = labels.filter((label) => dataCountMap[label.id] !== undefined);

    return (
        <div className="labels-summary flex align-center justify-center">
            {filteredLabels.map((label) => {
                return (
                    <SummaryItem
                        key={label.id}
                        dataCount={dataCountMap[label.id]}
                        totalDataCount={group.tasks.length}
                        color={label.color}
                        title={label.title}
                    />
                );
            })}
        </div>
    );
}
