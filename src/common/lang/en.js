export default {
  locale: 'English',
  APP: {
    title: 'Test Chain data will be deleted occassionaly'
  },
  AppHeader: {
    placeHolder: 'Block, Tx, Token, Account',
    login: 'Login',
    createAccount: 'New',
    viewAccount: 'View',
    logOut: 'Logout',
    wallet: 'Wallet'
  },
  AddressTxHistory: {
    txHash: 'Tx Hash',
    block: 'Block',
    date: 'Date',
    txContent: 'Tx Content',
    empty: 'Empty Record',
    occupy: ' '
  },
  AppFooter: {
    helpCenter: 'Wiki',
    earlyBird: 'Early Birds Profits Query'
  },
  PageBreadcrumb: {
    homePage: 'Home'
  },
  Address: {
    account: 'Account',
    address: 'Address:',
    name: 'Name:',
    votes: 'Votes:',
    ip: 'IP:',
    location: 'Location:',
    history: 'History'
  },
  Block: {
    title: 'Block Info',
    blockNumber: 'Block #',
    blockTime: 'Mining Time:',
    blockNode: 'Mining Node:',
    blockHash: 'Block Hash:',
    tx: 'Tx',
    originalData: 'Raw Data'
  },
  GetCandy: {
    getToken: 'Get Token',
    getSuccess: 'Get Token succeed, check Transaction',
    getAlready: 'Already got token',
    getFail: 'Get Token failed, try again later.'
  },
  Search: {
    title: 'Result not found, only support below searches:',
    number: 'Block number ( For example : 123 )',
    block: 'Block ID ( For example : Hash string)',
    tx: 'Tx ID ( For example : Hash string with 64 byte length)',
    address: 'Address ( For example : Hash string with prefix "ruff")',
    home: 'Home Page'
  },
  Token: {
    title: 'Token Info',
    tokenName: 'Token Name:',
    tokenType: 'Token Type:',
    smart: 'Smart',
    system: 'System',
    normal: 'Normal',
    factor: 'Reserve Ratio:',
    circulation: 'Initial Circulation:',
    nonliquidity: 'Non Liquidity:',
    supplyTotal: 'Total Circulation:',
    reserve: 'Current reserve:',
    holding: 'Current Account Holding:',
    precision: 'Token Precision:',
    createTime: 'Creation Date:',
    createAccount: 'Original Account',
    holdingAccount: 'Holding Account',
    account: 'Account',
    amount: 'Amount'
  },
  CreateAccount: {
    title: 'Create Account',
    step1: 'Please input a password to encrypt the secret key. The password is not the seed for secret key. To unlock the wallet , password and secret key are needed at the same time.',
    placeHolder: 'Password Input',
    downloadKeyStore: 'Download KeyStore File',
    savePrivateKey: 'Please keep your secret key safe:',
    getCandy: 'Hit to get Token',
    getCandyOK: 'Get Candy OK, check the transaction',
    getCandyAlready: 'Token alreay got',
    getCandyFail: 'Getting Token failed，please try later',
    nextStep: 'Next',
    validatorErr: 'password length >= 8',
    copyPrivateKeyOk: 'Copy Succeed',
    copyPrivateKeyFail: 'Copy Failed, please save it by hand.'
  },
  LoginAccount: {
    title: 'Login Account',
    secret: 'Secret',
    wrongSecret: 'Wrong Secret',
    login: 'Login',
    keyStoreFile: 'KeyStore File',
    chooseFile: 'Choose File',
    inputKeyStore: 'Input KeyStore Password',
    keyStoreWrong: 'KeyStore or Password Wrong',
  },
  Wallet: {
    title: 'Wallet',
    addressAccount: 'Account Address:',
    addressUnlogin: 'Unlogin Wallet',
    history: 'History',
    transfer: 'Transfer',
    create: 'Create Token',
    exchange: 'Exchange Smart Token',
    vote: 'Vote',
    earnings: 'Earnings',
  },
  ConfirmTx: {
    title: 'Confirm Tx',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  CreateToken: {
    title1: 'SmartToken use ',
    title2: 'Token as reserve，Bancor protocol exchanges are supported',
    tokenName: 'Token',
    circulation: 'Circulation Amount',
    precision: 'Token Precision',
    circulationTotal: 'Total',
    circulationInit: 'Initial Circulation',
    nonLiquidity: 'Non Liquidity',
    priceInit: 'Token Initial Price',
    reserveInit: 'Initial Reserve',
    reserveRatio: 'Reserve Ratio',
    reservePlaceHolder: '0 to 1',
    initPrice: 'Initial Price',
    circulationDistr: 'Circulation quota',
    normalDistErr: 'Sum of quota must equal total circulation',
    circulationDistrInit: 'Inital circulation quota',
    smartDistErr: 'Quota Amount + Lock Amount must equal initial circulation amount',
    account: 'Account',
    distAmount: 'Quota Amount',
    lockAmount: 'Lock Amount',
    unlockDate: 'Unlock Date',
    chooseDateTime: 'Choose date&time',
    preBalancesAmount: 'Lock Amount',
    addPreBalance: 'Add Issuer',
    createToken: 'Create',
    normal: 'Normal ',
    smart: 'Smart ',
    lockErr: 'Date must be later than 30 minutes',
    sendOK: 'Succeed! Tx content:',
    sendFail: 'Tx has been sent successfully! But in a short time , confirmation is not received. Please check it on the chain manually. Tx content: ',
    err: 'Error ',
    create: ' Creation'
  },
  TokenExchange: {
    title: 'Exchange of Smart Token is handled by Bancor protocol automatically. No direct human intervention.',
    tokenId: 'Token Id',
    infoTip: 'Max Avaialble Amount',
    tokenAmount: 'Token Amount',
    infoGetSysCount: 'Available',
    cost: 'Cost',
    infoGetTokenCount: 'Available',
    confirm: 'Confirm',
    buy: 'Buy',
    sell: 'Sell',
    sendOK: 'Succeed! Tx content:',
    sendFail: 'Tx has been sent successfully! But in a short time , confirmation is not received. Please check it on the chain manually. Tx content: ',
    err: 'Error ',
    exchange: ' exchange'
  },
  TransferToken: {
    toAccount: 'To',
    tokenAmount: 'Amount',
    confirm: 'Transfer',
    confirmedOk: 'Succeed, Tx content:',
    confirmedFail: 'Sending Tx succeed. But confirmation is not received. Please wait:',
    resultCatch: 'Error ',
    validErr: 'Please make sure it is a valid token name',
    precisionErr: 'Maximum float precision is ',
    precisionBit: ' decimal points',
    normal: 'Normal ',
    smart: 'Smart ',
    transfer: ' Transfer'
  },
  Vote: {
    title: 'Rules of Voting',
    rule1: 'You can gain voting rights by freezing ',
    rule11: '. One ',
    rule12: ' give you one voting rights.',
    rule2: '10 minutes voting period',
    rule3: 'You can vote many times during the voting period, but only the last vote will take effect.',
    rule4: 'You can vote 7 nodes at a time, every node will get all your votes.',
    rule5: 'Freezing ',
    rule51: ' again, the votes will go to the voted nodes automatically',
    rule6: ' can be unfreezed after 72 hours。Then all votes will be canceled.',
    sectionTitle: 'freeze/unfreeze',
    freeze: 'freeze',
    unfreeze: 'unfreeze',
    amount: 'amount',
    confirm: 'Confirm',
    freezeStatus: 'Freezing Status',
    freezeTime: 'Unfreeze Date',
    status: 'Status',
    dueTime: 'Not due, can not be freezed',
    dueTimeYes: 'can be freezed',
    vote: 'vote ',
    chooseCandidate: 'Choose Nodes',
    choosePlaceHolder: 'Please choose:',
    confirmVote: 'Vote',
    currentVote: 'Current Votes',
    voteTime: 'Vote Time:',
    voteNum: 'Vote Number:',
    voteNodes: 'Nodes Voted',
    err1: 'Number should be >= 1',
    err2: 'Number should be an integer',
    err3: 'Choose 7 nodes at most',
    sendOK: 'Succeed! Details of the transaction:',
    sendFail: 'Transaction sent. But by now transaction execution info not received yet. Please check the chain for sure. Details of the transaction:',
    failCatch: 'Something\'s Wrong'
  },
  Earnings:{
    title: 'Earnings Description',
    description1: 'Deposit address',
    description2: 'The unit of RUFF lock-up mining is 1 million RUFF, and the lock-up share is 1 million Ruff as a unit, corresponding to a mining share of 5000 Usdt. Mining against the P3CRV pool labeled Pickle, the current annualized income is roughly 31.5% (specifically, actual There will be small fluctuations in income)',
    description3:'After the total mining volume reaches 50 million RUFF, mining will start on the specified date',
    description4:'Ruff lock-up mining for 90 days, after 90 days, users can withdraw Ruff and the corresponding Usdt and Ruff income',
    description5:'If the total amount of open locks exceeds 100 million, there will be a 10% bonus. When it reaches 150 million, the bonus rate is 15%, and when it reaches 200 million, the rate is 20%',
    description6:'Through lock-up mining, 50% of the pickle coins mined are used to reward lock-up users after being realized, 30% are used to buy back ruff on the market and then placed to lock-up customers, and 20% are used to cover gas fees, management fees and risk reserves',
    description7:'Before the event starts, Ruff will collect the lock-up mining whitelist within a week from now. Those on the whitelist will participate in the lock-up mining and receive an additional 1% Bonus. Fill in the white list and click this link to enter: http://RUFFCHAIN.mikecrm.com/4kX1Bft',
    usdtTitle: 'USDT Address',
    usdtEdit: 'Edit Address',
    usdtEarning: 'Total earning ',
    deposit: 'Total Deposit ',
    earningAmount: 'Amount',
    earningTime: 'Date',
    earningStatus: 'Status',
    depositAmount: 'Deposit Amount',
    
  },
  BPList: {
    title: 'Super Node List',
    rank: 'Rank',
    name: 'Name',
    address: 'Address',
    votes: 'Votes',
    working: 'Mining',
  },
  Home: {
    block: 'Latest Block',
    irb: 'IRB',
    txAmount: 'Total Tx',
    accountAmount: 'Total Account',
    irbNew: 'Latest IRB',
    blockNum: 'Block#',
    contain: 'contains ',
    transaction: 'Tx',
    transactionNew: 'Latest Tx',
    transactionNum: 'Tx #',
    sender: 'Sender'
  },
  AddressToHex: {
    title: 'Address Conversion Tool',
    address: 'Address',
    toHex: 'Convert to Hex',
    copySuccess: 'Copy Success',
    copyFail: 'Copy Failed. Please save it by hand'
  },
  Transaction: {
    title: 'Tx Detail',
    hash: 'Hash:',
    time: 'Time:',
    block: 'Block:',
    sender: 'Sender:',
    raw: 'Raw'
  },
  AppDialog: {
    info: 'Tx is in processing, but confirmation is not received by now. Please check the execution result later in Chain Browser.',
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    hint: 'Hint',
    question: 'Tx is still in processing, please check the execution result in Chain Browser.'

  }
}