import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./Profile.css";

import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Profile = () => {
  !Cookies.get("token") ? (window.location.href = "/auth") : null;
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [level, setLevel] = React.useState({});
  const [data, setData] = React.useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        data.lastOnline = new Date(data.lastOnline).toLocaleString();
        setLevel(calculateLevelInfo(data.XP));
        console.log(progress);
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        window.location.href = "/auth";
      });
  }, []);

  function calculateLevelInfo(xp) {
    // Define the XP breakpoints for levels
    const breakpoints = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800,
      9100, 10500, 12000, 13600, 15300, 17100, 19000,
    ];

    // Check if XP is negative or zero (invalid case)
    if (xp <= 0) {
      return {
        level1: 1,
        currentXP: 0,
        levelMaxXP: breakpoints[0],
      };
    }

    // Find the corresponding level based on the XP
    let level1;
    for (level1 = 1; level1 < breakpoints.length; level1++) {
      if (xp < breakpoints[level1]) {
        break;
      }
    }

    const currentXP = xp - breakpoints[level1 - 1];
    const levelMaxXP = breakpoints[level1] - breakpoints[level1 - 1];

    const percentage = (currentXP / levelMaxXP) * 100;
    setProgress(Math.min(percentage, 100));

    return {
      level1: level1,
      currentXP: currentXP,
      levelMaxXP: levelMaxXP,
    };
  }

  const lang = {
    py: "Python",
    js: "JavaScript",
    java: "Java",
    c: "C",
    cpp: "C++",
  };

  /*
  const data = {
    img: "https://i.pravatar.cc/300",
    name: "Anurag Sawant",
    moodleId: "22204016",
    level: "Level 1",
    obtainedXP: 80,
    maxXP: 100,
    lastOnline: "Yesterday, 10:00 PM",
    gender: "Male",
    academicYear: "2020-2021",
    branch: "Information Tech.",
    rank: {
      alltime: 155,
      weekly: 21,
    },

    badges: [
      {
        name: "Python Expert",
        short: "pyexp",
      },
      {
        name: "JS Expert",
        short: "jsexp",
      },
      {
        name: "PHP Expert",
        short: "phpexp",
      },
    ],

    activity: [
      {
        name: "Djikstra's Algorithm",
        lang: "Python",
        difficulty: "Easy",
      },
      {
        name: "The Rail Problem",
        lang: "JavaScript",
        difficulty: "Hard",
      },
      {
        name: "Functions",
        lang: "PHP",
        difficulty: "Medium",
      },
      {
        name: "Multi Phrase Access",
        lang: "Python",
        difficulty: "Easy",
      },
    ],

    courses: [
      {
        name: "Python",
        grade: 7,
      },
      {
        name: "JavaScript",
        grade: 8,
      },
      {
        name: "PHP",
        grade: 9,
      },
    ],
  };*/

  if (isLoading) {
    /*
    return (
      <div className="Profile">
        <Navbar />

        <div className="profile-container">
          <div className="left">
            <div className="info">
              <SkeletonCircle size="130px" className="img-wrapper">
                <div className="img"></div>
              </SkeletonCircle>

              <SkeletonText noOfLines={5} className="info-main">
                <h4>{data.name}</h4>
                <p>{data.moodleId}</p>
                <div className="level">
                  <div className="bg"></div>
                  <div className="progress" id="progress"></div>
                </div>
                <div className="level-info-wrapper">
                  <div className="level-name"></div>
                  <div className="xp"></div>
                </div>
              </SkeletonText>
            </div>
            <div className="info2">
              <div className="container">
                <SkeletonText noOfLines={1} height="18px">
                  Last Online
                </SkeletonText>
                <SkeletonText noOfLines={1} height="18px"></SkeletonText>
              </div>
              <div className="container">
                <SkeletonText noOfLines={1} height="18px">
                  Gender
                </SkeletonText>
                <SkeletonText noOfLines={1} height="18px"></SkeletonText>
              </div>
              <div className="container">
                <SkeletonText noOfLines={1} height="18px">
                  Branch
                </SkeletonText>
                <SkeletonText noOfLines={1} height="18px"></SkeletonText>
              </div>
              <div className="container">
                <SkeletonText noOfLines={1} height="18px">
                  Academic Term
                </SkeletonText>
                <SkeletonText noOfLines={1} height="18px"></SkeletonText>
              </div>
            </div>
            <div className="badge">
              <div className="top">
                <SkeletonText noOfLines={1}>Badges</SkeletonText>
                <SkeletonText noOfLines={1} href="">
                  All (5)
                </SkeletonText>
              </div>
              <div className="badges-wrapper">
                <div className="badge-container">
                  <SkeletonCircle
                    alt=""
                    className="skeleton_badge"
                    size="70px"
                  />
                </div>{" "}
                <div className="badge-container">
                  <SkeletonCircle
                    alt=""
                    className="skeleton_badge"
                    size="70px"
                  />
                </div>{" "}
                <div className="badge-container">
                  <SkeletonCircle
                    alt=""
                    className="skeleton_badge"
                    size="70px"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="top">
              <div className="left">
                <div className="rank-alltime">
                  <SkeletonCircle className="fa-solid fa-infinity"></SkeletonCircle>
                  <div className="texts">
                    <SkeletonText noOfLines={1} height={5}>
                      All Time
                    </SkeletonText>
                    <SkeletonText noOfLines={1}>#</SkeletonText>
                  </div>
                </div>
                <div className="rank-weekly">
                  <SkeletonCircle className="fa-solid fa-7"></SkeletonCircle>
                  <div className="texts">
                    <SkeletonText noOfLines={1} height={5}>
                      Weekly
                    </SkeletonText>
                    <SkeletonText noOfLines={1}>#</SkeletonText>
                  </div>
                </div>
              </div>
              <div className="right">
                <SkeletonText noOfLines={1}>
                  Last Practice Activity
                </SkeletonText>
                <Skeleton></Skeleton>
                <SkeletonText />
              </div>
            </div>
            <div className="bottom">
              <Skeleton className="left"></Skeleton>
              <div className="right">
                <SkeletonText noOfLines={1}>Course Progress</SkeletonText>
                <Skeleton></Skeleton>
                <SkeletonText noOfLines={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );*/
    return <Loader />;
  } else {
    return (
      <div className="Profile">
        <Navbar />

        <div className="profile-container">
          <div className="left">
            <div className="info">
              <div className="img-wrapper">
                <div
                  className="img"
                  style={{
                    background: `url(${data.profilePicture}) no-repeat center center/cover`,
                  }}
                ></div>
              </div>

              <div className="info-main">
                <h4>{data.fname + " " + data.lname}</h4>
                <p>{data.mid}</p>
                <div className="level-name">Level {level.level1}</div>
                <div className="level">
                  <div className="bg"></div>
                  <div
                    className="progress"
                    id="progress"
                    style={{ width: progress + "%" }}
                  ></div>
                </div>
                <div className="level-info-wrapper">
                  <div className="xp">
                    {level.currentXP} XP / {level.levelMaxXP} XP
                  </div>
                </div>
              </div>
            </div>
            <div className="info2">
              <div className="container">
                <p>Last Online</p>
                <p>{data.lastOnline || "N/A"}</p>
              </div>
              <div className="container">
                <p>Gender</p>
                <p className="gender">{data.gender}</p>
              </div>
              <div className="container">
                <p>Branch</p>
                <p>{data.branch}</p>
              </div>
              <div className="container">
                <p>Academic Term</p>
                <p>
                  {data.AY} - {data.AY + 1}
                </p>
              </div>
            </div>
            <div className="badge">
              <div className="top">
                <h4>Badges</h4>
                <a href="">All ({data.badges ? data.badges.length : "0"})</a>
              </div>
              <div className="badges-wrapper">
                {data.badges ? (
                  <>
                    {data.badgesData.map((badge, index) => {
                      return (
                        <div className="badge-container" key={index}>
                          {" "}
                          <Tooltip label={badge.name} placement="top" hasArrow>
                            <img src={`/badges/${badge._id}.svg`} alt="" />
                          </Tooltip>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>No Badges Yet!</>
                )}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="top">
              <div className="left">
                <div className="rank-alltime">
                  <i className="fa-solid fa-infinity"></i>
                  <div className="texts">
                    <h3>All Time</h3>
                    <p>#{data.rank.alltime}</p>
                  </div>
                </div>
                <div className="rank-weekly">
                  <i className="fa-solid fa-7"></i>
                  <div className="texts">
                    <h3>Weekly</h3>
                    <p>#{data.rank.weekly}</p>
                  </div>
                </div>
              </div>
              <div className="right">
                <h2>Last Practice Activity</h2>
                <table>
                  <tbody>
                    {data.activityData.map((activity, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Link
                              to={`/editor/${activity._id}/${activity.language}`}
                            >
                              {activity.codeTitle}
                            </Link>
                          </td>
                          <td>{lang[activity.language]}</td>
                          <td className={activity.difficultyLevel}>
                            {activity.difficultyLevel}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bottom">
              <div className="left"></div>
              <div className="right">
                <h2>Enrolled Courses</h2>
                <table>
                  <tbody>
                    {data.courseData.map((course, index) => {
                      return (
                        <tr key={index}>
                          <td>{course.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
