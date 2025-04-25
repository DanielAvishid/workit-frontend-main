import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useSelector } from 'react-redux';
ChartJS.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export function MembersChart() {

    const board = useSelector(storeState => storeState.boardModule.board)

    const members = board.members; // Extract your list of members from board

    // Create an array to store datasets for each member
    const datasets = members.map((member) => {
        const memberData = {
            fullname: member.fullname.split(' ')[0],
            imgUrl: member.imgUrl,
        };

        // Count tasks for each status for the current member
        board.groups.forEach((group) => {
            group.tasks.forEach((task) => {
                if (task.members.includes(member._id)) {
                    console.log('group', group);
                    memberData[task.status] = (memberData[task.status] || 0) + 1;
                }
            });
        });

        return memberData;
    });

    console.log('datasets', datasets);

    // Extract all unique statuses from the datasets
    const allStatuses = new Set();
    datasets.forEach((data) => {
        Object.keys(data).forEach((key) => {
            if (key !== 'fullname' && key !== 'imgUrl') {
                allStatuses.add(key);
            }
        });
    });


    // Create a dataset for each status with titles and colors
    const statusDatasets = Array.from(allStatuses).map((status) => {
        // Find the status label information by ID
        const statusLabelInfo = board.statusLabels.find((label) => label.id === status);
        const labelTitle = statusLabelInfo ? statusLabelInfo.title : status;
        const labelColor = statusLabelInfo ? statusLabelInfo.color : `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        return {
            label: labelTitle,
            data: datasets.map((data) => data[status] || 0),
            backgroundColor: labelColor,
        };
    });

    const data = {
        labels: datasets.map((data) => data.fullname),
        datasets: statusDatasets,
    };

    const options = {
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: '#323338',
                    font: {
                        size: 14,
                    }
                },
                grid: {
                    display: false,
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    display: true,
                    color: '#323338',
                    font: {
                        size: 14,
                    }
                },
                grid: {
                    drawTicks: true,
                    drawOnChartArea: false
                },

            },
        },
        plugins: {
            datalabels: {
                color: '#ffffff',
                // anchor: 'end',
                // align: 'center',
                // backgroundColor: '#0000001a',
                // borderRadius: 5,
                font: {
                    size: 16,

                },
                display: function (context) {
                    return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
                }
            },
            legend: {
                display: false,
            }
        }
    };

    console.log(datasets);


    // const topLabels = {
    //     id: 'topLabels',
    //     afterDatasetsDraw(chart, args, pluginOptions) {
    //         const { ctx, scales: { x, y } } = chart

    //         chart.data.datasets[0].data.forEach((datapoint, index) => {
    //             const datasetArray = []
    //             chart.data.datasets.forEach((dataset) => {
    //                 datasetArray.push(dataset.data[index])
    //             })

    //             function totalSum(total, values) {
    //                 return total + values
    //             }

    //             let sum = datasetArray.reduce(totalSum, 0)

    //             ctx.font = '18px sans-serif'
    //             ctx.fillStyle = '#323338'
    //             ctx.textAlign = 'center'
    //             ctx.fillText(`${sum} Tasks`, x.getPixelForValue(index), 18)
    //         })

    //     }
    // }

    // const bgIimage = {
    //     id: 'bgIimage',
    //     beforeDatasetsDraw(chart, args, plugins) {
    //         const { ctx } = chart
    //         const chartImage = new Image()
    //         chartImage.src = mem
    //     }
    // }

    return (
        <div className='members-chart-container flex column'>
            <h4 className='header'>Tasks per person</h4>
            <div className='chart-container'>
                <Bar
                    data={data}
                    options={options}
                    plugins={[ChartDataLabels]}
                    className="custom-chart"
                />
            </div>
        </div>
    );
}