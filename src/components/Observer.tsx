import { useEffect } from "react";

export default function Observer() {
  useEffect(() => {
    // 获取 Canvas 元素
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    // 绘制矩形图形
    ctx.beginPath();
    ctx.rect(50, 50, 200, 100);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // 鼠标点击事件处理函数
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect(); // 获取 Canvas 相对于视口的位置
      const mouseX = event.clientX - rect.left; // 计算鼠标点击的相对坐标
      const mouseY = event.clientY - rect.top;

      // ctx.beginPath();
      // ctx.rect(50, 50, 200, 100);
      // ctx.closePath();

      if (ctx.isPointInPath(mouseX, mouseY)) {
        console.log("点击在矩形上");
      } else {
        console.log("点击不在矩形上");
      }
    });

    let isDrawing = false;
    let startX, startY;

    // canvas.addEventListener("mousedown", startDrawing);
    // canvas.addEventListener("mouseup", endDrawing);
    // canvas.addEventListener("mousemove", draw);

    function startDrawing(event) {
      isDrawing = true;
      startX = event.clientX - canvas.offsetLeft;
      startY = event.clientY - canvas.offsetTop;
    }

    function endDrawing() {
      isDrawing = false;
    }

    function draw() {
      const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      if (canvas.getContext) {
        const ctx = canvas.getContext("2d")!;

        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
        ctx.moveTo(110, 75);
        ctx.arc(75, 75, 35, 0, Math.PI, false); // 口 (顺时针)
        ctx.moveTo(65, 65);
        ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // 左眼
        ctx.moveTo(95, 65);
        ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // 右眼
        ctx.stroke();
      }
    }

    draw();
  }, []);

  useEffect(() => {
    const obj = { name: 1 };
    const objProxy = new Proxy(obj, {
      has(target, key) {
        console.log(77, key);
        return key in target;
      },
    });

    console.log(Reflect.has(objProxy, "name"));
  }, []);
  return <canvas id="myCanvas" width="400" height="300"></canvas>;
}
