import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import shallow from 'zustand/shallow'

import { Box, useStore } from './Box'
import { Stars } from './Stars'

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
