import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { WIDTH } from '@/constants/constants.global'
import { Colors } from '@/constants/Colors'
import { RADIUS } from '@/constants/Radius'
import { FONTS } from '@/constants/Fonts'
import { verticalScale } from 'react-native-size-matters'

type IButton = {
  title: string,
  width?: string | number | any,
  titleColor: string,
  bold?: '600' | '500' | '400' | "700",
  marginBottom?: number,
  onPress?: () => Promise<void>,
  style?: any,
}
const Button = ({ title, width = verticalScale(300), titleColor, bold = '400', onPress, marginBottom = 10, style,  }: IButton) => {
  return (
    <TouchableOpacity style={[styles.container, { width: width, marginBottom: marginBottom, ...style }]} onPress={onPress} >
      <Text style={[styles.title, { color: titleColor, fontWeight: bold }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: RADIUS.MEDIUM
  },
  title: {
    fontSize: FONTS.REGULAR
  }
})