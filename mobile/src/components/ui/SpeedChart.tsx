import { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { SpeedPoint } from '../../data/mock';

// Figma: "Speed versus elapsed time" chart on the previous-session screen.
// Layout numbers match the 306px-wide mobile frame; the width stretches to fit.
const LEFT = 30; // space for the km/h labels
const RIGHT = 18;
const TOP = 18;
const PLOT_H = 113;
const HEIGHT = 168; // includes the axis labels underneath
const MAX_KMH = 100;
const GRID = [100, 75, 50, 25, 0];

export function SpeedChart({ points }: { points: SpeedPoint[] }) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const plotW = Math.max(width - LEFT - RIGHT, 1);
  const tEnd = points.length ? points[points.length - 1].t : 1;
  const x = (t: number) => LEFT + (t / tEnd) * plotW;
  const y = (v: number) => TOP + PLOT_H - (Math.min(v, MAX_KMH) / MAX_KMH) * PLOT_H;

  const curve = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const area = points.length ? `${curve} L${x(tEnd).toFixed(1)},${TOP + PLOT_H} L${LEFT},${TOP + PLOT_H} Z` : '';
  const last = points[points.length - 1];

  const quarters = [0, 0.25, 0.5, 0.75, 1].map((f) => f * tEnd);

  return (
    <View style={{ height: HEIGHT, width: '100%' }} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="speedArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#A6E0FA" stopOpacity={0.28} />
              <Stop offset="1" stopColor="#A6E0FA" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {GRID.map((g) => (
            <Rect key={g} x={LEFT} y={y(g)} width={plotW} height={1} fill={colors.white} opacity={0.12} />
          ))}
          {!!area && <Path d={area} fill="url(#speedArea)" />}
          {!!curve && <Path d={curve} stroke={colors.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
          {last && <Circle cx={x(last.t)} cy={y(last.v)} r={4} fill={colors.accent} />}
        </Svg>
      )}

      {/* Labels as RN Text so they use the loaded Inter font */}
      <Text style={[styles.axis, { left: 0, top: 0 }]}>km/h</Text>
      {GRID.map((g) => (
        <Text key={g} style={[styles.axis, { left: 0, top: y(g) - 6 }]}>{g}</Text>
      ))}
      {width > 0 &&
        quarters.map((t, i) => (
          <Text
            key={i}
            style={[styles.xLabel, i === 4 && styles.xLabelEnd, { left: x(t) - (i === 0 ? 0 : i === 4 ? 12 : 8), top: 140 }]}
          >
            {t === 0 ? '0' : t.toFixed(1)}
          </Text>
        ))}
      <Text style={[styles.axis, styles.xTitle]}>Elapsed time (s)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: { position: 'absolute', fontFamily: fonts.regular, fontSize: 9, lineHeight: 11, color: colors.accent },
  xLabel: { position: 'absolute', fontFamily: fonts.regular, fontSize: 10, lineHeight: 13, color: colors.accent },
  xLabelEnd: { fontFamily: fonts.semibold, color: colors.white },
  xTitle: { top: 157, left: 0, right: 0, textAlign: 'center' },
});
