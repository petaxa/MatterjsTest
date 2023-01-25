<template>
  <div id="app" ref="root"></div>
  <button @click="addElement">add Element</button>
</template>

<script setup>
import "pathseg";
import Matter from "matter-js";
import { onMounted, ref, watch } from 'vue';

const paths = [
  "M289.05,84.63L98.225,308.136c-6.35,7.44-9.126,17.291-7.594,26.954l10.514,66.144c1.32,8.312,8.484,14.441,16.901,14.44h66.971c9.785,0,19.079-4.283,25.434-11.725l206.015-241.29c5.93-6.943,5.104-17.379-1.841-23.305l-42.83-36.57c-6.946-5.928-17.38-5.104-23.31,1.837l-152.4,178.477c-3.312,3.872-1.941,7.557-0.754,15.562c0.647,4.358,4.409,7.572,8.817,7.528c8.201-0.082,11.959,0.677,15.254-3.186l104.745-122.653l30.031,25.641l-108.396,126.93c-5.823,6.821-14.307,10.795-23.272,10.904h-40.639c-10.349,0.124-19.191-6.943-20.691-17.18l-5.896-40.215c-1.304-8.875,1.292-17.878,7.118-24.697L321.757,75.111c18.261-21.39,50.409-23.929,71.803-5.664l50.576,43.18c21.395,18.265,23.932,50.414,5.666,71.806L235.457,435.479c-10.447,12.243-25.735,19.284-41.83,19.271h-89.321c-19.688-0.012-36.449-14.382-39.549-33.821l-14.072-88.213c-2.53-15.89,2.027-32.097,12.479-44.339L259.017,58.988L289.05,84.63z",
];

const isDrop = true

// Matter
const root = ref(null)
const Engine = Matter.Engine
const Render = Matter.Render
const Runner = Matter.Runner
const Common = Matter.Common
const MouseConstraint = Matter.MouseConstraint
const Mouse = Matter.Mouse
const World = Matter.World
const Vertices = Matter.Vertices
const Svg = Matter.Svg
const Bodies = Matter.Bodies
const Composite = Matter.Composite
// create engine
const engine = Engine.create()
const world = engine.world;
// create runner
const runner = Runner.create();
onMounted(() => {
  // カーソルを画像に置換する作戦
  root.value.style.cursor = 'url(vite.svg), auto'

  // create renderer
  const render = Render.create({
    element: root.value,
    engine: engine,
    options: {
      width: 2800,
      height: 1400,
      // pixelRatio: 'auto',
      wireframes: false,
      showDebug: false,
      showBroadphase: false,
      showBounds: false,
      showVelocity: false,
      showCollisions: false,
      showSeparations: false,
      showAxes: false,
      showPositions: false,
      showAngleIndicator: false,
      showIds: false,
      showShadows: false,
      showVertexNumbers: false,
      showConvexHulls: false,
      showInternalEdges: false,
      showMousePosition: false,
    },
  });
  Render.run(render);

  Runner.run(runner, engine);

  const color = Common.choose([
    "#556270",
    "#4ECDC4",
    "#C7F464",
    "#FF6B6B",
    "#C44D58",
  ]);

  // const vertexSets = []
  // paths.forEach((path, i) => {
  //   const newElement = document.createElementNS(
  //     "http://www.w3.org/2000/svg",
  //     "path"
  //   );
  //   newElement.setAttribute("d", path);

  //   const points = Svg.pathToVertices(newElement, 30);
  //   vertexSets.push(Vertices.scale(points, 0.4, 0.4));

  //   World.add(
  //     world,
  //     Bodies.fromVertices(
  //       1000,
  //       200 + i * 50,
  //       vertexSets,
  //       {
  //         render: {
  //           fillStyle: color,
  //           strokeStyle:'#FFFFFF',
  //           lineWidth: 1,
  //         },
  //       },
  //       true
  //     )
  //   );
  // });

  // 配列から自作
  // const vertexSets = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 },]
  // World.add(
  //   world,
  //   Bodies.fromVertices(
  //     1000,
  //     200,
  //     vertexSets,
  //     // {
  //     //   render: {
  //     //     fillStyle: color,
  //     //     strokeStyle: '#FFFFFF',
  //     //     lineWidth: 1,
  //     //   },
  //     // },
  //     true
  //   )
  // );

  World.add(world, [
    // Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(900, 600, 800, 50, { isStatic: true }),
    // Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    // Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ]);

  // add mouse control
  const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.02,
        render: {
          visible: false,
        },
      },
    });
  // World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  // Render.lookAt(render, {
  //   min: { x: 0, y: 0 },
  //   max: { x: 800, y: 600 },
  // });

  root.value.onmousedown = function (event) {
    // 範囲制限
    if (event.offsetY > 100 || !isDrop) return

    let mouse = Matter.Vector.create(event.offsetX, event.offsetY);
    let bodies = Composite.allBodies(engine.world);
    let picked = Matter.Query.point(bodies, mouse);


    // 自作オブジェクト
    const vertexSets = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 },{ x: 20, y: 40 }, { x: 100, y: 50 }, { x: 120, y: 100 },]
    World.add(
      world,
      Bodies.fromVertices(
        event.offsetX,
        event.offsetY,
        vertexSets,
        // {
        //   render: {
        //     fillStyle: color,
        //     strokeStyle: '#FFFFFF',
        //     lineWidth: 1,
        //   },
        // },
        true
      )
    );

    // if (picked.length == 0) {
    //   let box = Bodies.rectangle(event.offsetX, event.offsetY, 50, 50);
    //   World.add(engine.world, [box]);
    // }
    // else {
    // 存在するブロックをクリックすると消す
    //   for (let box of picked) {
    //     World.remove(engine.world, box);
    //   }
    // }
  };
})


// 追従
const mouseX = ref(null)
const mouseY = ref(null)

window.addEventListener('mousemove', (event) => {
  mouseX.value = event.x;
  mouseY.value = event.y;
});

watch((mouseX, mouseY), () => {
  // マウスの追従
  // const boxA = Bodies.circle(mouseX.value, mouseY.value, 10,{ isStatic: true });
  // Composite.add(engine.world, boxA)
  if (mouseY.value > 100) {
    root.value.style.cursor = 'not-allowed'
  } else {
    root.value.style.cursor = 'url(vite.svg), auto'
  }
})

const addElement = () => {
  const boxA = Bodies.rectangle(400, 200, 80, 80);
  Matter.Vertices.create([{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }], boxA)
  Composite.add(engine.world, boxA)
  // console.log('add')
}

</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  /* height: 200px; */
}
</style>