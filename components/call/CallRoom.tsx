import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { CallContent } from '@stream-io/video-react-native-sdk'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { useRouter } from 'expo-router';
import { RADIUS } from '@/constants/Radius';
import { Colors } from '@/constants/Colors';
import { copySlug, formatSlug } from '@/lib/slug';
export default function CallRoom({slug}:{slug: string}) {
    const router = useRouter();
  return (
    <View>
        <View>
<RoomId slug={slug} />
        </View>
        <GestureHandlerRootView style={{flex: 1}}>
      <CallContent onHangupCallHandler={() => router.back()} />
        </GestureHandlerRootView>
    </View>
  )
}


const RoomId = ({slug}: {slug: string | null}) =>{
    return(
        <TouchableOpacity onPress={() => {copySlug}}
        style={styles.callIdCon}>
<Text>call ID: {formatSlug(slug)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    callIdCon:{
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: RADIUS.SMALL, 
}
,callIdText:{
    color: Colors.white,
}

})