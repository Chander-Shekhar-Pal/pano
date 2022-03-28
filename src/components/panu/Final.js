import { useState, useRef } from "react";
import { Pannellum } from "pannellum-react";
import scenesArray from "./scenesArray";
import thumb from "./thumb.jpg";
function Final() {
  const numeric = window.numeric;
  const [currentScene, setCurrentScene] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  var c_width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var c_height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  const handleMouseUp = (e) => {
    
    setPitch(panImage.current.getViewer().mouseEventToCoords(e)[0]);
    setYaw(panImage.current.getViewer().mouseEventToCoords(e)[1]);

    const originalPos = [];
    const targetPos = [];
    Array.from(
      document.querySelectorAll(`.embedScenePos[data-id="b"]`)
    ).forEach((element) => {
      var getPos = element.getBoundingClientRect();
      targetPos.push([getPos.left, getPos.top]);
      var left = element.getAttribute("left");
      var top = element.getAttribute("top");
      originalPos.push([left, top]);

      //   console.log(element);
    });
    console.log(originalPos);
    console.log(targetPos);
    if (
      targetPos[0][0] <= c_width * 1.5 &&
      targetPos[2][0] >= -c_width * 0.5 &&
      targetPos[0][1] <= c_height * 1.5 &&
      targetPos[1][1] >= -c_height * 0.5
    ) {
      console.log("if");
      applyTransform(document.getElementById("b"), originalPos, targetPos);
    }

    // console.log(targetPos, "targetPos");
    // console.log(originalPos, "originalPos");
    //end
  };

  const panImage = useRef(null);
  const hotspotIcon = (hotSpotDiv, item) => {
    switch (item.type) {
      case "embedScene":
        return embedHotspot(hotSpotDiv, item);
      case "embedScenePos":
        return handleEmbedScenePos(hotSpotDiv, item);
      default:
        return hotSpotDiv.classList.add("d-none");
    }
  };
  const embedHotspot = (hotSpotDiv, item) => {
    const image = document.createElement("img");
    image.classList.add("image");
    image.setAttribute("src", thumb);
    image.setAttribute("style", `width:150px;height:84px;`);
    hotSpotDiv.setAttribute("id", item.id);
    hotSpotDiv.setAttribute("data-embed", true);
    hotSpotDiv.setAttribute("data-initialized", false);
    hotSpotDiv.append(image);
  };
  const handleEmbedScenePos = (hotSpotDiv, item) => {
    hotSpotDiv.classList.add("embedScenePos");
    hotSpotDiv.setAttribute("id", item.id);
    hotSpotDiv.setAttribute("data-id", item.embedSceneId);
  };

  const handleOnLoad = () => {
    initEmbed(".embedScene");
  };
  const initEmbed = (selector) => {
    document.querySelectorAll(selector).forEach((item) => {
      var dataInit = item.getAttribute("data-initialized");
      if (dataInit === "false") {
        item.setAttribute("data-initialized", true);
      }

      var firstChild = item.firstChild;
      var replaceDiv = document.createElement("div");
      replaceDiv.classList.add("pnlm-hotspot-base");
      // replaceDiv.classList.add("embedInScene");
      replaceDiv.setAttribute("id", item.id);
      replaceDiv.setAttribute(
        "style",
        `transform-origin:0px 0px;visibility:visible; transform: ${item.style.transform}`
      );
      replaceDiv.appendChild(firstChild);
      item.replaceWith(replaceDiv);

      Array.from(
        document.querySelectorAll(`.embedScenePos[data-id=${item.id}]`)
      ).forEach((element) => {
        var getPos = element.getBoundingClientRect();
        element.setAttribute("left", getPos.left);
        element.setAttribute("top", getPos.top);
      });
    });
  };

  const applyTransform = (element, originalPos, targetPos) => {
    // console.log(element);
    // console.log(originalPos);
    // console.log(targetPos);

    var H, from, i, j, p, to;

    from = (function () {
      var k, len, results;
      results = [];
      for (k = 0, len = originalPos.length; k < len; k++) {
        p = originalPos[k];
        results.push({
          x: p[0] - originalPos[0][0],
          y: p[1] - originalPos[0][1],
        });
      }
      return results;
    })();
    to = (function () {
      var k, len, results;
      results = [];
      for (k = 0, len = targetPos.length; k < len; k++) {
        p = targetPos[k];
        results.push({
          x: p[0] - originalPos[0][0],
          y: p[1] - originalPos[0][1],
        });
      }
      return results;
    })();
    // Solve for the transform
    H = getTransform(from, to);

    element.setAttribute(
      "style",
      `
      z-index: 1;
      visibility: visible;
      transform: matrix3d(${(function () {
        var k, results;

        results = [];
        for (i = k = 0; k < 4; i = ++k) {
          results.push(
            (function () {
              var l, results1;
              results1 = [];
              for (j = l = 0; l < 4; j = ++l) {
                results1.push(H[j][i].toFixed(20));
              }

              return results1;
            })()
          );
        }
        return results;
      })().join(",")});
      transform-origin:0px 0px;`
    );
  };

  const getTransform = (from, to) => {
    var A, H, b, h, i, k, k_i, l, lhs, m, ref, rhs;
    console.assert(from.length === (ref = to.length) && ref === 4);
    A = []; // 8x8
    for (i = k = 0; k < 4; i = ++k) {
      A.push([
        from[i].x,
        from[i].y,
        1,
        0,
        0,
        0,
        -from[i].x * to[i].x,
        -from[i].y * to[i].x,
      ]);
      A.push([
        0,
        0,
        0,
        from[i].x,
        from[i].y,
        1,
        -from[i].x * to[i].y,
        -from[i].y * to[i].y,
      ]);
    }
    b = []; // 8x1
    for (i = l = 0; l < 4; i = ++l) {
      b.push(to[i].x);
      b.push(to[i].y);
    }
    // Solve A * h = b for h
    h = numeric.solve(A, b);
    H = [
      [h[0], h[1], 0, h[2]],
      [h[3], h[4], 0, h[5]],
      [0, 0, 1, 0],
      [h[6], h[7], 0, 1],
    ];
    // Sanity check that H actually maps `from` to `to`
    for (i = m = 0; m < 4; i = ++m) {
      lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1]);
      k_i = lhs[3];
      rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1]);
      console.assert(
        numeric.norm2(numeric.sub(lhs, rhs)) < 1e-9,
        "Not equal:",
        lhs,
        rhs
      );
    }
    console.log(H);
    return H;
  };

  return (
    <>
      <div className="w-100 vh-100">
        <Pannellum
          ref={panImage}
          width="100%"
          height="100%"
          image={scenesArray[currentScene].scenePanoImg + "?resize=800%2C600"}
          pitch={0}
          yaw={10}
          hfov={150}
          autoLoad
          showZoomCtrl={false}
          onMouseup={(e) => handleMouseUp(e)}
          onLoad={handleOnLoad}
        >
          {scenesArray[currentScene].hotSpotsArr.map((hotSpot) => {
            return (
              <Pannellum.Hotspot
                key={hotSpot.id}
                type="custom"
                pitch={hotSpot.pitch}
                yaw={hotSpot.yaw}
                tooltip={hotspotIcon}
                tooltipArg={hotSpot}
                cssClass={hotSpot.type}
                handleClick={
                  (evt, name) => console.log(evt)
                  //setCurrentScene(hotSpot.transition)
                }
                name="image info"
              />
            );
          })}
        </Pannellum>
      </div>
    </>
  );
}

export default Final;
