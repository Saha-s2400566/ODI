import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import { scanNetworkSafe } from '../services/scanner';

type NetworkNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
};

const NODE_WIDTH = 92;
const NODE_HEIGHT = 54;

const initialNodes: NetworkNode[] = [
  { id: 'router', label: 'Router', x: 170, y: 90, color: '#34d399' },
  { id: 'switch', label: 'Switch', x: 170, y: 205, color: '#60a5fa' },
  { id: 'pc1', label: 'PC 01', x: 55, y: 205, color: '#fbbf24' },
  { id: 'pc2', label: 'PC 02', x: 285, y: 205, color: '#f472b6' },
  { id: 'printer', label: 'Printer', x: 170, y: 340, color: '#a78bfa' },
];

const connectors = [
  ['router', 'switch'],
  ['switch', 'pc1'],
  ['switch', 'pc2'],
  ['switch', 'printer'],
];

export default function ChartScreen() {
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [size, setSize] = useState({ width: 320, height: 440 });

  useEffect(() => {
    let active = true;

    scanNetworkSafe().then((devices) => {
      if (!active) return;

      if (!devices || devices.length === 0) return;

      const nextNodes = devices.slice(0, 5).map((device, index) => {
        const positions = [
          { x: 170, y: 90 },
          { x: 170, y: 205 },
          { x: 55, y: 205 },
          { x: 285, y: 205 },
          { x: 170, y: 340 },
        ];

        const colorMap = {
          gateway: '#34d399',
          server: '#60a5fa',
          host: '#fbbf24',
          device: '#f472b6',
          network: '#a78bfa',
        };

        const point = positions[index % positions.length];
        return {
          id: String(device.ip || device.id || index),
          label: device.name || `Device ${index + 1}`,
          x: point.x,
          y: point.y,
          color: colorMap[device.type as keyof typeof colorMap] || '#34d399',
        };
      });

      if (nextNodes.length > 0) {
        setNodes(nextNodes);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const updateNodePosition = (nodeId: string, dx: number, dy: number) => {
    setNodes((current) =>
      current.map((node) => {
        if (node.id !== nodeId) return node;

        return {
          ...node,
          x: clamp(node.x + dx, NODE_WIDTH / 2 + 10, size.width - NODE_WIDTH / 2 - 10),
          y: clamp(node.y + dy, NODE_HEIGHT / 2 + 10, size.height - NODE_HEIGHT / 2 - 10),
        };
      })
    );
  };

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const getConnectorLayout = (from: string, to: string) => {
    const fromNode = nodeMap.get(from);
    const toNode = nodeMap.get(to);

    if (!fromNode || !toNode) {
      return null;
    }

    const fromX = fromNode.x;
    const fromY = fromNode.y;
    const toX = toNode.x;
    const toY = toNode.y;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return {
      left: fromX,
      top: fromY,
      width: distance,
      rotate: `${angle}deg`,
    };
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topology</Text>
      <View style={styles.map} onLayout={handleLayout}>
        {connectors.map(([from, to]) => {
          const connector = getConnectorLayout(from, to);
          if (!connector) return null;

          const fromNode = nodeMap.get(from);
          const toNode = nodeMap.get(to);
          const isHorizontal = Math.abs(connector.width) > 0;

          return (
            <View
              key={`${from}-${to}`}
              style={[
                styles.line,
                {
                  left: fromNode ? fromNode.x : connector.left,
                  top: fromNode ? fromNode.y : connector.top,
                  width: connector.width,
                  transform: [{ rotate: connector.rotate }],
                  opacity: isHorizontal ? 0.95 : 1,
                },
              ]}
            />
          );
        })}

        {nodes.map((node) => {
          const responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
              updateNodePosition(node.id, gestureState.dx, gestureState.dy);
            },
          });

          return (
            <View
              key={node.id}
              {...responder.panHandlers}
              style={[
                styles.node,
                {
                  left: node.x - NODE_WIDTH / 2,
                  top: node.y - NODE_HEIGHT / 2,
                  borderColor: node.color,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                },
              ]}
            >
              <View style={[styles.nodeGlow, { backgroundColor: node.color }]} />
              <Text style={styles.nodeText}>{node.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020', padding: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  map: {
    flex: 1,
    backgroundColor: '#0f1724',
    borderRadius: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  node: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0b1220',
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  nodeGlow: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    top: -6,
    right: -4,
    opacity: 0.9,
  },
  nodeText: { color: '#f8fafc', fontWeight: '700', fontSize: 12, letterSpacing: 0.2 },
  line: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#4ade80',
    borderRadius: 999,
    opacity: 0.95,
    shadowColor: '#4ade80',
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    zIndex: 0,
  },
});
