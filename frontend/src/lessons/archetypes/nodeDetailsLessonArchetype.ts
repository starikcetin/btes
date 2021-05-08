import { LessonArchetype } from '../framework/LessonArchetype';

export const nodeDetailsLessonArchetype: LessonArchetype = {
  lessonUid: 'nodeDetails',
  displayName: 'Node Details Modal',
  summary:
    'This lesson will explain the all of the tabs in the node details modal and their purposes.',
  steps: [
    {
      type: 'modal',
      title: 'Node Details Modal',
      body: `Welcome to your second lesson. This lesson will take you through all the tabs in the details modal of a node, and explain the purpose of all of them one by one.`,
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: '',
      body: `Let's get started. Create two nodes. Double click on one of them to open the node details modal.`,
    },

    // summary
    {
      type: 'popup',
      target: '.comp-node-modal--tab-content',
      title: 'Summary Tab',
      body: `The first tab, which comes open by default is the Summary tab. It displays a limited amount of fundamental information about this node on a quick glance.`,
    },

    // network
    {
      type: 'popup',
      target: '.comp-node-modal--network-tab-handle',
      title: 'Network Tab',
      body: `Click on "Network" to switch to the Network tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-modal--tab-content',
      title: 'Network Tab',
      body: `The Network tab is about the connections between this node and other nodes.`,
    },

    // mails
    {
      type: 'popup',
      target: '.comp-node-modal--mails-tab-handle',
      title: 'Mails Tab',
      body: `Click on "Mails" to switch to the Mails tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-modal--tab-content',
      title: 'Mails Tab',
      body: `The Mails tab is actually not about blockchain at all. It is a simple system that you can use to send text mails between nodes. You can use it as a testing ground to see how the connections and their latencies behave, before delving into the blockchain.`,
    },

    // log
    {
      type: 'popup',
      target: '.comp-node-modal--log-tab-handle',
      title: 'Log Tab',
      body: `Click on "Log" to switch to the Log tab. We will cover the Blockchain tab last.`,
    },
    {
      type: 'popup',
      target: '.comp-node-modal--tab-content',
      title: 'Log Tab',
      body: `The Log tab shows you a log of events that concerns this node. You can look at the logs to understand what actually happens behind the scenes in the simulation. You can also see a global log by right clicking the simulation board and selecting "Show Logs".`,
    },

    // blockchain
    {
      type: 'popup',
      target: '.comp-node-modal--blockchain-tab-handle',
      title: 'Blockchain Tab',
      body: `And finally, click on "Blockchain" to switch to the Blockchain tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-modal--tab-content',
      title: 'Blockchain Tab',
      body: `This is the Blockchain tab, where most of the magic of this platform happens. Blockchain tab has a tabbed view of its own, as you can see on the left-hand side. Let's go over those tabs one-by-one as well. We will not go into too much detail about the blockchain right now, as they will be explained in the future lessons.`,
    },

    // blockchain > overview
    {
      type: 'popup',
      target: '.comp-node-blockchain-dashboard--tab-content-container',
      title: 'Blockchain > Overview',
      body: `This is the Overview tab of, which comes open by default when you switch to the Blockchain tab. Just like the Summary tab, its purpose is to provide a quick glance into the state of this node's blockchain module.`,
    },

    // blockchain > block database
    {
      type: 'popup',
      target: '#comp-node-blockchain-dashboard__block-database-tab-handle',
      title: 'Blockchain > Block Database',
      body: `Switch to the "Block Database" tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-blockchain-dashboard--tab-content-container',
      title: 'Blockchain > Block Database',
      body: `Each node in a blockchain network has the ability to keep a complete history of the blocks created up to that point. This tab gives you that information for our simulated blockchain. Invalid blocks won't be shown, as they will get rejected automatically.`,
    },

    // blockchain > transaction pool
    {
      type: 'popup',
      target: '#comp-node-blockchain-dashboard__transaction-pool-tab-handle',
      title: 'Blockchain > Transaction Pool',
      body: `Switch to the "Transaction Pool" tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-blockchain-dashboard--tab-content-container',
      title: 'Blockchain > Transaction Pool',
      body: `This tab shows valid transactions this node received that are not yet included in a block. Transaction are added to a "Mempool" (aka "memory pool" or simply "transaction pool") before they are included in a block.`,
    },

    // blockchain > wallet
    {
      type: 'popup',
      target: '#comp-node-blockchain-dashboard__wallet-tab-handle',
      title: 'Blockchain > Wallet',
      body: `Switch to the "Wallet" tab.`,
    },
    {
      type: 'popup',
      target: '.comp-node-blockchain-dashboard--tab-content-container',
      title: 'Blockchain > Wallet',
      body: `Wallet tab serves three pusposes. The first is holding a "key pair" and an "address" for this node. The second purpose is displaying this node's Unspent Transaction Outputs, or UTXOs for short. Funds of a blockchain address is basically the sum of the values of its UTXOs. And thirdly, new transactions are also created from this tab.`,
    },

    // blockchain > miner
    {
      type: 'popup',
      target: '#comp-node-blockchain-dashboard__miner-tab-handle',
      title: 'Blockchain > Miner',
      body: `Switch to the "Miner" tab. "(Idle)" indicates that the miner module of this node is currently not mining a block.`,
    },
    {
      type: 'popup',
      target: '.comp-node-blockchain-dashboard--tab-content-container',
      title: 'Blockchain > Miner',
      body: `This tab is where you can "mine" new blocks for your simulated blockchain. What you see right now is the configuration view. There is also a mining view which is displayed while this node's miner is working. We will go over it in more detail in another lesson.`,
    },
  ],
};
