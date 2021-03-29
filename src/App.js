import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import shallow from 'zustand/shallow'

import { Box, useStore } from './Box'
import { Stars } from './Stars'

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

export default App
