import { useEffect, useState } from 'react'
import './App.css'
import { Stage, Layer, Rect, Line, Group, Text } from 'react-konva'
import { Vector2d } from 'konva/lib/types'

const width = window.innerWidth/2
const height = window.innerHeight/2

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
for(let n=0;n<3;n++){
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
    let anymoving = false
    const new_nodes = nodes.map((n,i) =>{
      // if the node is touching another than there is a force acting, allow it to move apart until it is no longer influenced
      if (!anymoving && !n.moving){
        
        for(const index in nodes) {
          if (i != parseInt(index)){
            const node1 = nodes[index]
            if (isTouching(n, node1)){
              n.moving = true
              console.log(n.id);
              
              break
            }
          }
        }
          anymoving = n.moving
    }
    if (n.moving) {
      anymoving=true
        if (n.direction.x !== 0){
          console.log(`${n.id} x = ${n.x} direection: ${n.direction.x}`);
          
          n.x += n.direction.x
          console.log(`new ${n.id} x = ${n.x}`);
          const xneg = (n.direction.x < 0)
          n.direction.x = n.direction.x + (xneg ? 1:-1) 
        }

        if (n.direction.y !== 0){
          n.y += n.direction.y
          const yneg = (n.direction.y < 0)
          n.direction.y  = n.direction.y +(yneg?1:-1) 
        }

        if (n.direction.x === 0 && n.direction.y === 0)
          n.moving = false

        if ((n.x+n.width) >= width && n.direction.x > 0)
          n.direction.x = -20 

        else if (n.x <= 0 && n.direction.x < 0)
          n.direction.x = 20

        if ((n.y + n.height) >= height && n.direction.y > 0)
          n.direction.y = -20 
        else if (n.y <= 0 && n.direction.y < 0)
        n.direction.y = 20
      }
     return n
     
    })
    setSettled(!anymoving)
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
        const xAmplitude = (node1.x < node2.x ? -20 : (node1.x === node2.x ?( Math.random() < .5 ? -20 : 20) : 20) )
        const yAmplitude = (node1.y < node2.y ? -20 : (node1.y === node2.y ?( Math.random() < .5 ? -20 : 20) : 20) )
        node1.direction = {x: xAmplitude, y: yAmplitude}
        console.log(yAmplitude);
        
        return true
      }
    } 
    return false
  }

  useEffect(() => {
    if (settled)
      return
    updatePositions()
  })

  return (
    <><button onClick={() => updatePositions()}>Move</button>
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
              draggable
              >
                <Rect width={n.width} height={n.height} fill={n.moving ? 'red' : 'green'}/>
                <Text text={`${n.direction.x} - ${n.direction.y}`}/>
             </Group>
          )
        }
      </Layer>
    </Stage>
    </>
  )
}

export default App
