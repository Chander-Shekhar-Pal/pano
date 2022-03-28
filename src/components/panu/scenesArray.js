import gate from "../../panoimg/gate.jpg";
var scenesArray = [
  {
    id: "1",
    sceneName: "smallRoom",
    scenePanoImg: gate,
    hotSpotsArr: [
      { id: "b", pitch: 0, yaw: 1078, type: "embedScene" },
      {
        id: "c",
        pitch: 17.356900821161585,
        yaw: -16.15050210086137,
        type: "embedScenePos",
        embedSceneId: "b",
      },
      {
        id: "d",
        pitch: 17.98072100329486,
        yaw: 12.091489331910793,
        type: "embedScenePos",
        embedSceneId: "b",
      },
      {
        id: "e",
        pitch: 2.9853216413102874,
        yaw: 11.549120109007331,
        type: "embedScenePos",
        embedSceneId: "b",
      },
      {
        id: "f",
        pitch: 2.7807469213054583,
        yaw: -15.698589784874624,
        type: "embedScenePos",
        embedSceneId: "b",
      },
    ],
  },
  {
    id: "2",
    sceneName: "smallRoom",
    scenePanoImg: gate,
    hotSpotsArr: [
      { id: "g", pitch: 0, yaw: 10, type: "embedScene" },
      {
        id: "h",
        pitch: 17.356900821161585,
        yaw: -16.15050210086137,
        type: "embedScenePos",
        embedSceneId: "g",
      },
      {
        id: "i",
        pitch: 17.98072100329486,
        yaw: 12.091489331910793,
        type: "embedScenePos",
        embedSceneId: "g",
      },
      {
        id: "j",
        pitch: 2.9853216413102874,
        yaw: 11.549120109007331,
        type: "embedScenePos",
        embedSceneId: "g",
      },
      {
        id: "k",
        pitch: 2.7807469213054583,
        yaw: -15.698589784874624,
        type: "embedScenePos",
        embedSceneId: "g",
      },
    ],
  },
];

export default scenesArray;
