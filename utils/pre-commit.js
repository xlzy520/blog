const chalk = require('chalk')
const symbols = require('log-symbols')
const spawn = require('child_process').spawn
const request = require('request')
const fs = require('fs')

const BASE_URL = 'https://api.github.com/'
const token = '61bc742e4ca2f84f'+'38b64a89b10475556965c4f3'

const main = () =>{
  getDiffFiles().then(files => {
    if (!files.length) {
      return false
    }
    files.forEach(mdFile=>{
      const article = getArticleFromFile(mdFile)
      if (mdFile.status === 'Added') {
        createNewIssue(article)
      } else if (['Modified', 'Renamed'].includes(mdFile.status)) {
        getIssueNumberByFileName(mdFile).then(number=>{
          if (number) {
            updateIssue(number, article)
          }
        })
      }
    })
  })
}

const logSuccess = (log) => {
  console.log(chalk.green(log))
}

const getIssueOptions = ({url, method='GET', body={}}) =>({
  url: BASE_URL + url,
  method: method,
  json:true,
  body: body,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
    "Authorization": `token ${token}`
  }
})

const requestGithubApi = (option)=>{
  return new Promise((resolve, reject) => {
    return request(getIssueOptions(option), (error, res, body)=>{
      if(error){
        console.log("error occurred: " + error);
        reject(error);
      }
      resolve(body)
    })
  })
}

const getIssueNumberByFileName = async (filename) => {
  filename = encodeURI(filename)
  const res = await requestGithubApi({
    url: `search/issues?q=${filename}+state:open+user:xlzy520+repo:blog`
  })
  const { total_count, items } = res
  if (total_count>0) {
    return items[0].number
  }
}

const updateIssue = async (issueNumber, article)=>{
  const res = await requestGithubApi({
    url: `repos/xlzy520/blog/issues/${issueNumber}`,
    method: 'patch',
    body: article
  })
  if (res&&res.number&&res.number>0) {
    logSuccess('更新issue成功')
    return true
  }
  return false
}

const createNewIssue = async (article)=>{
  const res = await requestGithubApi({
    url: `/repos/xlzy520/blog/issues`,
    method: 'post',
    body: article
  })
  if (res&&res.number&&res.number>0) {
    logSuccess('创建issue成功')
    return true
  }
  return false
}

// 获取本次改动的文件列表
function getDiffFiles() {
  return getHeadCommitId().then(head => {
    if (head) {
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
      if (result.filename.includes('.md')) {
        results.push(result)
      }
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

/**
 * 从文件中提取文章内容
 * @param file
 * @return Object
 */
function getArticleFromFile(file) {
  const article = fs.readFileSync(__dirname+'/'+file.filename).toString()
  const regex = /^#\s(.+)?\n\n*(.+)?\n\n/
  const coverRegex = /^\[(.+)\].*(http.*(?:jpg|jpeg|png|gif))/
  const result = regex.exec(article)
  let content = article.replace(/^#\s(.+)?\n\n/, '')  // 移除标题
  const cover = coverRegex.exec(result[2])
  if (!cover) {
    content = '[ pixiv: 520]: # \'http://pz1pbod1j.bkt.clouddn.com/XXXX.jpg\n\n\'' + content
  }
  return  {
    title: result[1],
    body: content
  }
}

main()
