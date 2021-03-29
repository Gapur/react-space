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