<h1 align="center">
  <img src="https://github.com/Gapur/react-native-twilio-chat/blob/master/assets/logo.png" />
  <br/>
  React-Three-Fiber
</h1>

Build a Power 3D Animation on React

Quickly get started with a react-three-fiber

Today I want to talk about 3D Animation in JavaScript development. Is it possible 3D graphics in the web browser? How we can achieve that? If you are interested, let’s dig in together.

## Base Concepts

# WebGL
WebGL(Web Graphics Library) is a cross-platform, free JavaScript API for creating 3D graphics in a web browser without plugins. When you work with WebGL, we have to describe each point, line, face, and so on. It is like a low-level system.

Three.js
Three.js is a cross-browser JavaScript library used to create and display animated 3D computer graphics with components in a web browser using WebGL. Therefore, Three.js speed up the development process with graphics. Three.js has three main things as a name:
scene — the place where all the action will happen;
camera — captures and displays all objects on the scene;
renderer — shows scene captured by the camera.

React-three-fiber
react-three-fiber is a React renderer for three.js on the react and react-native apps. You can build reusable react components with own state, hooks, and props to the corresponding three.js primitives. All objects in three.js will work very well without exception and additional overhead.


## Setting up the Project

Now, I will create a react-space project about space with react-three-fiber basic components.

First, I am going to use create-react-app to create quick single-page React application. We can set up a modern web app by running a single command:
npx create-react-app react-space

After that, move it into the react-space directory and run it from the terminal:
```sh
cd react-space
npm start
```
Great, we’ve successfully created our React app.

## Making Magic Code

First, you should install react-three-fiber. It is easy and takes a single command:
```sh
npm install three react-three-fiber
```

Next, I will create the Stars component for simulations group of stars in space.
```js
const STAR_COUNT = 2000

export function Stars() {
  let group = useRef()
  let theta = 0
  useFrame(() => {
    const rotation = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    const scale = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(rotation, rotation, rotation)
    group.current.scale.set(scale, scale, scale)
  })

  const [geometry, material, coordinates] = useMemo(() => {
    const geometry = new THREE.SphereBufferGeometry(1, 10, 10)
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
    const coordinates = new Array(STAR_COUNT).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    return [geometry, material, coordinates]
  }, [])

  return (
    <group ref={group}>
      {coordinates.map(([p1, p2, p3], idx) => (
        <mesh key={idx} geometry={geometry} material={material} position={[p1, p2, p3]} />
      ))}
    </group>
  )
}
```

Above, I generated star coordinates, geometry and material. Mesh is a base component we place into the scene. Geometry allows us to assign various shapes to mesh(cube, pyramid and etc).
```js
const geometry = new THREE.SphereBufferGeometry(1, 10, 10)
```

Material allows us to use different materials for mesh. For example, we used SphereBufferGeometry and MeshBasicMaterial.
```js
const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
```

Also, I used useFrame for updating star rotation and scale on every frame rendered. useFrame allows us to execute code on every frame rendered, like running effects, updating controls, and so on.

Now, I am going to create main Box component.

```js
import React, { useRef, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import create from 'zustand'

const BOX_COUNT = 120

const boxIds = new Array(BOX_COUNT).fill().map((_, idx) => idx)
const boxIdsCoordinates = boxIds.reduce((acc, id) => ({ ...acc, [id]: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] }), 0)

export const useStore = create(set => ({
  boxes: boxIds,
  coordinates: boxIdsCoordinates,
  mutate: () => {
    set(state => {
      const coordinates = {}
      for (let i = 0; i < state.boxes.length; i++) {
        const id = state.boxes[i]
        const [x, y, z] = state.coordinates[id]
        coordinates[id] = [x + 0.01, y + 0.01, z + 0.01]
      }
      return { ...state, coordinates }
    })
  }
}))

export function Box({ id }) {
  const mesh = useRef()
  const coordinates = useRef([0, 0, 0])
  useEffect(() => useStore.subscribe(xyz => (coordinates.current = xyz), state => state.coordinates[id]))
  useFrame(() => mesh.current && mesh.current.rotation.set(...coordinates.current))
  return (
    <mesh ref={mesh}>
      <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}
```

I used boxBufferGeometry component to draw line and point geometry.
```js
<boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
```

It is a great Three.js component with vertex positions, face indices, normals, colors, UVs, and custom attributes.
```js
<meshNormalMaterial attach="material" />
```

The meshNormalMaterial is a material that maps the normal vectors to RGB colors.

Last but not least, I will implement App component to our project:
```js
function App() {
  const [boxes, mutate] = useStore(state => [state.boxes, state.mutate], shallow)

  useEffect(() => {
    function animate() {
      mutate()
      requestAnimationFrame(animate)
    }
    animate()
  }, [mutate])

  return (
    <Canvas>
      {boxes.map(id => <Box key={id} id={id} />)}
      <Stars />
    </Canvas>
  )
}
```

Above, I used requestAnimationFrame for animating Box component. This method performs an animation and requests that the browser calls a specified function to update an animation before the next repaint.

Last, We displayed our 3D scene on the browser with Canvas.

## Let’s Demo Our React Space App 

<p align="center">
  <img width="600"src="https://github.com/Gapur/react-native-twilio-chat/blob/master/assets/example.gif">
</p>

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!