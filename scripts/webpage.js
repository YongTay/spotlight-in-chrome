
import { spawn } from 'child_process'
import * as path from 'path'

const res = spawn('npm',['run', 'build'], {cwd: path.resolve('packages/webpage') })
res.stderr.on('data', data => {
  console.error(data.toString())
})

res.stdout.on('data', data => {
  console.log(data.toString())
})

res.on('close', () => {})
