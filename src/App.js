import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import create from 'zustand'
import shallow from 'zustand/shallow'
import * as THREE from 'three'

const BOX_COUNT = 200
const boxIds = new Array(BOX_COUNT).fill().map((_, i) => i)

const useStore = create(set => ({
  boxes: boxIds,
  coordinates: boxIds.reduce(
    (acc, id) => ({
      ...acc,
      [id]: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
    }),
    0
  ),
  turn: () => {
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

function Box({ id }) {
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

function Stars() {
  let group = useRef()
  let theta = 0
  useFrame(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.1)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
  })
  const [geometry, material, coordinates] = useMemo(() => {
    const geometry = new THREE.SphereBufferGeometry(1, 10, 10)
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
    const coordinates = new Array(2000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
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

function App() {
  const [boxes, turn] = useStore(state => [state.boxes, state.turn], shallow)

  useEffect(() => {
    function move() {
      turn()
      requestAnimationFrame(move)
    }
    move()
  }, [turn])

  return (
    <Canvas>
      {boxes.map(id => <Box key={id} id={id} />)}
      <Stars />
    </Canvas>
  )
}

export default App
