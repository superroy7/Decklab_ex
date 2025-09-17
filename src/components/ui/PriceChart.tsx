import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native';
import { PriceHistoryPoint } from '../../types/global';

interface PriceChartProps {
  data: PriceHistoryPoint[];
  title?: string;
  height?: number;
  showArea?: boolean;
  color?: string;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32;

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  title = 'Price History',
  height = 200,
  showArea = true,
  color = '#FFD700',
}) => {
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No price data available</Text>
        </View>
      </View>
    );
  }

  // Transform data for Victory charts
  const chartData = data.map((point, index) => ({
    x: index,
    y: point.price,
    date: point.date,
  }));

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  return (
    <View style={[styles.container, { height: height + 60 }]}>
      <Text style={styles.title}>{title}</Text>
      
      <VictoryChart
        theme={VictoryTheme.material}
        width={CHART_WIDTH}
        height={height}
        padding={{ left: 60, top: 20, right: 20, bottom: 40 }}
        domain={{
          y: [Math.max(0, minPrice - padding), maxPrice + padding]
        }}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `$${t.toFixed(0)}`}
          style={{
            axis: { stroke: '#333' },
            tickLabels: { fill: '#999', fontSize: 10 },
            grid: { stroke: '#222', strokeDasharray: '2,2' },
          }}
        />
        
        <VictoryAxis
          tickFormat={() => ''}
          style={{
            axis: { stroke: '#333' },
            tickLabels: { fill: 'transparent' },
          }}
        />

        {showArea && (
          <VictoryArea
            data={chartData}
            style={{
              data: { 
                fill: `${color}30`, 
                stroke: color, 
                strokeWidth: 2 
              }
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
          />
        )}

        <VictoryLine
          data={chartData}
          style={{
            data: { stroke: color, strokeWidth: 3 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>

      <View style={styles.priceInfo}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Current</Text>
          <Text style={styles.priceValue}>
            ${data[data.length - 1]?.price.toFixed(2) || '0.00'}
          </Text>
        </View>
        
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>High</Text>
          <Text style={styles.priceValue}>${maxPrice.toFixed(2)}</Text>
        </View>
        
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Low</Text>
          <Text style={styles.priceValue}>${minPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
});