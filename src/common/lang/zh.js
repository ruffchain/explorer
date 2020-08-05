export default {
  locale: '中文',
  APP: {
    title: '本测试链的数据将不定期清空'
  },
  AppHeader: {
    placeHolder: '区块，交易，Token，账户',
    login: '登录',
    createAccount: '创建账户',
    viewAccount: '查看账户',
    logOut: '退出登录',
    wallet: '钱包'
  },
  AddressTxHistory: {
    txHash: '交易哈希',
    block: '所在区块',
    date: '时间',
    txContent: '交易内容',
    empty: '记录为空',
    occupy: ' '
  },
  AppFooter: {
    helpCenter: '帮助中心',
    earlyBird: '早鸟计划收益查询'
  },
  PageBreadcrumb: {
    homePage: '首页'
  },
  Address: {
    account: '账号详情',
    address: '账户地址:',
    name: '节点名称:',
    votes: '节点得票数:',
    ip: '节点IP:',
    location: '节点位置:',
    history: '交易历史'
  },
  Block: {
    title: '区块详情',
    blockNumber: '区块 #',
    blockTime: '出块时间:',
    blockNode: '出块节点:',
    blockHash: '区块 hash:',
    tx: '交易',
    originalData: '原始数据'
  },
  GetCandy: {
    getToken: '领取 Token',
    getSuccess: '领取成功 ，查看本次交易',
    getAlready: '你已经领取过token',
    getFail: '领取失败，请稍后重试'
  },
  Search: {
    title: '找不到结果,支持以下搜索:',
    number: '区块编号 ( 示例 : 123 )',
    block: '区块 ID ( 示例 : 长度为64的哈希字符串)',
    tx: '交易 ID ( 示例 : 长度为64的哈希字符串)',
    address: '地 址 ( 示例 : 长度为38的前缀为ruff的哈希字符串)',
    home: '返回首页'
  },
  Token: {
    title: 'Token详情',
    tokenName: 'Token名称:',
    tokenType: 'Token类型:',
    smart: '智能',
    system: '系统',
    normal: '普通',
    factor: '准备金率:',
    circulation: '初始发行量:',
    nonliquidity: '流通发行量:',
    supplyTotal: '发行总量:',
    reserve: '当前准备金量:',
    holding: '当前账户持有量:',
    precision: 'Token精度:',
    createTime: '创建时间:',
    createAccount: '创建账户:',
    holdingAccount: '持有账户',
    account: '账户',
    amount: '数量'
  },
  CreateAccount: {
    title: '创建账户',
    step1: '输入密码,此密码用于加密私钥，不作为生成私钥的种子。您需要使用此密码及私钥才能解锁钱包。',
    placeHolder: '请输入密码',
    downloadKeyStore: '下载KeyStore文件',
    savePrivateKey: '请保存好你的私钥:',
    getCandy: '点击领取 Token',
    getCandyOK: '领取成功 ，查看本次交易',
    getCandyAlready: '你已经领取过token',
    getCandyFail: '领取失败，请稍后重试',
    nextStep: '下一步',
    validatorErr: '密码最少为8位',
    copyPrivateKeyOk: '复制成功',
    copyPrivateKeyFail: '复制失败，请手动复制'
  },
  LoginAccount: {
    title: '登录账户',
    secret: '私钥',
    wrongSecret: '错误的秘钥',
    login: '登录',
    keyStoreFile: 'KeyStore 文件',
    chooseFile: '选择文件',
    inputKeyStore: '输入KeyStore密码',
    keyStoreWrong: 'KeyStore或者密码错误',
  },
  Wallet: {
    title: '钱包',
    addressAccount: '账户地址:',
    addressUnlogin: '未登陆钱包',
    history: '账户历史',
    transfer: '转账',
    create: '创建Token',
    exchange: '智能Token交易',
    vote: '投票',

  },
  ConfirmTx: {
    title: '确认交易内容',
    cancel: '取消',
    confirm: '确认'
  },
  CreateToken: {
    title1: '智能Token是以',
    title2: 'Token作为准备金发行的，支持Bancor协议流通兑换的Token',
    tokenName: 'Token名称',
    circulation: '发行总量',
    precision: 'Token精度',
    circulationTotal: '发行总量',
    circulationInit: '初始发行量',
    nonLiquidity: '流通发行量',
    priceInit: 'Token 初始定价',
    reserveInit: '初始准备金',
    reserveRatio: '准备金率',
    reservePlaceHolder: '0到1之间',
    initPrice: '初始价格',
    circulationDistr: '发行量分配',
    normalDistErr: '分配总量必须等于发行量',
    circulationDistrInit: '初始发行量分配',
    smartDistErr: '分配数量+锁定数量需等于初始发行量',
    account: '账户',
    distAmount: '分配数量',
    lockAmount: '锁定数量',
    unlockDate: '解锁日期',
    chooseDateTime: '选择日期时间',
    preBalancesAmount: '锁定数量',
    addPreBalance: '添加发行方',
    createToken: '创建Token',
    normal: '普通',
    smart: '智能'
  },
  TokenExchange: {
    title: '智能Token交易由Bancor算法自动执行，暂不支持账户之间直接交易。',
    tokenId: 'Token名称',
    infoTip: '最多可供购买',
    tokenAmount: 'Token数量',
    infoGetSysCount: '可获取',
    cost: '花费',
    infoGetTokenCount: '可获取',
    confirm: '开始交易'
  },
  TransferToken: {
    toAccount: '对方账户',
    tokenAmount: 'Token数量',
    confirm: '开始转账',
    confirmedOk: '成功，交易内容如下：',
    confirmedFail: '交易发送成功，但是在短时间内还没获取到交易成功执行的信息，请自行确认交易是否被链执行。交易内容如下：',
    resultCatch: '出错',
    validErr: '请先填写正确的 Token 名称',
    precisionErr: '精度最大为小数点后',
    precisionBit: '位',

    normal: '普通',
    smart: '智能'

  },
  Vote: {
    title: '投票规则',
    rule1: '投票权通过冻结',
    rule11: '获得，冻结1',
    rule12: '可得1投票权。',
    rule2: '每10分钟为一个有效投票周期。',
    rule3: '周期内可多次投票（每隔60秒可投一次），但仅最后一次投票生效。',
    rule4: '一次最多可投7个节点，每个节点都将获得全部票数。',
    rule5: '再次冻结',
    rule51: '后所得票数将自动追加给当前已投节点。',
    rule6: '冻结3天后可申请解冻。解冻后，相应已投票数将被自动撤销。',
    sectionTitle: '冻结/解冻',
    freeze: '冻结',
    unfreeze: '解冻',
    amount: '数量',
    confirm: '确认',
    freezeStatus: '当前冻结状况',
    freezeTime: '可解冻时间',
    status: '状态',
    dueTime: '时间未到，不可解冻',
    dueTimeYes: '可解冻',
    vote: '投票',
    chooseCandidate: '选择节点',
    choosePlaceHolder: '请选择',
    confirmVote: '确认投票',
    currentVote: '当前投票',
    voteTime: '投票时间:',
    voteNum: '投票数:',
    voteNodes: '所投节点',
    err1: '数字必须大于等于1',
    err2: '数字必须是整数',
    err3: '最多只能选择7个节点',
    sendOK: '成功，交易内容如下：',
    sendFail: '交易发送成功，但是在短时间内还没获取到交易成功执行的信息，请自行确认交易是否被链执行。交易内容如下：',
    failCatch: '出错'
  },
  BPList: {
    title: '超级节点列表',
    rank: '排名',
    name: '名称',
    address: '地址',
    votes: '得票数',
    working: '出块中',
  },
  Home: {
    block: '最新区块',
    irb: '不可逆区块',
    txAmount: '总交易数量',
    accountAmount: '总账户数量',
    irbNew: '最新不可逆区块',
    blockNum: '区块#',
    contain: '包含',
    transaction: '个交易',
    transactionNew: '最新交易',
    transactionNum: '交易#',
    sender: '发起方'
  },
  AddressToHex: {
    title: '地址转换工具',
    address: '地址',
    toHex: '转换为16进制(HEX)'
  },
  Transaction: {
    title: '交易详情',
    hash: '交易哈希:',
    time: '交易时间:',
    block: '所在区块:',
    sender: '发起方:',
    raw: '原始数据'
  }
}