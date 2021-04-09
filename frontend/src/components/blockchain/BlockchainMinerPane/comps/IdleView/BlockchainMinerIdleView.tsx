import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useArray } from 'react-hanger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import './BlockchainMinerIdleView.scss';
import { Tree } from '../../../../../common/tree/Tree';
import { BlockchainMinerIdleState } from '../../../../../common/blockchain/miner/BlockchainMinerStateData';
import { simulationBridge } from '../../../../../services/simulationBridge';
import { RootState } from '../../../../../state/RootState';
import { hasValue } from '../../../../../common/utils/hasValue';
import { useTxsTotalFeeCalculator } from '../../../../../hooks/useTxsTotalFeeCalculator';
import { useTxFeeCalculator } from '../../../../../hooks/useTxFeeCalculator';
import { useTxInputSumCalculator } from '../../../../../hooks/useTxInputSumCalculator';
import { useTxOutputSumCalculator } from '../../../../../hooks/useTxOutputSumCalculator';
import { useTxOutputGetter } from '../../../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../../../hooks/txGetters/useTxGetterEverywhere';
import { BlockchainTxCard } from '../../../BlockchainTxCard/BlockchainTxCard';

interface BlockchainMinerIdleViewProps {
  simulationUid: string;
  nodeUid: string;
  state: BlockchainMinerIdleState;
}

