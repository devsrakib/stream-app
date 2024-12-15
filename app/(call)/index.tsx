import LogoutConfirmationModal from '@/components/call/LogoutModal'
import { Colors } from '@/constants/Colors'
import { formatSlug } from '@/lib/slug'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Call, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verticalScale } from 'react-native-size-matters'

export default function Page() {
  const [isModalVisible, setModalVisible] = useState(false)
  const { signOut } = useAuth()
  const client = useStreamVideoClient();
  const { user } = useUser()
  const router = useRouter();
  const [calls, setCalls] = useState<Call[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMyCalls, setIsMyCalls] = useState<Call[]>([])

  const handleLogout = () => {
    setModalVisible(true)

  }


  const fetchCalls = async () => {
    // if (!client || !user) return
    const { calls } = await client?.queryCalls({
      filter_conditions: isMyCalls ? {
        $or: [
          { created_by_user_id: user.id },
          {
            members: {
              $in: [user.id]
            }
          }
        ]
      } : {},
      sort: [{ field: 'created_at', direction: -1 }],
      watch: true
    });
console.log(calls, '::::::::');

    const sortedCalls = calls.sort((a, b) => b.state.participantCount - a.state.participantCount)

    setCalls(sortedCalls)

  }

  useEffect(() => {
    fetchCalls()
  }, [])



  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchCalls()
    setIsRefreshing(false)
  }

  const handleJoinRoom = (id: string) => {
    router.push(`/(call)/${id}`)
  }

  console.log(calls);
  

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View style={styles.topSection}>
        <View style={styles.switchSection}>
          <TouchableOpacity>
            <Text>All Call</Text>
          </TouchableOpacity>
          <Switch />
          <TouchableOpacity>

            <Text>My Call</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="exit-run" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>


        <FlatList
          data={calls}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleJoinRoom(item?.id)} disabled={item?.state.participantCount === 0} style={[styles.callContainer, { backgroundColor: item?.state?.participantCount === 0 ? '#f1f1f1' : Colors.white, opacity: item?.state?.participantCount === 0 ? 0.5 : 1, borderBottomColor: item?.state?.participantCount === 0 ? '#f1f1f1' : Colors.white, borderBottomWidth: 1, padding: 20 }]} >
              <View>
                <Text>{item.id}</Text>
                <Text>{item?.state?.createdBy?.name || item?.state?.createdBy?.custom?.email?.split("@")[0]}</Text>
                <Text>{item?.state?.createdBy?.custom?.email}</Text>
                <View>
                  <Text>{formatSlug(item?.id)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshing={isRefreshing}

          onRefresh={handleRefresh}

        />
      </View>

      <LogoutConfirmationModal visible={isModalVisible} onClose={() => setModalVisible(false)} onLogout={signOut} />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'row',
    // alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,

  },
  switchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    alignSelf: 'center',
    flex: 1
  },
  bodyContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flex: 1,
  },
  callContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    height: 60
  },
  logoutButton: {
    alignSelf: 'flex-end'

  }
})