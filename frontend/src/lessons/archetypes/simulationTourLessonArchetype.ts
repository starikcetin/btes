import { LessonArchetype } from '../framework/LessonArchetype';

export const simulationTourLessonArchetype: LessonArchetype = {
  lessonUid: 'simulationTour',
  displayName: 'Simulation Tour',
  summary: 'This lesson will teach you the basics of a simulation.',
  steps: [
    {
      type: 'modal',
      title: 'Simulation Tour',
      body:
        'Welcome to the simulation tour. This lesson will walk you through different parts of a simulation and help you get familiar with the platform.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--toolbox',
      title: 'Toolbar',
      body:
        "This bar includes various utilities that will help you control a simulation. Let's go over them one-by-one.",
    },
    {
      type: 'popup',
      target: '#comp-simulation--toolbox__undo-button',
      title: 'Undo Button',
      body:
        'This button will undo you latest actions in the simulaiton. Not all actions are undoable.',
    },
    {
      type: 'popup',
      target: '#comp-simulation--toolbox__redo-button',
      title: 'Redo Button',
      body:
        'This button will re-perform the actions that were previously undone. The redo stack will get reset if you make a change to the simulation.',
    },
    {
      type: 'popup',
      target: '#comp-simulation--toolbox__pause-resume-button',
      title: 'Pause/Resume Button',
      body:
        'This button will pause or resume the simulation. Only the network activity between the nodes will be paused. The actions within the nodes will continue as normal (for example: mining).',
    },
    {
      type: 'popup',
      target: '.comp-simulation--time-scale',
      title: 'Time Scale',
      body:
        'This field will adjust the time scale for network activity between the nodes. The higher it is, the faster the network activity. Setting it to 0 will have the same effect as pausing the simulation.',
    },
    {
      type: 'popup',
      target: '#comp-simulation--toolbox__save-button',
      title: 'Save Button',
      body:
        'This button will save the current state of the simulation to the database, so you can resume it later on. Save is only available after logging-in. You need to pause a simulation before saving it.',
    },
    {
      type: 'popup',
      target: '#comp-simulation--toolbox__export-button',
      title: 'Export Button',
      body:
        'This button works just like the save button, but instead of saving to a database, it saves the simulation to a file. Log-in not required. You need to pause a simulation before exporting it.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'The Board',
      body:
        'This is the simulation board. Nodes in the simulation will appear here as icons, and their connections will be visualized with lines.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Creating a Node',
      body:
        "Try right clicking on the board, and select the 'Create Node' option. A node icon should appear on the board.",
    },
    {
      type: 'popup',
      target: '.comp-simulation-node--node-card',
      title: 'The Node',
      body:
        "Here it is! Each one of these icons represents a single node in the simulation. The text on the screen is a truncated version of this node's unique ID.",
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Naming a Node',
      body:
        'Nodes can have custom names that will be displayed instead of the unique ID. Right click on the node icon and select "Rename". Input a custom name and click the "OK" button.',
    },
    {
      type: 'popup',
      target: '.comp-simulation-node--node-card',
      title: 'Naming a Node',
      body: `If a node has a custom name, the custom name will be displayed on the icon instead of its unique ID. If you want to remove a nodes's custom name, simply leave the input field empty before hitting the "OK" button while renaming.`,
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Arranging the Board',
      body:
        'You can move nodes around. Try dragging the node icon to a new location.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Deleting a Node',
      body:
        'You can delete nodes as well. Right click on the node icon and select "Delete Node". The node icon should disappear.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Connecting Nodes 1',
      body:
        'Nodes need to be connected to one another in order to communicate. Create two new nodes on the board.',
    },
    {
      type: 'popup',
      target: '.comp-simulation-node--node-card',
      title: 'Connecting Nodes 2',
      body: 'Double click on this node to open up the node details window.',
    },
    {
      type: 'popup',
      target: '.comp-node-modal',
      title: 'Connecting Nodes 3',
      body:
        'This is the node details window. It will be explained in the next lesson.',
    },
    {
      type: 'popup',
      target: '.comp-node-modal--network-tab-handle',
      title: 'Connecting Nodes 4',
      body: 'Switch to the Network tab.',
    },
    {
      type: 'popup',
      target: '#comp-node-network-dashboard__action-column',
      title: 'Connecting Nodes 5',
      body: 'Select the other node from the dropdown and click "Connect".',
    },
    {
      type: 'popup',
      target: '#comp-node-network-dashboard__display-column',
      title: 'Connecting Nodes 6',
      body:
        'The new node should appear in the table as an entry. Do not do it now, but you can click on "Disconnect" whenever you want to remove the connection between these nodes.',
    },
    {
      type: 'popup',
      target: '.comp-node-modal',
      title: 'Connecting Nodes 7',
      body:
        'Click on the "X" ath the top right of this modal window to close it.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Connecting Nodes 8',
      body:
        'Can you see the line between the two nodes? It indicates they are connected.',
    },
    {
      type: 'popup',
      target: '.comp-simulation--board',
      title: 'Changing Connection Latency',
      body:
        'Each connection has a latency associated with it. You can see and change it in the connection details modal. Double click on the line between the nodes to open the connection details modal.',
    },
    {
      type: 'popup',
      target: '.comp-node-connection-modal',
      title: 'Changing Connection Latency',
      body: `You can see and change the connection's latency here. The network activity between two connected nodes is guaranteed to be delayed at least by that duration. Click on the "X" at the top right to close the modal.`,
    },
  ],
};
