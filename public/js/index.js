const lerp = (x, min, max) => x * (max - min) + min

const makeGrid = (width, height) => {
   const grid = []

   for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
         grid.push({
            x: lerp(x / (width - 1), -1, 1),
            y: lerp(y / (height - 1), -1, 1),
            u: 2 / (width - 1),
            v: 2 / (height - 1),
            h: Math.random(),
            s: Math.random(),
            l: Math.random(),
         })
      }
   }

   return grid
}

const Mh = new THREE.Matrix4()
// prettier-ignore
Mh.set(
   2, -2, 1, 1,
   -3, 3, -2, -1,
   0, 0, 1, 0,
   1, 0, 0, 0
);

const MhT = Mh.clone().transpose()

const dividePoint = (u, v, x, y, h, s, l) => {
   const vp = new THREE.Vector4(v * v * v, v * v, v, 1)

   const xp = vp.dot(
      new THREE.Vector4(u * u * u, u * u, u, 1).applyMatrix4(
         x.clone().transpose().premultiply(Mh).multiply(MhT)
      )
   )

   const yp = vp.dot(
      new THREE.Vector4(u * u * u, u * u, u, 1).applyMatrix4(
         y.clone().transpose().premultiply(Mh).multiply(MhT)
      )
   )

   const hp = vp.dot(
      new THREE.Vector4(u * u * u, u * u, u, 1).applyMatrix4(
         h.clone().transpose().premultiply(Mh).multiply(MhT)
      )
   )

   const sp = vp.dot(
      new THREE.Vector4(u * u * u, u * u, u, 1).applyMatrix4(
         s.clone().transpose().premultiply(Mh).multiply(MhT)
      )
   )

   const lp = vp.dot(
      new THREE.Vector4(u * u * u, u * u, u, 1).applyMatrix4(
         l.clone().transpose().premultiply(Mh).multiply(MhT)
      )
   )

   return {
      vertex: [xp, yp, 0],
      color: new THREE.Color().setHSL(hp, sp, lp).toArray(),
   }
}

const divideGrid = (grid, divisions) => {
   const newGrid = []

   for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
         const p00 = grid[y * height + x]
         const p01 = grid[(y + 1) * height + x]
         const p10 = grid[y * height + x + 1]
         const p11 = grid[(y + 1) * height + x + 1]

         const xp = new THREE.Matrix4()
         // prettier-ignore
         xp.set(
            p00.x, p01.x, p00.v, p01.v,
            p10.x, p11.x, p10.v, p11.v,
            p00.u, p01.u, 0, 0,
            p10.u, p11.u, 0, 0
         )

         const yp = new THREE.Matrix4()
         // prettier-ignore
         yp.set(
            p00.y, p01.y, p00.v, p01.v,
            p10.y, p11.y, p10.v, p11.v,
            p00.u, p01.u, 0, 0,
            p10.u, p11.u, 0, 0
         )

         const hp = new THREE.Matrix4()
         // prettier-ignore
         hp.set(
            p00.h, p01.h, 0, 0,
            p10.h, p11.h, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
         )

         const sp = new THREE.Matrix4()
         // prettier-ignore
         sp.set(
            p00.s, p01.s, 0, 0,
            p10.s, p11.s, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
         )

         const lp = new THREE.Matrix4()
         // prettier-ignore
         lp.set(
            p00.l, p01.l, 0, 0,
            p10.l, p11.l, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
         )

         for (let u = 0; u < divisions; u++) {
            for (let v = 0; v < divisions; v++) {
               newGrid[
                  (y * divisions + v) * dividedHeight + (x * divisions + u)
               ] = dividePoint(
                  u / (divisions - 1),
                  v / (divisions - 1),
                  xp,
                  yp,
                  hp,
                  sp,
                  lp
               )
            }
         }
      }
   }

   return newGrid
}

const updateGeometry = (geometry, grid) => {
   const vertices = []
   const colors = []

   for (let y = 0; y < dividedHeight - 1; y++) {
      for (let x = 0; x < dividedWidth - 1; x++) {
         vertices.push(...grid[y * dividedHeight + x].vertex)
         colors.push(...grid[y * dividedHeight + x].color)

         vertices.push(...grid[y * dividedHeight + x + 1].vertex)
         colors.push(...grid[y * dividedHeight + x + 1].color)

         vertices.push(...grid[(y + 1) * dividedHeight + x + 1].vertex)
         colors.push(...grid[(y + 1) * dividedHeight + x + 1].color)

         vertices.push(...grid[(y + 1) * dividedHeight + x + 1].vertex)
         colors.push(...grid[(y + 1) * dividedHeight + x + 1].color)

         vertices.push(...grid[(y + 1) * dividedHeight + x].vertex)
         colors.push(...grid[(y + 1) * dividedHeight + x].color)

         vertices.push(...grid[y * dividedHeight + x].vertex)
         colors.push(...grid[y * dividedHeight + x].color)
      }
   }

   geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
   )
   geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(colors), 3)
   )
}

const width = 3
const height = 3
const divisions = 10
const dividedWidth = (width - 1) * divisions
const dividedHeight = (height - 1) * divisions
const grid = makeGrid(width, height)

const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({
   canvas: document.getElementById("canvas"),
   alpha: true,
})
renderer.setSize(window.innerWidth + 400, window.innerHeight + 400)
renderer.setScissor(200, 200, window.innerWidth, window.innerHeight)
renderer.setScissorTest(true)
const geometry = new THREE.BufferGeometry()
const material = new THREE.MeshBasicMaterial({
   color: 0xffffff,
   vertexColors: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const render = () => {
   updateGeometry(geometry, divideGrid(grid, divisions))
   renderer.render(scene, camera)
}

render()
