/* eslint-disable react/prop-types */
// src/Tree.js
import React, { useState } from 'react';
import Icons from '../../../components/icons';
import ZsTooltip from '../../../components/tooltip';

const TreeNode = ({
  node, level = 0, nodeKey = '', randomID,
}) => {
  const [expanded, setExpanded] = useState(false);

  const colors = {
    Lookup: '#cd9a46',
    'User Criticality': '#0990bf',
    'Alert Criticality': '#52c0bf',
    'Asset Vulnerability': '#99bd45',
    'Asset Criticality': '#f16075',
  };

  // Extract Score if present and exclude it from the children list
  const score = node?.score !== undefined ? node.score : null;
  const filteredNode = { ...node };
  delete filteredNode.score;

  const hasChildren = typeof filteredNode === 'object' && Object.keys(filteredNode).length > 0;

  // Skip rendering level 2 nodes and move children up one level
  if (level === 2 || (nodeKey === 'Lookup' && level === 1)) {
    return (
      <div>
        {Object.keys(filteredNode).map((key) => (
          <TreeNode
            key={key}
            node={filteredNode[key]}
            level={level + 1}
            nodeKey={key}
            randomID={randomID}
          />
        ))}
      </div>
    );
  }

  // Adjust level 3 to be level 2, and level 4 to be level 3
  const adjustedLevel = level >= 3 ? level - 1 : level;

  return (
    <div
      className="treeViewMain"
      style={{
        marginLeft: adjustedLevel * 8,
        padding: adjustedLevel === 0 ? '5px 10px' : 0,
        marginBottom: adjustedLevel === 0 ? 7 : 0,
      }}
    >
      <div className="treeViewBody">
        <div
          id={`IncidentList_Risk_Weight_Icon_${nodeKey.replace(/ /g, '_')}`}
          style={{
            cursor: 'pointer',
            opacity: !hasChildren ? 0.4 : 1,
            pointerEvents: !hasChildren ? 'none' : 'auto',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <Icons
              style={{ cursor: 'pointer' }}
              type="MinusIcon"
              icontype="globle"
              className={adjustedLevel === 0 ? `riskLevelIcon_${nodeKey.replace(/ /g, '_')}` : `riskIcon_${adjustedLevel}`}
            />
          ) : (
            <Icons
              style={{ cursor: 'pointer' }}
              type="PlusIcon"
              className={adjustedLevel === 0 ? `riskLevelIcon_${nodeKey.replace(/ /g, '_')}` : `riskIcon_${adjustedLevel}`}
              icontype="globle"
            />
          )}
        </div>
        <div
          className="treeViewBodyWrap"
          style={{ marginLeft: 7, color: colors[nodeKey] }}
        >
          <div style={{ width: adjustedLevel === 2 ? '150px' : '100%' }}>
            <ZsTooltip
              autoRight
              title={nodeKey || ''}
              subType="iconTool"
              ids={`risk_Score_key_${nodeKey}_${adjustedLevel}_${score}_${randomID}`}
            >
              <div
                className="overflowText"
                style={{ color: adjustedLevel === 1 ? '#D3D3D3' : adjustedLevel === 2 ? '#D3D3D3' : adjustedLevel === 3 ? '#008C88' : '' }}
                id={`risk_Score_key_${nodeKey}_${adjustedLevel}_${score}_${randomID}`}
              >
                {nodeKey}
              </div>
            </ZsTooltip>
          </div>
          <div style={{ color: adjustedLevel === 1 ? '#D3D3D3' : adjustedLevel === 2 ? '#D3D3D3' : adjustedLevel === 3 ? '#008C88' : '' }}>
            {score !== null && score}
          </div>
        </div>
      </div>
      {expanded && (
        <div>
          {Object.keys(filteredNode).map((key) => (
            <TreeNode
              key={key}
              node={filteredNode[key]}
              level={level + 1}
              nodeKey={key}
              randomID={randomID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree = ({ data, randomID }) => (
  <div>
    {Object.keys(data).map((key) => (
      <TreeNode key={key} node={data[key]} nodeKey={key} randomID={randomID} />
    ))}
  </div>
);

export default Tree;
