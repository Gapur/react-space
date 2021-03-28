import './App.css';
import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import create from 'zustand'
import * as THREE from 'three'

const numberOfItems = 200
const ids = new Array(numberOfItems).fill().map((_, i) => i)

const [useStore, api] = create(set => ({
  boxes: ids,
  coords: ids.reduce(
    (acc, id) => ({
      ...acc,
      [id]: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
    }),
    0
  ),
  turn: () => {
    set(state => {
      const coords = {}
      for (let i = 0; i < state.boxes.length; i++) {
        const id = state.boxes[i]
        const [x, y, z] = state.coords[id]
        coords[id] = [x + 0.01, y + 0.01, z + 0.01]
      }
      return { ...state, coords }
    })
  }
}))

function Box({ id }) {
  const mesh = useRef()
  const coords = useRef([0, 0, 0])
  useEffect(() => api.subscribe(xyz => (coords.current = xyz), state => state.coords[id]))
  useFrame(() => mesh.current && mesh.current.rotation.set(...coords.current))
  return (
    <mesh ref={mesh}>
      <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

function Stars() {
  let group = useRef()
  let theta = 0
  useFrame(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geo, mat, coords] = useMemo(() => {
    const geo = new THREE.SphereBufferGeometry(1, 10, 10)
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
    const coords = new Array(2000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    return [geo, mat, coords]
  }, [])
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  )
}

function App() {
  const boxes = useStore(state => state.boxes)

  useEffect(() => {
    function move() {
      api.getState().turn()
      requestAnimationFrame(move)
    }
    move()
  }, [])

  return (
    <Canvas>
      {boxes.map(id => (
        <Box key={id} id={id} />
      ))}
      <Stars />
    </Canvas>
  );
}

export default App;
