import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IDivider {
    color: string,
    thickness: number,
    isCenter: boolean,
    CWidth: string
}
const Divider = ({ color = '#cccccc', thickness = 1, isCenter = true,  CWidth = '90%' }) => {
  return (
    <View
      style={
        { backgroundColor: color, height: thickness, alignSelf: isCenter ? 'center' : 'auto', width: CWidth, marginTop: 10 }
      }
    />
  );
};

export default Divider;
