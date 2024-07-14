import { useEffect, useState } from 'react'
import './App.css'
import { Stage, Layer, Rect, Circle, Line, Group } from 'react-konva'
import { Vector2d } from 'konva/lib/types'

const width = window.innerWidth
const height = window.innerHeight

// Create a starting point with 10 nodess all in the centre of the window
type nodes = {
  id: number
  x: number
  y: number
  width: number
  height: number
  moving: boolean
  direction: Vector2d
  speed: number
}

type Connection = {
  from: number
  to: number
}

const initialState: nodes[] = [] 
for(let n=0;n<10;n++){
  initialState.push({
    id: n,
    x: width/2,
    y: height/2,
    moving:false,
    speed:0,
    direction:{x:0,y:0},
    width:50, 
    height: 50
  })  
}

const initialConnections = initialState.map(n => n.id > 0 ? {from:0, to: n.id}: null)

function App() {
  const [nodes, setNodes] = useState(initialState)
  const [conections, setConnections] = useState(initialConnections)
  const [settled, setSettled] = useState(false)

  function updatePositions(){

  }

  useEffect(() => {
    if (settled) return
    updatePositions()
  })

  return (
    <>
      <Stage width={width} height={height}>
      <Layer>
        {
          // Draw the connections first in one layer and the nodess in the layer above
          conections.map(c => 
            c &&
            <Line
              points={[nodes[c.from].x,nodes[c.from].y,nodes[c.to].x,nodes[c.to].x]}
              stroke={'black'}
              width={2}
              />
          )
        }
        </Layer>
        <Layer>{
          nodes.map(n =>
            <Group
              x={n.x}
              y={n.y}
              >
                <Rect width={n.width} height={n.height} fill={'red'}/>
              </Group>
          )
        }
      </Layer>
    </Stage>
    </>
  )
}

export default App
