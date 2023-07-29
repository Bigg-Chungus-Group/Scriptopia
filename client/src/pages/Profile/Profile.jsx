import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import "./Profile.css";
import badge1 from "../../assets/badges/badge1.png";
import badge2 from "../../assets/badges/badge2.png";
import badge3 from "../../assets/badges/badge3.png";
import { Skeleton, SkeletonText, SkeletonCircle } from "@chakra-ui/react";

const Profile = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const badges = {
    jsexp: badge1,
    phpexp: badge2,
    pyexp: badge3,
  };

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
  };

  useEffect(() => {
    const progress = document.getElementById("progress");
    progress.style.width = `${data.obtainedXP}%`;

    setTimeout(() => {
      setIsLoading(false);
    }, 2000); //! REMOVE TIMEOUT BEFORE PRODUCTION
  });

  if (isLoading) {
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
                <SkeletonText noOfLines={1}>Last Practice Activity</SkeletonText>
                <Skeleton>
                  
                </Skeleton>
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
    );
  } else {
    return (
      <div className="Profile">
        <Navbar />

        <div className="profile-container">
          <div className="left">
            <div className="info">
              <div className="img-wrapper">
                <div className="img"></div>
              </div>

              <div className="info-main">
                <h4>{data.name}</h4>
                <p>{data.moodleId}</p>
                <div className="level">
                  <div className="bg"></div>
                  <div className="progress" id="progress"></div>
                </div>
                <div className="level-info-wrapper">
                  <div className="level-name">{data.level}</div>
                  <div className="xp">{`${data.obtainedXP} / ${data.maxXP}`}</div>
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
                <p>{data.gender}</p>
              </div>
              <div className="container">
                <p>Branch</p>
                <p>{data.branch}</p>
              </div>
              <div className="container">
                <p>Academic Term</p>
                <p>{data.academicYear}</p>
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
                    {data.badges.map((badge, index) => {
                      return (
                        <div className="badge-container" key={index}>
                          <img src={badges[badge.short]} alt="" />
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
                    {data.activity.map((activity, index) => {
                      return (
                        <tr key={index}>
                          <td>{activity.name}</td>
                          <td>{activity.lang}</td>
                          <td className={activity.difficulty}>
                            {activity.difficulty}
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
                <h2>Course Progress</h2>
                <table>
                  <tbody>
                    {data.courses.map((course, index) => {
                      return (
                        <tr key={index}>
                          <td>{course.name}</td>
                          <td>{course.grade}/10</td>
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