export const BlockchainMinerIdleView: React.FC<BlockchainMinerIdleViewProps> = (
  props
) => {
  const { simulationUid, nodeUid, state } = props;

  const appData = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp
  );

  const tree = useMemo(() => Tree.fromJsonObject(appData.blockDb.blockchain), [
    appData.blockDb.blockchain,
  ]);

  const [coinbase, setCoinbase] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [value, setValue] = useState(appData.config.blockCreationFee);
  const [previousHash, setPreviousHash] = useState(
    tree.mainBranchHead?.id ?? ''
  );
  const [difficultyTarget, setDifficultyTarget] = useState(
    appData.config.targetLeadingZeroCount
  );

  const startMining = () => {
    simulationBridge.sendBlockchainStartMining(simulationUid, {
      nodeUid,
      miningTask: {
        blockTemplate: {
          coinbase,
          recipientAddress,
          value,
          previousHash,
          difficultyTarget,
          includedTxHashes: includedTxHashes.value,
        },
      },
    });
  };

  const ownAddress = appData.wallet.keyPair?.address;

  /* other txs */
  const txGetter = useTxGetterEverywhere({ simulationUid, nodeUid });
  const outputGetter = useTxOutputGetter(txGetter);
  const inputSumCalculator = useTxInputSumCalculator(outputGetter);
  const outputSumCalculator = useTxOutputSumCalculator();
  const txFeeCalculator = useTxFeeCalculator(
    inputSumCalculator,
    outputSumCalculator
  );
  const totalTxFeeCalculator = useTxsTotalFeeCalculator(txFeeCalculator);

  const mempoolTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .mempoolTxLookup
  );

  const mempoolTxHashes = _.keys(mempoolTxLookup);

  const includedTxHashes = useArray<string>([]);
  const includedTxLookup = _.pick(mempoolTxLookup, includedTxHashes.value);

  const notIncludedTxHashes = _.without(
    mempoolTxHashes,
    ...includedTxHashes.value
  );
  const notIncludedTxLookup = _.pick(mempoolTxLookup, notIncludedTxHashes);

  const includedTxsTotalFee = totalTxFeeCalculator(_.values(includedTxLookup));

  const includeTx = (txHash: string) => includedTxHashes.push(txHash);
  const excludeTx = (txHash: string) =>
    includedTxHashes.removeIndex(includedTxHashes.value.indexOf(txHash));

  return (
    <div className="comp-blockchain-miner-idle-view">
      <Card>
        <Card.Header>Block Template</Card.Header>
        <Card.Body>
          <Form>
            <Card.Title>Coinbase Transaction</Card.Title>
            <Card.Text className="text-muted">
              Each miner has the right to put a single transaction at the top of
              the block they are creating, which generates currency out of thin
              air. This transaction is called a <b>coinbase transaction</b>.
            </Card.Text>

            <Form.Group>
              <Form.Label>Coinbase</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Arbitrary data to be put in the coinabase transaction's input..."
                value={coinbase}
                onChange={(e) => setCoinbase(e.target.value)}
              />
              <Form.Text className="text-muted">
                This field carries no algorithmic significance. Fill it to your
                heart's content.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Recipient Address</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Base58 encoded blockchain address of the recipient..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    disabled={!hasValue(ownAddress)}
                    variant="info"
                    onClick={() =>
                      setRecipientAddress(ownAddress ?? recipientAddress)
                    }
                    title={
                      hasValue(ownAddress)
                        ? 'Set to own blockchain address.'
                        : 'This node does not have a blockchain address yet.'
                    }
                  >
                    Set to own address
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                Please note that we use <code>base58</code> encoding for the
                addresses and keys, not <code>base58check</code>.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Value</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number.parseFloat(e.target.value))}
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    title="Automatically select a value based on the blockchain configuration of this simulation."
                    onClick={() => setValue(appData.config.blockCreationFee)}
                  >
                    Use configuration
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The amount of currency generated by this block, mining reward.
                Setting this above what the blockchain configuration allows will
                cause other nodes to reject this block.
              </Form.Text>
            </Form.Group>

            <hr />
            <Card.Title>Block Header</Card.Title>
            <Card.Text className="text-muted">
              These fields are about the block itself.
            </Card.Text>

            <Form.Group>
              <Form.Label>Previous Hash</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Hash of the parent block..."
                  value={previousHash}
                  onChange={(e) => setPreviousHash(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    onClick={() =>
                      setPreviousHash(tree.mainBranchHead?.id ?? '')
                    }
                  >
                    Set to active branch leaf
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                Selecting the leaf of the active branch as the previous block
                (which means extending the main branch) minimises the chances of
                this block becoming <em>stale</em>.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Difficulty Target</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={difficultyTarget}
                  onChange={(e) =>
                    setDifficultyTarget(Number.parseInt(e.target.value))
                  }
                />
                <InputGroup.Append>
                  <Button
                    variant="info"
                    title="Automatically select a value based on the blockchain configuration of this simulation."
                    onClick={() =>
                      setDifficultyTarget(appData.config.targetLeadingZeroCount)
                    }
                  >
                    Use configuration
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                The amount of leading zeros this block's hash must have. Setting
                this below what the blockchain configuration requires will cause
                other nodes to reject this block.
              </Form.Text>
            </Form.Group>

            <hr />
            <Card.Title>Other Transactions</Card.Title>
            <Card.Text className="text-muted">
              You can add other transacitons to your block in order to collect
              their <b>transaction fees</b>.
            </Card.Text>

            <Card>
              <Card.Header>
                <span>
                  Included Transactions ({includedTxHashes.value.length})
                </span>
                <span className="float-right">
                  Total fee:{' '}
                  <code>
                    {isNaN(includedTxsTotalFee) ? '?' : includedTxsTotalFee}
                  </code>
                </span>
              </Card.Header>
              <Card.Body>
                {includedTxHashes.value.length <= 0 ? (
                  <Card.Text className="text-muted">
                    No transactions included.
                  </Card.Text>
                ) : (
                  includedTxHashes.value.map((txHash) => (
                    <BlockchainTxCard {...props} tx={includedTxLookup[txHash]}>
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-0"
                        onClick={() => excludeTx(txHash)}
                      >
                        <FontAwesomeIcon size="sm" icon={faMinus} />
                      </Button>
                    </BlockchainTxCard>
                  ))
                )}
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Header>
                Available Transactions in Mempool ({notIncludedTxHashes.length})
              </Card.Header>
              <Card.Body>
                {notIncludedTxHashes.length <= 0 ? (
                  <Card.Text className="text-muted">
                    No available transactions.
                  </Card.Text>
                ) : (
                  notIncludedTxHashes.map((txHash) => (
                    <BlockchainTxCard
                      {...props}
                      tx={notIncludedTxLookup[txHash]}
                    >
                      <Button
                        variant="success"
                        size="sm"
                        className="py-0"
                        onClick={() => includeTx(txHash)}
                      >
                        <FontAwesomeIcon size="sm" icon={faPlus} />
                      </Button>
                    </BlockchainTxCard>
                  ))
                )}
              </Card.Body>
            </Card>
          </Form>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center">
          <Button variant="success" onClick={() => startMining()}>
            Start Mining
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
