# git提交文章时自动同步issue(二)

[ pixiv: 520]: # 'http://pz1pbod1j.bkt.clouddn.com/XXXX.jpg'

此文通过对git命令进5555555行。

### 实现
```js
const chalk = require('chalk')
const symbols = require('log-symbols')
const spawn = require('child_process').spawn

// 检查改动的文件目录
getDiffFiles().then(files => {
  const filePaths = files.map(file => file.filename.split('/')[0])
  let isDistFolder = false
  let isOtherFiles = false
  filePaths.forEach(path => {
    if (path === 'dist') isDistFolder = true
    else isOtherFiles = true
  })
  if (isDistFolder && isOtherFiles) {
    throw new Error()
  }
  
}).catch(() => {
  /* eslint-disable */
  console.error(`\n\n${symbols.error} ${chalk.redBright('Ops！Dist folder and other files cannot be submitted at the same time.')}`)
  console.log(`    (use "git reset" to cancel the "add" operation)\n`)
  /* eslint-enable */
  process.exit(1)
})


// 获取本次改动的文件列表
function getDiffFiles() {
  return getHeadCommitId().then(head => {
    if (head) {
      // core.quotepath=false 解决中文乱码
      // --name-status 只展示名字和状态
      // --diff-filter=ACM 过滤，展示Add、Copy、Modify类型的文件
      const command = 'git -c core.quotepath=false show '+ head + ' --stat --name-status -M --diff-filter=ACM'
      // const command = 'git -c core.quotepath=false diff-index --cached --name-status -M --diff-filter=ACM ' + head
      return runCmd(command).then(({ err, stdout, stderr }) => {
        return err || stderr ? err || new Error(stderr) : stdoutToResultsObject(stdout)
      })
    }
  })
}

// 获取最近一次提交的commit_id
function getHeadCommitId() {
  return runCmd('git rev-parse --verify HEAD').then(({ err, stdout, stderr }) => {
    console.log(stdout)
    if (err && err.message.indexOf('fatal: Needed a single revision') !== -1) {
      return getFirstCommitId()
    } else {
      return err || stderr ? err || new Error('STDERR: ' + stderr) : stdout.replace('\n', '')
    }
  })
}

// 获取第一次提交的commit_id
function getFirstCommitId() {
  return runCmd('git hash-object -t tree /dev/null').then(({ err, stdout, stderr }) => {
    return err || stderr ? err || new Error('STDERR: ' + stderr) : stdout.replace('\n', '')
  })
}


// 执行命令，监听控制台信息
function runCmd(command) {
  return new Promise((resolve) => {
    // 解析命令获取参数
    const bits = command.split(' ')
    const args = bits.slice(1)
    
    // 执行命令
    const cmd = spawn(bits[0], args, { cwd: process.cwd() })
    
    let stdout = ''
    let stderr = ''
    
    cmd.stdout.on('data', data => {
      stdout += data.toString()
    })
    
    cmd.stderr.on('data', data => {
      stderr += data.toString()
    })
    
    cmd.on('close', code => {
      const err = code !== 0 ? new Error(stderr) : null
      resolve({ err, stdout, stderr })
    })
  })
}

// 把stdout输出信息转化成Object对象
function stdoutToResultsObject(stdout) {
  const results = []
  // 截取后面部分文件列表
  const _stdout = stdout.substring(stdout.lastIndexOf('\n\n'))
  const lines = _stdout.split('\n')
  let iLines = lines.length
  while (iLines--) {
    const line = lines[iLines]
    if (line !== '') {
      const parts = line.split('\t')
      const result = {
        filename: parts[2] || parts[1],
        status: codeToStatus(parts[0]),
      }
      results.push(result)
    }
  }
  return results
}

// git 枚举映射
function codeToStatus(code) {
  const map = {
    A: 'Added',
    C: 'Copied',
    D: 'Deleted',
    M: 'Modified',
    R: 'Renamed',
    T: 'Type-Change',
    U: 'Unmerged',
    X: 'Unknown',
    B: 'Broken',
  }
  return map[code.charAt(0)]
}

```
