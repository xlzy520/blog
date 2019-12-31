module.exports = {
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'create', // 创建文章
        'update', // 更新文章
        'chore', // 杂项
        'docs', // readme
      ]
    ]
  }
}
