import { useEffect, useState } from 'react'
import './App.css'
import { Stage, Layer, Rect, Circle, Line, Group } from 'react-konva'
import { Vector2d } from 'konva/lib/types'

const width = window.innerWidth
const height = window.innerHeight

// Create a starting point with 10 nodess all in the centre of the window
type Node = {
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

const initialState: Node[] = [] 
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
    const new_nodes = nodes.map((n,i) =>{
      // if the node is touching another than there is a force acting, allow it to move apart until it is no longer influenced
      for(const index in nodes) {
        if (i != parseInt(index)){
          const node1 = nodes[index]
          if (isTouching(n, node1))
            break
        }
     }
     if (n.direction.x !== 0){
       n.x += n.direction.x
       n.direction.x -= 0.5
     }

     if (n.direction.y !== 0){
       n.x += n.direction.y
       n.direction.y -= 0.5
     }

     if (n.x >= width && n.direction.x > 0)
      n.direction.x = -1 * n.direction.x 

     if (n.y >= height)
      n.direction.y = -1 * n.direction.y 

     return n
     console.log(n);
     
    })
    setNodes(new_nodes)
  }

  function isTouching(node1:Node,node2:Node){
    const node1bb = {x:node1.x, y:node1.y, x1: node1.x+node1.width, y1:node1.height+node1.y}
    const node2bb = {x:node2.x, y:node2.y, x1: node2.x+node2.width, y1:node2.height+node2.y}
    if ((node1bb.x >= node2bb.x && node1bb.x <= node2bb.x1)
       ||(node1bb.x <= node2.x && node1bb.x1 >= node2.x)
      || (node1bb.x1 >= node2bb.x && node1bb.x1 <= node2bb.x1)){
      // Cbeck vertical and apply the force if so
      if((node1bb.y >= node2bb.y && node1bb.y <= node2bb.y1)
        ||(node1bb.y <= node2.y && node1bb.y1 >= node2.y)
       || (node1bb.y1 >= node2bb.y && node1bb.y1 <= node2bb.y1)){
        const xAmplitude = (node1.x < node2.x ? -2 : (node1.x == node2.x ?( Math.random() < .5 ? -2 : 2) : 2) )
        const yAmplitude = (node1.y < node2.y ? -2 : (node1.y == node2.y ?( Math.random() < .5 ? -2 : 2) : 2) )
        node1.direction = {x: xAmplitude, y: yAmplitude}
        return true
      }
    } 
    return false
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
