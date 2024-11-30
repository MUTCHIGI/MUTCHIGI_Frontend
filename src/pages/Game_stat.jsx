import './CSS/Game_stat.css';
import {useContext, useEffect, useState} from "react";
import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import Button from "../components/Public/Button.jsx";
import {useNavigate} from "react-router-dom";
import Chart from 'react-apexcharts';
import {WindowSizeContext} from "../App.jsx";
import Game_stat_select from "../components/InGame/Game_Stat_Select.jsx";

function Game_stat({answerCount,setAnswerCount,
    answeredPerson,setAnsweredPerson,
    answerTime,setAnswerTime,
    userInfo,setUserInfo,
    setRestartQuizId,setFirstCreate,
}) {
    const [selected,setSelected] = useState('select1');
    let navigator = useNavigate();
    const sortedEntries = Object.entries(answerCount).sort(([, valueA], [, valueB]) => valueB - valueA);
    const labels_polarArea = sortedEntries.map(([key]) => key);
    const series_polarArea = sortedEntries.map(([, value]) => value);

    let windowSize = useContext(WindowSizeContext);
    let width = windowSize.width;
    let height = windowSize.height;
    let ratio = Math.min(width/1920,height/1080);

    let fontSize = 25*ratio;

    const options_polarArea = {
        chart: {
            type: "polarArea",
        },
        labels: labels_polarArea,
        fill: {
            opacity: 0.8, // 투명도 설정
        },
        stroke: {
            width: 1,
            colors: ["#fff"], // 섹션 경계선
        },
        yaxis: {
          tickAmount: 1,
            max: sortedEntries[0][1],
        },
        legend: {
            position: "bottom",
            fontSize: fontSize,
        },
    };

    const categories = Object.keys(answerTime);

    // series 데이터 생성
    const series_bar = [
        {
            name: 'Minimum',
            data: categories.map((key) => answerTime[key].min),
        },
        {
            name: 'Maximum',
            data: categories.map((key) => answerTime[key].max),
        },
        {
            name: 'Average',
            data: categories.map((key) => {
                // testEntries[key] 값이 0보다 클 경우에만 나누기 계산
                if (answerCount[key] > 0) {
                    return answerTime[key].sum / answerCount[key];
                } else {
                    // testEntries[key]가 0일 경우 처리 (예: 0 또는 다른 값 설정)
                    return 0; // 또는 NaN 등 적절한 값 설정
                }
            }),
        },
    ];

    const options_bar = {
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories, // x-axis labels (test1, test2, ...)
            labels: {
                style: {
                    fontSize: 16*ratio,
                }
            }
        },
        yaxis: {
            title: {
                text: 'Quiz Solving Time',
                style: {
                    fontSize: 20*ratio,
                }
            },
            labels: {
                formatter: function (val) {
                    return Math.round(val); // 소수점을 반올림하여 정수로 표시
                },
                style: {
                    fontSize: 16*ratio
                }
            }
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toFixed(2); // 소수점 2자리까지 표시
                },
            },
        },
    };

    return <div className="Game_stat">
        <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate} setRestartQuizId={setRestartQuizId}/>
        <Game_stat_select selected={selected} setSelected={setSelected}/>
        <div className="stat_board">
            <div className="stat_innerbox">
                {selected==='select1' &&
                    <>
                        {sortedEntries.map(([key, value], index) => (
                            <div key={key} className={`stat_ranking_${index + 1}`}>
                                <div className="ranking">
                                    {index + 1}등&nbsp;
                                </div>
                                <div className="ranking_username">
                                    {key}&nbsp;&nbsp;
                                </div>
                                <div className="ranking_value">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </>
                }
                {selected === 'select2' &&
                    <>
                        <div className="answered_person_title">
                            <div className="apt_title">
                                제목
                            </div>
                            <div className="apt_person">
                                맞춘사람
                            </div>
                            <div className="apt_time">
                                소요시간
                            </div>
                        </div>
                        {answeredPerson.map((person, index) => {
                            if (person.time !== -1) {
                                return (
                                    <div key={index} className="answered_person">
                                        <div className="answered_person_index">
                                            {index + 1}
                                        </div>
                                        <div className="answered_person_answer">
                                            {person.answer}
                                        </div>
                                        <div className="answered_person_person">
                                            {person.name}
                                        </div>
                                        <div className="answered_person_time">
                                            {person.time.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="answered_person">
                                        <div className="answered_person_index">
                                            {index + 1}
                                        </div>
                                        <div className="answered_person_answer">
                                            {person.answer}
                                        </div>
                                        <div className="answered_person_person">
                                            정답자 없음
                                        </div>
                                        <div className="answered_person_time">

                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </>
                }
                {selected === 'select3' &&
                    <div className="bar_chart">
                        <Chart options={options_bar} series={series_bar} type="bar" width={1200 * ratio} height={600*ratio}/>
                    </div>
                }
            </div>
            {selected === 'select1' &&
                <div className="polar_chart">
                    <Chart options={options_polarArea} series={series_polarArea} type="polarArea" width={700 * ratio}
                           height={700 * ratio}/>
                </div>
            }
            {selected === 'select2' &&
                <div className="answered_chart">

                </div>
            }
        </div>
        <div className="stat_board_bottom">
            <Button text={"홈 화면으로"} classname={"stat_gohome"} onClick={() => {
                setAnswerCount({});
                setAnsweredPerson([]);
                setAnswerTime({});
                navigator('/home');
            }}/>
        </div>
    </div>
}

export default Game_stat;